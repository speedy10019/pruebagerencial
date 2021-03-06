# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright (c) 2019 Nexedi SA and Contributors. All Rights Reserved.
#                    Arnaud Fontaine <arnaud.fontaine@nexedi.com>
#
# WARNING: This program as such is intended to be used by professional
# programmers who take the whole responsibility of assessing all potential
# consequences resulting from its eventual inadequacies and bugs
# End users who are looking for a ready-to-use solution with commercial
# guarantees and support are strongly adviced to contract a Free Software
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
# Foundation, Inc., 51 Franklin Street - Fifth Floor, Boston, MA 02110-1301, USA.
#
##############################################################################

from Products.ERP5Type.Core.DocumentComponent import DocumentComponent

from AccessControl import ClassSecurityInfo
from Products.ERP5Type import Permissions

import zope.interface
import re
from Products.ERP5Type.ConsistencyMessage import ConsistencyMessage
from Products.ERP5Type.interfaces.component import IComponent

from Products.CMFCore import utils

@zope.interface.implementer(IComponent)
class ToolComponent(DocumentComponent):
  """
  ZODB Component for Tools, used to be found on Products.XXX.Tool on FS
  """
  meta_type = 'ERP5 Tool Component'
  portal_type = 'Tool Component'

  security = ClassSecurityInfo()
  security.declareObjectProtected(Permissions.AccessContentsInformation)

  _message_meta_type_invalid = "'meta_type' class property must be '${meta_type}'"
  def checkConsistency(self, *args, **kw):
    """
    """
    error_list = super(ToolComponent, self).checkConsistency(*args ,**kw)
    if not error_list:
      expected_meta_type = 'ERP5 ' + ''.join([(c if c.islower() else ' ' + c)
                                              for c in self.getReference()]).strip()
      # XXX Handle a few exceptions, following the same rules as in
      # ERP5Site_checkNamingConventions
      expected_meta_type = expected_meta_type\
        .replace(' S M S ', ' SMS ')\
        .replace(' O Auth ', ' OAuth ')
      if re.search(r'^\s*meta_type\s*=\s*[\'"]%s[\'"]\s*$' % expected_meta_type,
                   self.getTextContent(), re.MULTILINE) is None:
        error_list.append(ConsistencyMessage(
          self,
          self.getRelativeUrl(),
          message=self._message_meta_type_invalid,
          mapping={'meta_type': expected_meta_type}))

    return error_list

  def _hookAfterLoad(self, module_obj):
    """
    Register Tool so that it can be added in ZMI through manage_addToolForm.

    For FS Tools, this is done during Product initialize() by
    Products.CMFCore.utils.ToolInit.
    """
    tool_class = getattr(module_obj, self.getReference(validated_only=True))

    # Should we really use ERP5 Product and not ERP5Type considering that ERP5
    # may be gone at some point? Or the other way around? For now, all tools
    # have meta_type='ERP5 ...' so just use ERP5 Product.
    import Products.ERP5
    toolinit = Products.ERP5.__FactoryDispatcher__.toolinit
    # Products.CMFCore.utils.ToolInit.initialize()
    tool_class.__factory_meta_type__ = toolinit.meta_type
    tool_class.icon = 'misc_/%s/%s' % ('ERP5', toolinit.icon)
    toolinit.tools.add(tool_class)

  @staticmethod
  def _getFilesystemPath():
    # TODO-arnau: useful?
    raise NotImplementedError

  @staticmethod
  def _getDynamicModuleNamespace():
    return 'erp5.component.tool'

  @staticmethod
  def getIdPrefix():
    return 'tool'
