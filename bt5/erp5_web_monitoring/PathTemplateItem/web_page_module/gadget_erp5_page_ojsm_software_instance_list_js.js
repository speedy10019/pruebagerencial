/*global window, rJS, RSVP */
/*jslint nomen: true, indent: 2, maxerr: 3*/
(function (window, rJS, RSVP) {
  "use strict";

  rJS(window)
    .declareAcquiredMethod("updateHeader", "updateHeader")
    .declareAcquiredMethod("getSetting", "getSetting")
    .declareAcquiredMethod("getUrlFor", "getUrlFor")
    .declareAcquiredMethod("jio_allDocs", "jio_allDocs")

    .allowPublicAcquisition("jio_allDocs", function (param_list) {
      var gadget = this;
      return gadget.jio_allDocs(param_list[0])
        .push(function (result) {
          var i, value, len = result.data.total_rows;
          for (i = 0; i < len; i += 1) {
            if (result.data.rows[i].value.hasOwnProperty("date")) {
              result.data.rows[i].value.date = {
                field_gadget_param: {
                  allow_empty_time: 0,
                  ampm_time_style: 0,
                  css_class: "date_field",
                  date_only: 0,
                  description: "The Date",
                  editable: 0,
                  hidden: 0,
                  hidden_day_is_last_day: 0,
                  "default": result.data.rows[i].value.date,
                  key: "date",
                  required: 0,
                  timezone_style: 1,
                  title: "Status Date",
                  type: "DateTimeField"
                }
              };
              result.data.rows[i].value["listbox_uid:list"] = {
                key: "listbox_uid:list",
                value: 2713
              };
            }
            if (result.data.rows[i].value.hasOwnProperty("status")) {
              value = result.data.rows[i].value.status;
              result.data.rows[i].value.status = {
                field_gadget_param: {
                  css_class: "",
                  description: "The Status",
                  hidden: 0,
                  "default": value,
                  key: "status",
                  url: "gadget_erp5_field_status.html",
                  title: "Status",
                  type: "GadgetField"
                }
              };
              result.data.rows[i].value["listbox_uid:list"] = {
                key: "listbox_uid:list",
                value: 2713
              };
            }
          }
          return result;
        });
    })

    /////////////////////////////////////////////////////////////////
    // declared methods
    /////////////////////////////////////////////////////////////////

    .declareMethod("triggerSubmit", function () {
      var argument_list = arguments;
      return this.getDeclaredGadget('form_list')
        .push(function (gadget) {
          return gadget.triggerSubmit.apply(gadget, argument_list);
        });
    })
    .declareMethod("render", function (options) {
      return this.changeState({
        options: options,
        latest_reload_time: new Date().getTime()
      });
    })
    .onStateChange(function () {
      var gadget = this,
        lines_limit;

      return new RSVP.Queue()
        .push(function () {
          return gadget.getSetting("listbox_lines_limit", 20);
        })
        .push(function (listbox_lines_limit) {
          lines_limit = listbox_lines_limit;
          return gadget.getDeclaredGadget('form_list');
        })
        .push(function (form_list) {
          var column_list = [
            ['status', 'Status'],
            ['title', 'Instance Title'],
            ['specialise_title', 'Instance Tree'],
            ['aggregate_reference', 'Computer'],
            ['date', 'Status Date']
          ];
          return form_list.render({
            erp5_document: {
              "_embedded": {"_view": {
                "listbox": {
                  "column_list": column_list,
                  "show_anchor": 0,
                  "default_params": {},
                  "editable": 0,
                  "editable_column_list": [],
                  "key": "software_instance_listbox",
                  "lines": lines_limit,
                  "list_method": "portal_catalog",
                  "query": "urn:jio:allDocs?query=portal_type%3A%22" +
                    "Software%20Instance" + "%22",
                  "portal_type": [],
                  "search_column_list": column_list,
                  "sort_column_list": column_list,
                  "sort": [["status", "ascending"]],
                  "title": "Software Instances",
                  "type": "ListBox"
                }
              }},
              "_links": {
                "type": {
                  // form_list display portal_type in header
                  name: ""
                }
              }
            },
            form_definition: {
              group_list: [[
                "bottom",
                [["listbox"]]
              ]]
            }
          });
        })
        .push(function () {
          return gadget.updateHeader({
            page_title: "Software Instances Status",
            filter_action: true
          });
        });
    })

    .onLoop(function () {
      var gadget = this;

      return gadget.getSetting('latest_sync_time')
        .push(function (latest_sync_time) {
          if (latest_sync_time > gadget.state.latest_reload_time) {
            return gadget.changeState({latest_reload_time: new Date().getTime()});
          }
        });
    }, 30000);

}(window, rJS, RSVP));

