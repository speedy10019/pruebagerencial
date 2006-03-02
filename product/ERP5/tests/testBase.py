##############################################################################
#
# Copyright (c) 2004, 2005 Nexedi SARL and Contributors. All Rights Reserved.
#          Romain Courteaud <romain@nexedi.com>
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
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA 02111-1307, USA.
#
##############################################################################

#
# Skeleton ZopeTestCase
#

from random import randint

import os, sys
if __name__ == '__main__':
    execfile(os.path.join(sys.path[0], 'framework.py'))

# Needed in order to have a log file inside the current folder
os.environ['EVENT_LOG_FILE'] = os.path.join(os.getcwd(), 'zLOG.log')
os.environ['EVENT_LOG_SEVERITY'] = '-300'

from Testing import ZopeTestCase
from Products.ERP5Type.tests.ERP5TypeTestCase import ERP5TypeTestCase
from AccessControl.SecurityManagement import newSecurityManager, \
                                             noSecurityManager
from DateTime import DateTime
from Acquisition import aq_base, aq_inner
from zLOG import LOG
from Products.ERP5Type.DateUtils import addToDate
from Products.ERP5Type.tests.Sequence import Sequence, SequenceList
import time
import os
from Products.ERP5Type import product_path
from Products.CMFCore.utils import getToolByName
from Products.ERP5Type.Tool.ClassTool import _aq_reset

