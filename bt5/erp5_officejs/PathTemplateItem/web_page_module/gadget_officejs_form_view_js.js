/*global document, window, rJS, RSVP, Blob, URL, jIO, ensureArray */
/*jslint nomen: true, indent: 2, maxerr: 10, maxlen: 80 */
(function (document, window, rJS, RSVP, Blob, URL, jIO, ensureArray) {
  "use strict";

  function renderField(field_id, field_definition,
                       context_document, data, blob_type) {
    var key, raw_value, override, final_value, item_list, result = {};
    for (key in field_definition.values) {
      if (field_definition.values.hasOwnProperty(key)) {
        // order to get the final value (based on Field.py get_value)
        // 1.override, 2.form-def-value, 3.context-default
        raw_value = field_definition.values[key];
        override = field_definition.overrides[key];
        final_value = undefined;
        if (final_value === undefined) {
          if (override !== undefined && override !== null && override !== '') {
            final_value = override;
          } else if (raw_value !== undefined && raw_value !== null &&
                     raw_value !== '') {
            final_value = raw_value;
          } else if (context_document && context_document.hasOwnProperty(key)) {
            final_value = context_document[key];
          }
        }
        if (final_value !== undefined && final_value !== null &&
            final_value !== '') {
          result[key] = final_value;
        }
      }
    }
    result.type = field_definition.type;
    result.key = field_id;
    if (context_document && context_document.hasOwnProperty(field_id)) {
      if (field_definition.type === "ListField") {
        item_list = ensureArray(context_document[field_id])
          .map(function (item) {
            if (Array.isArray(item)) {return item; }
            return [item, item];
          });
        result.items = item_list;
      } else {
        result["default"] = context_document[field_id];
      }
    }
    if (result.renderjs_extra && blob_type) {
      result["default"] = data;
    }
    return result;
  }

  function renderForm(form_definition, context_document, data, blob_type) {
    var i, j, field_list, field_info, my_element, element_id, rendered_field,
      raw_properties = form_definition.fields_raw_properties,
      form_json = {
        erp5_document: {
          "_embedded": {"_view": {}},
          "_links": {}
        },
        form_definition: form_definition
      };
    for (i = 0; i < form_definition.group_list.length; i += 1) {
      field_list = form_definition.group_list[i][1];
      for (j = 0; j < field_list.length; j += 1) {
        my_element = field_list[j][0];
        if (my_element.startsWith("my_")) {
          element_id = my_element.replace("my_", "");
        } else if (my_element.startsWith("your_")) {
          element_id = my_element.replace("your_", "");
        } else {
          element_id = my_element;
        }
        if (element_id && raw_properties.hasOwnProperty(my_element)) {
          field_info = raw_properties[my_element];
          rendered_field = renderField(element_id, field_info,
                                       context_document, data, blob_type);
          form_json.erp5_document._embedded._view[my_element] =
            rendered_field;
        }
      }
    }
    form_json.erp5_document._embedded._view._actions =
      form_definition._actions;
    form_json.erp5_document._links = form_definition._links;
    return form_json;
  }

  rJS(window)
    /////////////////////////////////////////////////////////////////
    // Acquired methods
    /////////////////////////////////////////////////////////////////
    .declareAcquiredMethod("updateHeader", "updateHeader")
    .declareAcquiredMethod("getUrlForList", "getUrlForList")
    .declareAcquiredMethod("jio_allDocs", "jio_allDocs")
    .declareAcquiredMethod("jio_getAttachment", "jio_getAttachment")
    .declareAcquiredMethod("jio_putAttachment", "jio_putAttachment")
    .declareAcquiredMethod("notifySubmitting", "notifySubmitting")
    .declareAcquiredMethod("notifySubmitted", 'notifySubmitted')

    // XXX Hardcoded for modification_date rendering
    .allowPublicAcquisition("jio_allDocs", function (param_list) {
      var gadget = this;
      return gadget.jio_allDocs(param_list[0])
        .push(function (result) {
          var i, date, len = result.data.total_rows;
          for (i = 0; i < len; i += 1) {
            if (result.data.rows[i].value.hasOwnProperty("modification_date")) {
              date = new Date(result.data.rows[i].value.modification_date);
              result.data.rows[i].value.modification_date = {
                field_gadget_param: {
                  allow_empty_time: 0,
                  ampm_time_style: 0,
                  css_class: "date_field",
                  date_only: 0,
                  description: "The Date",
                  editable: 0,
                  hidden: 0,
                  hidden_day_is_last_day: 0,
                  "default": date.toUTCString(),
                  key: "modification_date",
                  required: 0,
                  timezone_style: 0,
                  title: "Modification Date",
                  type: "DateTimeField"
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

    .declareMethod("triggerSubmit", function (argument_list) {
      var gadget = this, data, name_list;
      return gadget.notifySubmitting()
        .push(function () {
          return gadget.getDeclaredGadget('erp5_pt_gadget')
            .push(function (child_gadget) {
              if (!child_gadget.state.editable) {
                return child_gadget.triggerSubmit(argument_list);
              }
              return child_gadget.getDeclaredGadget("erp5_form")
                .push(function (sub_gadget) {
                  return sub_gadget.checkValidity();
                })
                .push(function (is_valid) {
                  if (!is_valid) {
                    return null;
                  }
                  return child_gadget.getContent();
                })
                .push(function (content_dict) {
                  if (content_dict === null) {
                    return;
                  }
                  if (gadget.state.blob_type) {
                    data = content_dict.text_content;
                    delete content_dict.text_content;

                    //ONLY OFFICE
                    if (gadget.state.only_office) {
                      name_list = gadget.state.doc.filename.split('.');
                      if (name_list.pop() !== gadget.state.mime_type) {
                        name_list.push(gadget.state.mime_type);
                        content_dict.filename = name_list.join('.');
                      }
                      content_dict.content_type = gadget.state.blob_type;
                    }//

                  }
                  return child_gadget.submitContent(
                    child_gadget.state.jio_key,
                    undefined,
                    content_dict
                  )
                    .push(function () {
                      if (gadget.state.blob_type) {
                        return gadget
                          .jio_putAttachment(child_gadget.state.jio_key,
                                             'data',
                                             jIO.util.dataURItoBlob(data))

                          //ONLY OFFICE
                          .push(function () {
                            if (gadget.state.only_office) {
                              return gadget
                                .declareGadget("gadget_ojs_cloudooo.html");
                            }
                          })
                          .push(function (cloudooo) {
                            if (gadget.state.only_office) {
                              return cloudooo
                                .putAllCloudoooConvertionOperation({
                                  format: gadget.state.mime_type,
                                  jio_key: child_gadget.state.jio_key
                                });
                            }
                          });//

                      }
                    });
                });
            });
        }, function (error) {
          console.log(error);
          return gadget.notifySubmitted({
            message: "Submit failed",
            status: "error"
          });
        });
    })

    .declareMethod("render", function (options) {
      var gadget = this,
        state_dict = {
          doc: options.doc,
          form_definition: options.form_definition,
          child_gadget_url: options.child_gadget_url,
          options: options
        },
        portal_type_dict = options.form_definition.portal_type_dict,
        blob;

      //ONLY OFFICE
      if (portal_type_dict.only_office && options.doc) {
        //TODO doc should come with filename. for now hardcoded if undefined
        if (!options.doc.filename) {
          options.doc.filename = "default.docx";
        }
        state_dict.mime_type = portal_type_dict.file_extension;
        state_dict.only_office = true;
        if (options.doc.action) {
          return gadget.changeState(state_dict);
        }
        state_dict.content_editable = options.doc.content_type === undefined ||
          options.doc.content_type.indexOf("application/x-asc") === 0;
        return new RSVP.Queue()
          .push(function () {
            if (!state_dict.content_editable) {
              return gadget.jio_getAttachment(options.jio_key, "data");
            }
            return gadget.declareGadget("gadget_ojs_cloudooo.html")
              .push(function (ojs_cloudooo) {
                return ojs_cloudooo.getConvertedBlob({
                  jio_key: options.jio_key,
                  format: state_dict.mime_type,
                  filename: options.doc.filename
                });
              });
          })
          .push(undefined, function (error) {
            if (error instanceof jIO.util.jIOError &&
                error.status_code === 404) {
              return new Blob();
            }
            throw error;
          })
          .push(function (blob) {
            if (state_dict.content_editable) {
              return jIO.util.readBlobAsDataURL(blob);
            }
            return jIO.util.readBlobAsText(blob);
          })
          .push(function (result) {
            state_dict.data = result.target.result;
            if (portal_type_dict.blob_type) {
              state_dict.blob_type = portal_type_dict.blob_type;
            } else {
              state_dict.blob_type = "ooffice";
            }
            return gadget.changeState(state_dict);
          });
      }//

      if (portal_type_dict.blob_type) {
        if (options.jio_key) {
          return gadget.jio_getAttachment(options.jio_key, "data")
            .push(undefined, function (error) {
              if (error.status_code === 404) {
                return new Blob([''], {type: portal_type_dict.blob_type});
              }
              throw new Error(error);
            })
            .push(function (result) {
              blob = result;
              blob.name = options.jio_key;
              return jIO.util.readBlobAsDataURL(blob);
            })
            .push(function (result) {
              if (portal_type_dict.blob_create_object_url) {
                state_dict.data = URL.createObjectURL(blob);
              } else {
                state_dict.data = {blob: result.target.result,
                                   name: options.jio_key};
              }
              state_dict.blob_type = portal_type_dict.blob_type;
              return gadget.changeState(state_dict);
            });
        }
      }
      return gadget.changeState(state_dict);
    })

    .onStateChange(function onStateChange() {
      var fragment = document.createElement('div'),
        gadget = this,
        form_json = renderForm(gadget.state.form_definition, gadget.state.doc,
                               gadget.state.data, gadget.state.blob_type);
      while (gadget.element.firstChild) {
        gadget.element.removeChild(gadget.element.firstChild);
      }
      gadget.element.appendChild(fragment);
      return gadget.declareGadget(gadget.state.child_gadget_url,
                                      {element: fragment,
                                       scope: 'erp5_pt_gadget'})
        .push(function (form_gadget) {
          return gadget.renderSubGadget(gadget.state.options, form_gadget,
                                        form_json);
        });
    })

    .declareMethod("renderSubGadget", function (options, subgadget, form_json) {
      var gadget = this, erp5_document = form_json.erp5_document,
        portal_type_dict = form_json.form_definition.portal_type_dict,
        page_title;
      if (options.doc && options.doc.title) {
        page_title = options.doc.title;
      } else if (options.doc && options.doc.header_title) {
        page_title = options.doc.header_title;
      } else {
        page_title = portal_type_dict.title;
      }
      return subgadget.render({
        jio_key: options.jio_key,
        doc: options.doc,
        erp5_document: form_json.erp5_document,
        form_definition: form_json.form_definition,
        editable: portal_type_dict.editable,
        save_action: portal_type_dict.editable,
        view: options.view,
        form_json: form_json
      })
      // render the header
        .push(function () {
          var url_for_parameter_list = [
            {command: 'change', options: {page: "tab"}},
            {command: 'change', options: {page: "action_officejs",
                                          jio_key: options.jio_key,
                                          portal_type: options.portal_type}},
            {command: 'history_previous'},
            {command: 'selection_previous'},
            {command: 'selection_next'},
            {command: 'change', options: {page: "export"}},
            {command: 'display', options: {}},
            {command: 'change', options: {page: "create_document",
                                          jio_key: options.jio_key,
                                          portal_type:
                                          options.portal_type,
                                          new_content_dialog_form:
                                          form_json.form_definition
                                            .new_content_dialog_form,
                                          new_content_category:
                                          form_json.form_definition
                                            .new_content_category,
                                          allowed_sub_types_list:
                                          form_json.form_definition
                                            .allowed_sub_types_list
                                         }}
          ];
          erp5_document = form_json.erp5_document;
          return RSVP.all([
            gadget.getUrlForList(url_for_parameter_list)
          ]);
        })
        .push(function (result_list) {
          var url_list = result_list[0],
            header_dict = { "page_title": page_title };
          if (options.form_type === 'dialog') {
            //TODO: find correct url
            header_dict.cancel_url = url_list[6];
          } else {
            header_dict.panel_action = portal_type_dict.panel_action === 1;
            if (portal_type_dict.filter_action) {
              header_dict.filter_action = true;
            }
            if (portal_type_dict.previous_next_button) {
              header_dict.previous_url = url_list[3];
              header_dict.next_url = url_list[4];
            }
            if (portal_type_dict.history_previous_link) {
              header_dict.selection_url = url_list[2];
            }
            if (portal_type_dict.has_more_views) {
              header_dict.tab_url = url_list[0];
            }
            header_dict.save_action = portal_type_dict.editable === 1;
            if (portal_type_dict.has_more_actions ||
                portal_type_dict.has_more_views) {
              header_dict.actions_url = url_list[1];
            }
            if (form_json.form_definition.allowed_sub_types_list &&
                form_json.form_definition.allowed_sub_types_list.length > 0 &&
                !portal_type_dict.hide_add_button) {
              header_dict.add_url = url_list[7];
            }
            if (portal_type_dict.export_button) {
              if (erp5_document._links.action_object_jio_report ||
                  erp5_document._links.action_object_jio_exchange ||
                  erp5_document._links.action_object_jio_print) {
                header_dict.export_url = url_list[5];
              }
            }
          }
          return gadget.updateHeader(header_dict);
        });
    });

}(document, window, rJS, RSVP, Blob, URL, jIO, ensureArray));
