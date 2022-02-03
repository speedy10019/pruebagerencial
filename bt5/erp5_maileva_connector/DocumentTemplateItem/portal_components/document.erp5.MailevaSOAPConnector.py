# -*- coding: utf-8 -*-
##############################################################################
#
# Copyright (c) 2013 Nexedi SA and Contributors. All Rights Reserved.
#                    Aurélien Calonne <aurel@nexedi.com>
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
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
#
##############################################################################

from AccessControl import ClassSecurityInfo
from Products.ERP5Type import Permissions, PropertySheet
from Products.ERP5Type.XMLObject import XMLObject
import suds
from suds.transport.https import HttpAuthenticated
from suds.sax.text import Raw
import base64
import socket

class MailevaSOAPConnector(XMLObject):
  # CMF Type Definition
  meta_type = 'Maileva SOAP Connector'
  portal_type = 'Maileva SOAP Connector'

  # Declarative security
  security = ClassSecurityInfo()
  security.declareObjectProtected(Permissions.AccessContentsInformation)

  # Default Properties
  property_sheets = ( PropertySheet.Base
                    , PropertySheet.XMLObject
                    , PropertySheet.CategoryCore
                      )
  def submitRequest(self, recipient_url="", sender_url="", document_url="", track_id=""):
    portal = self.getPortalObject()
    recipient = portal.restrictedTraverse(recipient_url)
    sender = portal.restrictedTraverse(sender_url)
    document = portal.restrictedTraverse(document_url)
    request_xml = self.generateRequestXML(recipient, sender, document, track_id)
    authenticated = HttpAuthenticated(username=self.getUserId(), password=self.getPassword())
    maileva_exchange = portal.system_event_module.newContent(
      portal_type='Maileva Exchange',
      source_value = sender,
      destination_value = recipient,
      resource_value = self,
      follow_up_value = document,
      reference=track_id,
      request = request_xml
    )
    runtime_environment = self.getActivityRuntimeEnvironment()
    if runtime_environment:
      runtime_environment.edit(
        conflict_retry=False,
        max_retry=0)
    try:
      response = suds.client.Client(url = self.getProperty('submit_url_string'), transport=authenticated).service.submit(__inject={'msg': request_xml})
    except socket.error, e:
      if e.errno == socket.errno.ECONNREFUSED:
        if runtime_environment:
          runtime_environment.edit(max_retry=None)
      raise e
    except Exception, e:
      maileva_exchange.edit(response = str(e))
      maileva_exchange.confirm()
      maileva_exchange.acknowledge()
      document.fail()
      return maileva_exchange

    maileva_exchange.edit(response = response)
    maileva_exchange.confirm()
    return maileva_exchange

  def checkPendingNotifications(self):
    authenticated = HttpAuthenticated(username=self.getUserId(), password=self.getPassword())
    client = suds.client.Client(url = self.getProperty("tracking_url_string"), transport=authenticated)
    notification_dict = {}
    for notification in client.service.checkPendingNotifications("GENERAL"):
      notification_dict[notification.reqTrackId] = {
        "id" : notification.id,
        "reqId" : notification.reqId,
        "depositId" : notification.depositId,
        "depositTrackId" : notification.depositTrackId
      }
    return notification_dict

  def getPendingNotificationDetails(self, request_id, debug=False):
    authenticated = HttpAuthenticated(username=self.getUserId(), password=self.getPassword())
    result = suds.client.Client(url = self.getProperty("tracking_url_string"), transport=authenticated).service.getPendingNotificationDetails(request_id)
    return {
      "status": str(result.status),
      "notification_status": str(result.notificationStatus),
      "detail": repr(result)
    }

  def _generateAddressLineList(self, entity):
    address_line_list = []
    address_line = entity.getDefaultAddressText()
    portal_type = entity.getPortalType()
    if portal_type == 'Person':
      address_line_list.append("%s %s" % (entity.getSocialTitleTitle(), entity.getTitle()))
    else:
      address_line_list.append("%s" % entity.getCorporateName())

    tmp_list = address_line.split('\n')
    if len(tmp_list) > 5:
      raise ValueError('Address %s has more than 5 lines' % tmp_list)
    for index in range(4):
      if index < len(tmp_list) - 1:
        address_line_list.append(tmp_list[index])
      else:
        address_line_list.append(None)
    if portal_type == "Person":
      address_line_list.append(tmp_list[-1])
    else:
      address_line_list.append("%s CEDEX" % tmp_list[-1])
    return address_line_list

  def generateRequestXML(self, recipient, sender, document, track_id, page_template='maileva_connection'):
    recipient_address_line_list= self._generateAddressLineList(recipient)
    sender_address_line_list = self._generateAddressLineList(sender)
    source_section_career_results = self.getPortalObject().portal_catalog(
      portal_type = 'Career',
      parent_uid = recipient.getUid(),
      subordination_uid = sender.getUid(),
      validation_state = 'open'
    )

    source_section_career = (source_section_career_results[0].getObject() if len(source_section_career_results) else recipient.getDefaultCareerValue() or '')
    if not source_section_career.getReference():
      raise ValueError('%s has no employee number defined' % source_section_career.getRelativeUrl())
    xml = getattr(document, page_template)(
      user = self.getUserId(),
      password = self.getPassword(),
      career_start_date = source_section_career.getStartDate().strftime('%Y-%m-%d'),
      employee_number = source_section_career.getReference(),
      recipient_region=recipient.getDefaultAddress().getRegionValue(),
      recipient = recipient,
      recipient_address_line_list = recipient_address_line_list,
      sender_region=sender.getDefaultAddress().getRegionValue(),
      sender_address_line_list = sender_address_line_list,
      content = base64.b64encode(document.getData()),
      track_id = track_id
    )
    non_empty_lines = [line for line in xml.split('\n') if line.strip() != ""]
    xml = ""
    for line in non_empty_lines:
      xml += line + "\n"
    return Raw(xml).encode("UTF-8")