class TestBase(ERP5TypeTestCase):

  run_all_test = 1
  object_portal_type = "Organisation"
  not_defined_property_id = "azerty_qwerty"
  not_defined_property_value = "qwerty_azerty"

  def getTitle(self):
    return "Base"

  def getBusinessTemplateList(self):
    """
    """
    return ('erp5_base')

  def login(self, quiet=0, run=run_all_test):
    uf = self.getPortal().acl_users
    uf._doAddUser('rc', '', ['Manager'], [])
    user = uf.getUserById('rc').__of__(uf)
    newSecurityManager(None, user)

  def enableLightInstall(self):
    """
    You can override this. 
    Return if we should do a light install (1) or not (0)
    """
    return 1

  def enableActivityTool(self):
    """
    You can override this.
    Return if we should create (1) or not (0) an activity tool.
    """
    return 1

  def afterSetUp(self, quiet=1, run=run_all_test):
    self.login()
    portal = self.getPortal()
    self.category_tool = self.getCategoryTool()
    portal_catalog = self.getCatalogTool()
    #portal_catalog.manage_catalogClear()
    self.createCategories()

  def createCategories(self):
    """ 
      Light install create only base categories, so we create 
      some categories for testing them
    """
    category_list = ['testGroup1', 'testGroup2']
    if len(self.category_tool.group.contentValues()) == 0 :
      for category_id in category_list:
        o = self.category_tool.group.newContent(portal_type='Category',
                                                id=category_id)

  def stepTic(self,**kw):
    self.tic()

  def stepRemoveWorkflowsRelated(self, sequence=None, sequence_list=None, 
                                 **kw):
    """
      Remove workflow related to the portal type
    """
    self.getWorkflowTool().setChainForPortalTypes(
        ['Organisation'], ())
    _aq_reset()

  def stepAssociateWorkflows(self, sequence=None, sequence_list=None, **kw):
    """
      Associate workflow to the portal type
    """
    self.getWorkflowTool().setChainForPortalTypes(
        ['Organisation'], ('validation_workflow', 'edit_workflow'))
    _aq_reset()

  def stepAssociateWorkflowsExcludingEdit(self, sequence=None, 
                                          sequence_list=None, **kw):
    """
      Associate workflow to the portal type
    """
    self.getWorkflowTool().setChainForPortalTypes(
        ['Organisation'], ('validation_workflow',))
    _aq_reset()

  def stepCreateObject(self, sequence=None, sequence_list=None, **kw):
    """
      Create a object_instance which will be tested.
    """
    portal = self.getPortal()
    module = portal.getDefaultModule(self.object_portal_type)
    object_instance = module.newContent(portal_type=self.object_portal_type)
    sequence.edit(
        object_instance=object_instance,
        current_title='',
        current_group_value=None
    )

  def stepCheckTitleValue(self, sequence=None, sequence_list=None, **kw):
    """
      Check if getTitle return a correect value
    """
    object_instance = sequence.get('object_instance')
    current_title = sequence.get('current_title')
    self.assertEquals(object_instance.getTitle(), current_title)

  def stepSetDifferentTitleValueWithEdit(self, sequence=None, 
                                         sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    current_title = sequence.get('current_title')
    new_title_value = '%s_a' % current_title
    object_instance.edit(title=new_title_value)
    sequence.edit(
        current_title=new_title_value
    )

  def stepCheckIfActivitiesAreCreated(self, sequence=None, sequence_list=None,
                                      **kw):
    """
      Check if there is a activity in activity queue.
    """
    portal = self.getPortal()
    get_transaction().commit()
    message_list = portal.portal_activities.getMessageList()
    method_id_list = [x.method_id for x in message_list]
    # XXX FIXME: how many activities should be created normally ?
    # Sometimes it's one, sometimes 2...
    self.failUnless(len(message_list) > 0)
    self.failUnless(len(message_list) < 3)
    for method_id in method_id_list:
      self.failUnless(method_id in ["immediateReindexObject", 
                                    "recursiveImmediateReindexObject"])

  def stepSetSameTitleValueWithEdit(self, sequence=None, sequence_list=None, 
                                    **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    object_instance.edit(title=object_instance.getTitle())

  def stepCheckIfMessageQueueIsEmpty(self, sequence=None, 
                                     sequence_list=None, **kw):
    """
      Check if there is no activity in activity queue.
    """
    portal = self.getPortal()
    message_list = portal.portal_activities.getMessageList()
    self.assertEquals(len(message_list), 0)

  def stepMakeImmediateReindexObjectCrashing(self, sequence=None, sequence_list=None, **kw):
    """
      Overwrite immediateReindexObject() with a crashing method
    """
    def crashingMethod(self):
      self.ImmediateReindexObjectIsCalled()
    from Products.ERP5Type.Document.Organisation import Organisation
    Organisation.immediateReindexObject = crashingMethod
    Organisation.recursiveImmediateReindexObject = crashingMethod

  def test_01_areActivitiesWellLaunchedByPropertyEdit(self, quiet=0, 
                                                      run=run_all_test):
    """
      Test if setter does not call a activity if the attribute 
      value is not changed.
    """
    if not run: return
    sequence_list = SequenceList()
    # Test without workflows associated to the portal type
    sequence_string = '\
              RemoveWorkflowsRelated \
              CreateObject \
              Tic \
              CheckTitleValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameTitleValueWithEdit \
              CheckTitleValue \
              CheckIfMessageQueueIsEmpty \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type
    sequence_string = '\
              AssociateWorkflows \
              CreateObject \
              Tic \
              CheckTitleValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type, excluding edit_workflow
    sequence_string = '\
              AssociateWorkflowsExcludingEdit \
              CreateObject \
              Tic \
              CheckTitleValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameTitleValueWithEdit \
              CheckIfMessageQueueIsEmpty \
              CheckTitleValue \
              SetDifferentTitleValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    sequence_list.play(self)

  def stepCheckGroupValue(self, sequence=None, sequence_list=None, **kw):
    """
      Check if getTitle return a correect value
    """
    object_instance = sequence.get('object_instance')
    current_group_value = sequence.get('current_group_value')
    self.assertEquals(object_instance.getGroupValue(), current_group_value)

  def stepSetDifferentGroupValueWithEdit(self, sequence=None, 
                                         sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    current_group_value = sequence.get('current_group_value')
    group1 = object_instance.portal_categories.\
                       restrictedTraverse('group/testGroup1')
    group2 = object_instance.portal_categories.\
                       restrictedTraverse('group/testGroup2')
    if (current_group_value is None) or \
       (current_group_value == group2) :
      new_group_value = group1
    else:
      new_group_value = group2
#     new_group_value = '%s_a' % current_title
    object_instance.edit(group_value=new_group_value)
    sequence.edit(
        current_group_value=new_group_value
    )

  def stepSetSameGroupValueWithEdit(self, sequence=None, sequence_list=None, 
                                    **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    object_instance.edit(group_value=object_instance.getGroupValue())


  def test_02_areActivitiesWellLaunchedByCategoryEdit(self, quiet=0, 
                                                      run=run_all_test):
    """
      Test if setter does not call a activity if the attribute 
      value is not changed.
    """
    if not run: return
    sequence_list = SequenceList()
    # Test without workflows associated to the portal type
    sequence_string = '\
              RemoveWorkflowsRelated \
              CreateObject \
              Tic \
              CheckGroupValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameGroupValueWithEdit \
              CheckIfMessageQueueIsEmpty \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type
    sequence_string = '\
              AssociateWorkflows \
              CreateObject \
              Tic \
              CheckGroupValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type, excluding edit_workflow
    sequence_string = '\
              AssociateWorkflowsExcludingEdit \
              CreateObject \
              Tic \
              CheckGroupValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameGroupValueWithEdit \
              CheckIfMessageQueueIsEmpty \
              SetDifferentGroupValueWithEdit \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    sequence_list.play(self)

  def stepSetDifferentTitleValueWithSetter(self, sequence=None, 
                                           sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    current_title = sequence.get('current_title')
    new_title_value = '%s_a' % current_title
    object_instance.setTitle(new_title_value)
    sequence.edit(
        current_title=new_title_value
    )

  def stepSetSameTitleValueWithSetter(self, sequence=None, 
                                      sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    object_instance.setTitle(object_instance.getTitle())

  def test_03_areActivitiesWellLaunchedByPropertySetter(self, quiet=0, 
                                                        run=run_all_test):
    """
      Test if setter does not call a activity if the attribute 
      value is not changed.
    """
    if not run: return
    sequence_list = SequenceList()
    # Test without workflows associated to the portal type
    sequence_string = '\
              RemoveWorkflowsRelated \
              CreateObject \
              Tic \
              CheckTitleValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type
    sequence_string = '\
              AssociateWorkflows \
              CreateObject \
              Tic \
              CheckTitleValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentTitleValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckTitleValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    sequence_list.play(self)

  def stepSetDifferentGroupValueWithSetter(self, sequence=None, 
                                           sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    current_group_value = sequence.get('current_group_value')
    group1 = object_instance.portal_categories.\
                                   restrictedTraverse('group/testGroup1')
    group2 = object_instance.portal_categories.\
                                   restrictedTraverse('group/testGroup2')
    if (current_group_value is None) or \
       (current_group_value == group2) :
      new_group_value = group1
    else:
      new_group_value = group2
#     new_group_value = '%s_a' % current_title
    object_instance.setGroupValue(new_group_value)
    sequence.edit(
        current_group_value=new_group_value
    )

  def stepSetSameGroupValueWithSetter(self, sequence=None, 
                                      sequence_list=None, **kw):
    """
      Set a different title value
    """
    object_instance = sequence.get('object_instance')
    object_instance.setGroupValue(object_instance.getGroupValue())

  def test_04_areActivitiesWellLaunchedByCategorySetter(self, quiet=0, 
                                                        run=run_all_test):
    """
      Test if setter does not call a activity if the attribute 
      value is not changed.
    """
    if not run: return
    sequence_list = SequenceList()
    # Test without workflows associated to the portal type
    sequence_string = '\
              RemoveWorkflowsRelated \
              CreateObject \
              Tic \
              CheckGroupValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test with workflows associated to the portal type
    sequence_string = '\
              AssociateWorkflows \
              CreateObject \
              Tic \
              CheckGroupValue \
              MakeImmediateReindexObjectCrashing \
              SetDifferentGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetSameGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              SetDifferentGroupValueWithSetter \
              CheckIfActivitiesAreCreated \
              CheckGroupValue \
              Tic \
              CheckIfMessageQueueIsEmpty \
              '
    sequence_list.addSequenceString(sequence_string)
    sequence_list.play(self)

  def stepSetObjectNotDefinedProperty(self, sequence=None, 
                                      sequence_list=None, **kw):
    """
    Set a not defined property on the object_instance.
    """
    object_instance = sequence.get('object_instance')
    object_instance.setProperty(self.not_defined_property_id,
                       self.not_defined_property_value)

  def stepCheckNotDefinedPropertySaved(self, sequence=None, 
                                       sequence_list=None, **kw):
    """
    Check if a not defined property is stored on the object_instance.
    """
    object_instance = sequence.get('object_instance')
    self.assertEquals(self.not_defined_property_value,
                      getattr(object_instance, self.not_defined_property_id))

  def stepCheckGetNotDefinedProperty(self, sequence=None, 
                                     sequence_list=None, **kw):
    """
    Check getProperty with a not defined property.
    """
    object_instance = sequence.get('object_instance')
    self.assertEquals(self.not_defined_property_value,
                    object_instance.getProperty(self.not_defined_property_id))

  def stepCheckObjectPortalType(self, sequence=None, 
                                sequence_list=None, **kw):
    """
    Check the portal type of the object_instance.
    """
    object_instance = sequence.get('object_instance')
    object_instance.getPortalType()
    self.assertEquals(self.object_portal_type,
                      object_instance.getPortalType())

  def stepCreateTempObject(self, sequence=None, sequence_list=None, **kw):
    """
      Create a temp object_instance which will be tested.
    """
    portal = self.getPortal()
    from Products.ERP5Type.Document import newTempOrganisation
    tmp_object = newTempOrganisation(portal, "a_wonderful_id")
    sequence.edit(
        object_instance=tmp_object,
        current_title='',
        current_group_value=None
    )

  def test_05_getPropertyWithoutPropertySheet(self, quiet=0, run=run_all_test):
    """
    Test if set/getProperty work without any property sheet.
    """
    if not run: return
    sequence_list = SequenceList()
    # Test on object_instance.
    sequence_string = '\
              CreateObject \
              SetObjectNotDefinedProperty \
              CheckNotDefinedPropertySaved \
              CheckGetNotDefinedProperty \
              '
    sequence_list.addSequenceString(sequence_string)
    # Test on temp object_instance.
    sequence_string = '\
              CreateTempObject \
              CheckObjectPortalType \
              SetObjectNotDefinedProperty \
              CheckNotDefinedPropertySaved \
              CheckGetNotDefinedProperty \
              '
    sequence_list.addSequenceString(sequence_string)
    sequence_list.play(self)

if __name__ == '__main__':
    framework()
else:
    import unittest
    def test_suite():
        suite = unittest.TestSuite()
        suite.addTest(unittest.makeSuite(TestBase))
        return suite
