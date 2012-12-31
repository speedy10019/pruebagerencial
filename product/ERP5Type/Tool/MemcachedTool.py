# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright (c) 2006 Nexedi SARL and Contributors. All Rights Reserved.
#                    Vincent Pelletier <vincent@nexedi.com>
#
# WARNING: This program as such is intended to be used by professional
# programmers who take the whole responsability of assessing all potential
# consequences resulting from its eventual inadequacies and bugs
# End users who are looking for a ready-to-use solution with commercial
# garantees and support are strongly adviced to contract a Free Software
# Service Company
#
# This program is Free Software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
#
##############################################################################

from threading import local
from Products.ERP5Type.Tool.BaseTool import BaseTool
from Products.ERP5Type import Permissions, _dtmldir
from AccessControl import ClassSecurityInfo
from Products.ERP5Type.Globals import DTMLFile, InitializeClass
from quopri import encodestring

MEMCACHED_TOOL_MODIFIED_FLAG_PROPERTY_ID = '_v_memcached_edited'
class _MemcacheTool(BaseTool):
  id = "portal_memcached"
  meta_type = "ERP5 Memcached Tool"
  portal_type = "Memcached Tool"
  manage_options = (
    {
      'label': 'Configure',
      'action': 'memcached_tool_configure',
    },
  ) + BaseTool.manage_options

try:
  import memcache
except ImportError:
  memcache = None

def encodeKey(key):
  """
    Encode the key like 'Quoted Printable'.
  """
  # According to the memcached's protocol.txt, the key cannot contain
  # control characters and white spaces.
  return encodestring(key, True).replace('\n', '').replace('\r', '')

