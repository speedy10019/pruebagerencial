# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright (c) 2002 Nexedi SARL and Contributors. All Rights Reserved.
#                    Jean-Paul Smets-Solanes <jp@nexedi.com>
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
"""
    ERP5Type is provides a RAD environment for Zope / CMF
    All ERP5 classes derive from ERP5Type
"""

# Switch(es) for ongoing development which require single code base

# Update ERP5 Globals
import sys, Permissions, os
from App.Common import package_home
this_module = sys.modules[ __name__ ]
product_path = package_home( globals() )
this_module._dtmldir = os.path.join( product_path, 'dtml' )
from Products.ERP5Type.Utils import initializeProduct, updateGlobals
document_classes = updateGlobals( this_module,
                                  globals(),
                                  permissions_module=Permissions,
                                  is_erp5_type=1 )

import PropertySheet, ZopePatch
import interfaces

import Products.Localizer # So that we make sure Globals.get_request is available

# ClassTool will not be available unless a special file is created with
# read permissions for zope - this prevents security holes in 
# production environment  
class_tool_security_path = '%s%s%s' % (product_path, os.sep, 'ALLOW_CLASS_TOOL')

# allow our workflow definitions to be registered
import Products.ERP5Type.Workflow

def allowClassTool():
  return os.access(class_tool_security_path, os.F_OK)

def initialize( context ):
  # Import Product Components
  from Tool import (ClassTool, CacheTool, MemcachedTool, SessionTool,
                    TypesTool, WebServiceTool)
  import Document
  import Base, XMLObject
  from ERP5Type import ERP5TypeInformation
  # Define documents, classes, constructors and tools
  object_classes = ()
  content_constructors = ()
  content_classes = Base.Base, XMLObject.XMLObject, ERP5TypeInformation
  portal_tools = ( ClassTool.ClassTool,
                   CacheTool.CacheTool,
                   MemcachedTool.MemcachedTool,
                   SessionTool.SessionTool,
                   TypesTool.TypesTool,
                   WebServiceTool.WebServiceTool,
                  )
  # Do initialization step
  initializeProduct(context, this_module, globals(),
                         document_module = Document,
                         document_classes = document_classes,
                         object_classes = object_classes,
                         portal_tools = portal_tools,
                         content_constructors = content_constructors,
                         content_classes = content_classes)
  # Register our Workflow factories directly (if on CMF 2)
  Products.ERP5Type.Workflow.registerAllWorkflowFactories(context)
  # We should register local constraints at some point
  from Products.ERP5Type.Utils import initializeLocalConstraintRegistry
  initializeLocalConstraintRegistry()
  # We should register local property sheets at some point
  from Products.ERP5Type.Utils import initializeLocalPropertySheetRegistry
  initializeLocalPropertySheetRegistry()
  # We should register product classes at some point
  from Products.ERP5Type.InitGenerator import initializeProductDocumentRegistry
  initializeProductDocumentRegistry()
  # We should register local classes at some point
  from Products.ERP5Type.Utils import initializeLocalDocumentRegistry
  initializeLocalDocumentRegistry()
  # We can now setup global interactors
  from Products.ERP5Type.InitGenerator import initializeProductInteractorRegistry
  initializeProductInteractorRegistry()
  # And local interactors
  from Products.ERP5Type.Utils import initializeLocalInteractorRegistry
  initializeLocalInteractorRegistry()
  # We can now install all interactors
  from Products.ERP5Type.InitGenerator import installInteractorClassRegistry
  installInteractorClassRegistry()

from AccessControl.SecurityInfo import allow_module
from AccessControl.SecurityInfo import ModuleSecurityInfo

allow_module('Products.ERP5Type.Cache')
ModuleSecurityInfo('Products.ERP5Type.Utils').declarePublic(
    'sortValueList', 'convertToUpperCase', 'UpperCase',
    'convertToMixedCase', 'cartesianProduct', 'sleep', 'getCommonTimeZoneList',
    'int2letter', 'getMessageIdWithContext', 'getTranslationStringWithContext')

allow_module('Products.ERP5Type.Message')
ModuleSecurityInfo('Products.ERP5Type.Message').declarePublic('translateString')

allow_module('Products.ERP5Type.Error')
allow_module('Products.ERP5Type.JSONEncoder')
allow_module('Products.ERP5Type.Log')
allow_module('Products.ERP5Type.ConnectionPlugin.SOAPWSDLConnection')
ModuleSecurityInfo('Products.ERP5Type.JSON').declarePublic('dumps', 'loads')
ModuleSecurityInfo('pprint').declarePublic('pformat', 'pprint')

if sys.version_info[0:2] == (2, 4):
  # Use our own tarfile if we got the buggy Python 2.4 version
  # BACK: drop once we remove support for Python 2.4
  import _tarfile as tarfile
else:
  import tarfile
