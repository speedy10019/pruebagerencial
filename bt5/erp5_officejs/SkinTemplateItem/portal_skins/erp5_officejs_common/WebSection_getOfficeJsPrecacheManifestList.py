url_list = [
  "font-awesome/font-awesome.css",
  "URI.js",
  "dygraph.js",
  "handlebars.js",
  "gadget_officejs_router.js",
  "gadget_translate.html",
  "gadget_translate.js",
  "jio_ojs_storage.js",
  "gadget_erp5_ojs_panel.js",
  "gadget_erp5_page_ojs_configurator.html",
  "gadget_erp5_page_ojs_configurator.js",
  "gadget_erp5_page_ojs_dav_configurator.html",
  "gadget_erp5_page_ojs_dav_configurator.js",
  "gadget_erp5_page_ojs_erp5_configurator.html",
  "gadget_erp5_page_ojs_erp5_configurator.js",
  "gadget_erp5_page_ojs_dropbox_configurator.html",
  "gadget_erp5_page_ojs_dropbox_configurator.js",
  "gadget_erp5_page_ojs_sync.html",
  "gadget_erp5_page_ojs_sync.js",
  "gadget_erp5_page_ojs_linshare_configurator.html",
  "gadget_erp5_page_ojs_linshare_configurator.js",
  "gadget_ojs_configurator_access.html",
  "gadget_ojs_configurator_access.js",
  "gadget_officejs_setting.js",
  "gadget_officejs_setting.html",
  "gadget_ojs_local_jio.html",
  "gadget_ojs_local_jio.js",
  "gadget_erp5_page_action_officejs.html",
  "gadget_erp5_page_action_officejs.js",
  "gadget_erp5_page_ojs_local_controller.html",
  "gadget_erp5_page_ojs_local_controller.js",
  "gadget_officejs_form_view.html",
  "gadget_officejs_form_view.js",
  "gadget_erp5_page_handle_action.html",
  "gadget_erp5_page_handle_action.js",
  "gadget_officejs_common_util.html",
  "gadget_officejs_common_util.js",
  "gadget_erp5_page_create_document.html",
  "gadget_erp5_page_create_document.js",

  #needed for appcachestorage sync
  "/",
  "app/",
  "gadget_officejs_bootloader.js",
  "gadget_officejs_bootloader_presentation.html",
  "gadget_officejs_bootloader_presentation.js",
  "gadget_officejs_bootloader_presentation.css",
  "gadget_officejs_bootloader_serviceworker.js",
  "officejs_logo.png",
  "jio_appcachestorage.js",
  "jio_configuration_storage.js",

  #app actions
  "action_clone.html",
  "action_clone.js"
]

base64_url_list = context.WebSection_getBase64ConfigurationUrlList(batch_mode=1)

return url_list + base64_url_list