memcached_dict_pool = local()
if memcache is not None:
  # Real memcache tool
  from Shared.DC.ZRDB.TM import TM
  from Products.PythonScripts.Utility import allow_class
  from zLOG import LOG
  
  MARKER = object()
  DELETE_ACTION = 0
  UPDATE_ACTION = 1

  class MemcachedDict(TM):
    """
      Present memcached similarly to a dictionary (not all method are
      available).
      Uses transactions to only update memcached at commit time.
      No conflict generation/resolution : last edit wins.
    """
    def __init__(self, server_list, expiration_time=0,
          server_max_key_length=memcache.SERVER_MAX_KEY_LENGTH,
          server_max_value_length=memcache.SERVER_MAX_VALUE_LENGTH,
        ):
      # connection cache with duration limited to transaction length.
      self.local_cache = {}
      # Each key in scheduled_action_dict must be handled at commit.
      # UPDATE_ACTION: send local_cache value to server
      # DELETE_ACTION: delete on server
      self.scheduled_action_dict = {}
      self.server_list = server_list
      self.expiration_time = expiration_time
      self.server_max_key_length = server_max_key_length
      self.server_max_value_length = server_max_value_length
      self._initialiseConnection()

    def _initialiseConnection(self):
      try:
        self.memcached_connection.disconnect_all()
      except AttributeError:
        pass
      self.memcached_connection = memcache.Client(
        self.server_list,
        server_max_key_length=self.server_max_key_length,
        server_max_value_length=self.server_max_value_length,
      )

    def __del__(self):
      """
        Close connection before deleting object.
      """
      self.memcached_connection.disconnect_all()

    def _finish(self, *ignored):
      """
        Actually modifies the values in memcached.
        This avoids multiple accesses to memcached during the transaction.
        Invalidate all local cache to make sure changes donc by other zopes
        would not be ignored.
      """
      try:
        expiration_time = self.expiration_time
        for key, value in self.local_cache.iteritems():
          if getattr(value, MEMCACHED_TOOL_MODIFIED_FLAG_PROPERTY_ID, None):
            delattr(value, MEMCACHED_TOOL_MODIFIED_FLAG_PROPERTY_ID)
            self.scheduled_action_dict[key] = UPDATE_ACTION
        for key, action in self.scheduled_action_dict.iteritems():
          encoded_key = encodeKey(key)
          if action is UPDATE_ACTION:
            succeed = self.memcached_connection.set(encoded_key,
                                                    self.local_cache[key],
                                                    expiration_time)
            if not succeed:
              self._initialiseConnection()
              succeed = self.memcached_connection.set(encoded_key,
                                                      self.local_cache[key],
                                                      expiration_time)
              if not succeed:
                LOG('MemcacheTool', 0, 'set command to memcached server (%r) failed' % (self.server_list,))
          elif action is DELETE_ACTION:
            succeed = self.memcached_connection.delete(encoded_key, 0)
            if not succeed:
              self._initialiseConnection()
              succeed = self.memcached_connection.delete(encoded_key, 0)
              if not succeed:
                LOG('MemcacheTool', 0, 'delete command to memcached server (%r) failed' % (self.server_list,))
      except:
        LOG('MemcachedDict', 0, 'An exception occured during _finish', error=True)
      self.__cleanup()

    def _abort(self, *ignored):
      self.__cleanup()

    def __cleanup(self):
      self.local_cache.clear()
      self.scheduled_action_dict.clear()

    def __getitem__(self, key):
      """
        Get an item from local cache, otherwise from memcached.
      """
      # We need to register in this function too to be able to flush cache at 
      # transaction end.
      self._register()
      if self.scheduled_action_dict.get(key) == DELETE_ACTION:
        raise KeyError
      result = self.local_cache.get(key, MARKER)
      if result is MARKER:
        encoded_key = encodeKey(key)
        try:
          result = self.memcached_connection.get(encoded_key)
        except memcache.Client.MemcachedConnectionError:
          self._initialiseConnection()
          try:
            result = self.memcached_connection.get(encoded_key)
          except memcache.Client.MemcachedConnectionError:
            # maybe the server is not available at all / misconfigured
            LOG('MemcacheTool', 0,
                'get command to memcached server (%r) failed'
                % (self.server_list,))
            raise KeyError
        self.local_cache[key] = result
      return result

    def __setitem__(self, key, value):
      """
        Set an item to local cache and schedule update of memcached.
      """
      self._register()
      self.scheduled_action_dict[key] = UPDATE_ACTION
      self.local_cache[key] = value

    def __delitem__(self, key):
      """
        Schedule key for deletion in memcached.
        Set the value to None in local cache to avoid gathering the value
        from memcached.
        Never raises KeyError because action is delayed.
      """
      self._register()
      self.scheduled_action_dict[key] = DELETE_ACTION
      self.local_cache[key] = None

    def set(self, key, value):
      return self.__setitem__(key, value)

    def get(self, key, default=None):
      try:
        return self.__getitem__(key)
      except KeyError:
        return default

  class SharedDict(object):
    """
      Class to make possible for multiple "users" to store data in the same
      dictionary without risking to overwrite other's data.
      Each "user" of the dictionary must get an instance of this class.
    """

    def __init__(self, dictionary, prefix):
      """
        dictionary
          Instance of dictionary to share.
        prefix
          Prefix used by the "user" owning an instance of this class.
      """
      self._dictionary = dictionary
      self.prefix = prefix

    def _prefixKey(self, key):
      if not isinstance(key, basestring):
        raise TypeError, 'Key %s is not a string. Only strings are supported as key in SharedDict' % (repr(key), )
      return '%s_%s' % (self.prefix, key)

    def __getitem__(self, key):
      return self._dictionary.__getitem__(self._prefixKey(key))

    def __setitem__(self, key, value):
      self._dictionary.__setitem__(self._prefixKey(key), value)

    def __delitem__(self, key):
      self._dictionary.__delitem__(self._prefixKey(key))

    # These are the method names called by zope
    __guarded_setitem__ = __setitem__
    __guarded_getitem__ = __getitem__
    __guarded_delitem__ = __delitem__

    def get(self, key, default=None):
      return self._dictionary.get(self._prefixKey(key), default)

    def set(self, key, value):
      self._dictionary.set(self._prefixKey(key), value)

  allow_class(SharedDict)

  class MemcachedTool(_MemcacheTool):
    """
      Memcached interface available as a tool.
    """
    security = ClassSecurityInfo()
    memcached_tool_configure = DTMLFile('memcached_tool_configure', _dtmldir)
    erp5_site_global_id = ''

    def _getMemcachedDict(self, plugin_path):
      """
        Return used memcached dict.
        Create it if does not exist.
      """
      try:
        local_dict = memcached_dict_pool.local_dict
      except AttributeError:
        local_dict = memcached_dict_pool.local_dict = {}
      try:
        dictionary = local_dict[plugin_path]
      except KeyError:
        memcached_plugin = self.restrictedTraverse(plugin_path, None)
        if memcached_plugin is None:
          raise ValueError, 'Memcached Plugin does not exists: %r' % (plugin_path,)
        dictionary = MemcachedDict((memcached_plugin.getUrlString(''),),
                   expiration_time=memcached_plugin.getExpirationTime(),
                   server_max_key_length=memcached_plugin.getServerMaxKeyLength(),
                   server_max_value_length=memcached_plugin.getServerMaxValueLength())
        local_dict[plugin_path] = dictionary
      return dictionary

    security.declareProtected(Permissions.AccessContentsInformation, 'getMemcachedDict')
    def getMemcachedDict(self, key_prefix, plugin_path):
      """
        Returns an object which can be used as a dict and which gets from/stores
        to memcached server.

        key_prefix
          Mandatory argument allowing different tool users to share the same
          dictionary key namespace.

        plugin_path
          relative_url of dedicated Memcached Plugin
      """
      global_prefix = self.erp5_site_global_id
      if global_prefix:
        key_prefix = '%s_%s' % (global_prefix, key_prefix)
      return SharedDict(self._getMemcachedDict(plugin_path), prefix=key_prefix)

  InitializeClass(MemcachedTool)
else:
  # Placeholder memcache tool
  class MemcachedTool(_MemcachedTool):
    """
      Dummy MemcachedTool placeholder.
    """
    title = "DISABLED"

    security = ClassSecurityInfo()

    def failingMethod(self, *args, **kw):
      """
        if this function is called and memcachedtool is disabled, fail loudly
        with a meaningfull message.
      """
      raise RuntimeError, 'MemcachedTool is disabled. You should ask the'\
        ' server administrator to enable it by installing python-memcached.'

    memcached_tool_configure = failingMethod
    getMemcachedDict = failingMethod
