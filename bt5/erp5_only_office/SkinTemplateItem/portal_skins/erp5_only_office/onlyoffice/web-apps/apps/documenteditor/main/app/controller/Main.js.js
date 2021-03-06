/*
 *
 * (c) Copyright Ascensio System Limited 2010-2017
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
*/
/**
 *  Main.js
 *
 *  Main controller
 *
 *  Created by Alexander Yuzhin on 1/15/14
 *  Copyright (c) 2014 Ascensio System SIA. All rights reserved.
 *
 */

define([
    'core',
    'irregularstack',
    'common/main/lib/component/Window',
    'common/main/lib/component/LoadMask',
    'common/main/lib/component/Tooltip',
    'common/main/lib/controller/Fonts',
    'common/main/lib/collection/TextArt',
    'common/main/lib/view/OpenDialog',
    'common/main/lib/util/LocalStorage',
    'documenteditor/main/app/collection/ShapeGroups',
    'documenteditor/main/app/collection/EquationGroups'
], function () {
    'use strict';

    DE.Controllers.Main = Backbone.Controller.extend(_.extend((function() {
        var ApplyEditRights = -255;
        var LoadingDocument = -256;

        var mapCustomizationElements = {
            about: 'button#left-btn-about',
            feedback: 'button#left-btn-support',
            goback: '#fm-btn-back > a, #header-back > div'
        };

        var mapCustomizationExtElements = {
            toolbar: '#viewport #toolbar',
            leftMenu: '#viewport #left-menu, #viewport #id-toolbar-full-placeholder-btn-settings, #viewport #id-toolbar-short-placeholder-btn-settings',
            rightMenu: '#viewport #right-menu',
            header: '#viewport #header',
            statusBar: '#statusbar'
        };

        Common.localStorage.setId('text');
        Common.localStorage.setKeysFilter('de-,asc.text');
        Common.localStorage.sync();

        return {

            models: [],
            collections: [
                'ShapeGroups',
                'EquationGroups',
                'Common.Collections.HistoryUsers',
                'Common.Collections.TextArt'
            ],
            views: [],

            initialize: function() {
                this.addListeners({
                    'FileMenu': {
                        'settings:apply': _.bind(this.applySettings, this)
                    }
                });
            },

            onLaunch: function() {
                var me = this;

                this.stackLongActions = new Common.IrregularStack({
                    strongCompare   : function(obj1, obj2){return obj1.id === obj2.id && obj1.type === obj2.type;},
                    weakCompare     : function(obj1, obj2){return obj1.type === obj2.type;}
                });

                this._state = {isDisconnected: false, usersCount: 1, fastCoauth: true, lostEditingRights: false, licenseWarning: false};
                this.languages = null;
                this.translationTable = [];
                // Initialize viewport

                if (!Common.Utils.isBrowserSupported()){
                    Common.Utils.showBrowserRestriction();
                    Common.Gateway.reportError(undefined, this.unsupportedBrowserErrorText);
                    return;
                }

                var value = Common.localStorage.getItem("de-settings-fontrender");
                if (value === null)
                    window.devicePixelRatio > 1 ? value = '1' : '0';

                // Initialize api

                window["flat_desine"] = true;

                var styleNames = ['Normal', 'No Spacing', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Heading 5',
                                  'Heading 6', 'Heading 7', 'Heading 8', 'Heading 9', 'Title', 'Subtitle', 'Quote', 'Intense Quote', 'List Paragraph'],
                    translate = {
                        'Series': this.txtSeries,
                        'Diagram Title': this.txtDiagramTitle,
                        'X Axis': this.txtXAxis,
                        'Y Axis': this.txtYAxis,
                        'Your text here': this.txtArt
                    };
                styleNames.forEach(function(item){
                    translate[item] = me.translationTable[item] = me['txtStyle_' + item.replace(/ /g, '_')] || item;
                });

                this.api = new Asc.asc_docs_api({
                    'id-view'  : 'editor_sdk',
                    'translate': translate
                });

                if (this.api){
                    switch (value) {
                        case '0': this.api.SetFontRenderingMode(3); break;
                        case '1': this.api.SetFontRenderingMode(1); break;
                        case '2': this.api.SetFontRenderingMode(2); break;
                    }

                    this.api.asc_registerCallback('asc_onError',                    _.bind(this.onError, this));
                    this.api.asc_registerCallback('asc_onDocumentContentReady',     _.bind(this.onDocumentContentReady, this));
                    this.api.asc_registerCallback('asc_onOpenDocumentProgress',     _.bind(this.onOpenDocument, this));
                    this.api.asc_registerCallback('asc_onDocumentUpdateVersion',    _.bind(this.onUpdateVersion, this));
                    this.api.asc_registerCallback('asc_onServerVersion',            _.bind(this.onServerVersion, this));
                    this.api.asc_registerCallback('asc_onAdvancedOptions',          _.bind(this.onAdvancedOptions, this));
                    this.api.asc_registerCallback('asc_onDocumentName',             _.bind(this.onDocumentName, this));
                    this.api.asc_registerCallback('asc_onPrintUrl',                 _.bind(this.onPrintUrl, this));
                    this.api.asc_registerCallback('asc_onMeta',                     _.bind(this.onMeta, this));
                    this.api.asc_registerCallback('asc_onSpellCheckInit',           _.bind(this.loadLanguages, this));

                    Common.NotificationCenter.on('api:disconnect',                  _.bind(this.onCoAuthoringDisconnect, this));
                    Common.NotificationCenter.on('goback',                          _.bind(this.goBack, this));

                    this.isShowOpenDialog = false;
                    
                    // Initialize api gateway
                    this.editorConfig = {};
                    this.appOptions = {};
                    this.plugins = undefined;
                    this.UICustomizePlugins = [];
                    Common.Gateway.on('init',           _.bind(this.loadConfig, this));
                    Common.Gateway.on('showmessage',    _.bind(this.onExternalMessage, this));
                    Common.Gateway.on('opendocument',   _.bind(this.loadDocument, this));
                    Common.Gateway.appReady();

//                $(window.top).resize(_.bind(this.onDocumentResize, this));
                    this.getApplication().getController('Viewport').setApi(this.api);
                    this.getApplication().getController('Statusbar').setApi(this.api);

                    /** coauthoring begin **/
                    this.contComments = this.getApplication().getController('Common.Controllers.Comments');
                    /** coauthoring end **/

                        // Syncronize focus with api
                    $(document.body).on('focus', 'input, textarea', function(e) {
                        if (!/area_id/.test(e.target.id)) {
                            if (/msg-reply/.test(e.target.className))
                                me.dontCloseDummyComment = true;
                            else if (/chat-msg-text/.test(e.target.id))
                                me.dontCloseChat = true;
                        }
                    });

                    $(document.body).on('blur', 'input, textarea', function(e) {
                        if (!me.isModalShowed) {
                            if (!e.relatedTarget ||
                                !/area_id/.test(e.target.id) && $(e.target).parent().find(e.relatedTarget).length<1 /* Check if focus in combobox goes from input to it's menu button or menu items */
                                && (e.relatedTarget.localName != 'input' || !/form-control/.test(e.relatedTarget.className)) /* Check if focus goes to text input with class "form-control" */
                                && (e.relatedTarget.localName != 'textarea' || /area_id/.test(e.relatedTarget.id))) /* Check if focus goes to textarea, but not to "area_id" */ {
                                me.api.asc_enableKeyEvents(true);
                                if (/msg-reply/.test(e.target.className))
                                    me.dontCloseDummyComment = false;
                                else if (/chat-msg-text/.test(e.target.id))
                                    me.dontCloseChat = false;
                            }
                        }
                    }).on('dragover', function(e) {
                        var event = e.originalEvent;
                        if (event.target && $(event.target).closest('#editor_sdk').length<1 ) {
                            event.preventDefault();
                            event.dataTransfer.dropEffect ="none";
                            return false;
                        }
                    });

                    Common.NotificationCenter.on({
                        'modal:show': function(){
                            me.isModalShowed = true;
                            me.api.asc_enableKeyEvents(false);
                        },
                        'modal:close': function(dlg) {
                            if (dlg && dlg.$lastmodal && dlg.$lastmodal.length < 1) {
                                me.isModalShowed = false;
                                me.api.asc_enableKeyEvents(true);
                            }
                        },
                        'modal:hide': function(dlg) {
                            if (dlg && dlg.$lastmodal && dlg.$lastmodal.length < 1) {
                                me.isModalShowed = false;
                                me.api.asc_enableKeyEvents(true);
                            }
                        },
                        'settings:unitschanged':_.bind(this.unitsChanged, this),
                        'dataview:focus': function(e){
                        },
                        'dataview:blur': function(e){
                            if (!me.isModalShowed) {
                                me.api.asc_enableKeyEvents(true);
                            }
                        },
                        'menu:show': function(e){
                        },
                        'menu:hide': function(e, isFromInputControl){
                            if (!me.isModalShowed && !isFromInputControl)
                                me.api.asc_enableKeyEvents(true);
                        },
                        'edit:complete': _.bind(me.onEditComplete, me)
                    });

                    this.initNames(); //for shapes

                    Common.util.Shortcuts.delegateShortcuts({
                        shortcuts: {
                            'command+s,ctrl+s': _.bind(function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                            }, this)
                        }
                    });
                }
            },

            loadConfig: function(data) {
                this.editorConfig = $.extend(this.editorConfig, data.config);

                this.editorConfig.user          =
                this.appOptions.user            = Common.Utils.fillUserInfo(this.editorConfig.user, this.editorConfig.lang, this.textAnonymous);
                this.appOptions.nativeApp       = this.editorConfig.nativeApp === true;
                this.appOptions.isDesktopApp    = this.editorConfig.targetApp == 'desktop';
                this.appOptions.canCreateNew    = !_.isEmpty(this.editorConfig.createUrl) && !this.appOptions.isDesktopApp;
                this.appOptions.canOpenRecent   = this.editorConfig.nativeApp !== true && this.editorConfig.recent !== undefined && !this.appOptions.isDesktopApp;
                this.appOptions.templates       = this.editorConfig.templates;
                this.appOptions.recent          = this.editorConfig.recent;
                this.appOptions.createUrl       = this.editorConfig.createUrl;
                this.appOptions.lang            = this.editorConfig.lang;
                this.appOptions.location        = (typeof (this.editorConfig.location) == 'string') ? this.editorConfig.location.toLowerCase() : '';
                this.appOptions.sharingSettingsUrl = this.editorConfig.sharingSettingsUrl;
                this.appOptions.fileChoiceUrl   = this.editorConfig.fileChoiceUrl;
                this.appOptions.mergeFolderUrl  = this.editorConfig.mergeFolderUrl;
                this.appOptions.canAnalytics    = false;
                this.appOptions.customization   = this.editorConfig.customization;
                this.appOptions.canBackToFolder = (this.editorConfig.canBackToFolder!==false) && (typeof (this.editorConfig.customization) == 'object')
                                                  && (typeof (this.editorConfig.customization.goback) == 'object') && !_.isEmpty(this.editorConfig.customization.goback.url);
                this.appOptions.canBack         = this.editorConfig.nativeApp !== true && this.appOptions.canBackToFolder === true;
                this.appOptions.canPlugins      = false;
                this.plugins                    = this.editorConfig.plugins;

                this.getApplication()
                    .getController('Viewport')
                    .getView('Common.Views.Header')
                    .setCanBack(this.appOptions.canBackToFolder === true);

                if (this.editorConfig.lang)
                    this.api.asc_setLocale(this.editorConfig.lang);

                if (this.appOptions.location == 'us' || this.appOptions.location == 'ca')
                    Common.Utils.Metric.setDefaultMetric(Common.Utils.Metric.c_MetricUnits.inch);
            },

            loadDocument: function(data) {
                this.permissions = {};
                this.document = data.doc;

                var docInfo = {};

                if (data.doc) {
                    this.permissions = $.extend(this.permissions, data.doc.permissions);

                    var _user = new Asc.asc_CUserInfo();
                    _user.put_Id(this.appOptions.user.id);
                    _user.put_FullName(this.appOptions.user.fullname);

                    docInfo = new Asc.asc_CDocInfo();
                    docInfo.put_Id(data.doc.key);
                    docInfo.put_Url(data.doc.url);
                    docInfo.put_Title(data.doc.title);
                    docInfo.put_Format(data.doc.fileType);
                    docInfo.put_VKey(data.doc.vkey);
                    docInfo.put_Options(data.doc.options);
                    docInfo.put_UserInfo(_user);
                    docInfo.put_CallbackUrl(this.editorConfig.callbackUrl);
                    docInfo.put_Token(data.doc.token);
                    docInfo.put_Permissions(this.permissions);
//                    docInfo.put_Review(this.permissions.review);
//                    docInfo.put_OfflineApp(this.editorConfig.nativeApp === true); // used in sdk for testing
                }

                this.api.asc_registerCallback('asc_onGetEditorPermissions', _.bind(this.onEditorPermissions, this));
                this.api.asc_setDocInfo(docInfo);
                this.api.asc_getEditorPermissions(this.editorConfig.licenseUrl, this.editorConfig.customerId);

                if (data.doc) {
                    this.getApplication()
                        .getController('Viewport')
                        .getView('Common.Views.Header')
                        .setDocumentCaption(data.doc.title);
                }
            },

            onProcessSaveResult: function(data) {
                this.api.asc_OnSaveEnd(data.result);
                if (data && data.result === false) {
                    Common.UI.error({
                        title: this.criticalErrorTitle,
                        msg  : _.isEmpty(data.message) ? this.errorProcessSaveResult : data.message
                    });
                }
            },

            onProcessRightsChange: function(data) {
                if (data && data.enabled === false) {
                    var me = this,
                        old_rights = this._state.lostEditingRights;
                    this._state.lostEditingRights = !this._state.lostEditingRights;
                    this.api.asc_coAuthoringDisconnect();
                    this.getApplication().getController('LeftMenu').leftMenu.getMenu('file').panels['rights'].onLostEditRights();
                    Common.NotificationCenter.trigger('api:disconnect');
                    if (!old_rights)
                        Common.UI.warning({
                            title: this.notcriticalErrorTitle,
                            maxwidth: 600,
                            msg  : _.isEmpty(data.message) ? this.warnProcessRightsChange : data.message,
                            callback: function(){
                                me._state.lostEditingRights = false;
                                me.onEditComplete();
                            }
                        });
                }
            },

            onDownloadAs: function() {
                this._state.isFromGatewayDownloadAs = true;
                var type = /^(?:(pdf|djvu|xps))$/.exec(this.document.fileType);
                (type && typeof type[1] === 'string') ? this.api.asc_DownloadOrigin(true) : this.api.asc_DownloadAs(Asc.c_oAscFileType.DOCX, true);
            },

            onProcessMouse: function(data) {
                if (data.type == 'mouseup') {
                    var e = document.getElementById('editor_sdk');
                    if (e) {
                        var r = e.getBoundingClientRect();
                        this.api.OnMouseUp(
                            data.x - r.left,
                            data.y - r.top
                        );
                    }
                }
            },

            onRefreshHistory: function(opts) {
                this.loadMask && this.loadMask.hide();
                if (opts.data.error || !opts.data.history) {
                    var historyStore = this.getApplication().getCollection('Common.Collections.HistoryVersions');
                    if (historyStore && historyStore.size()>0) {
                        historyStore.each(function(item){
                            item.set('canRestore', false);
                        });
                    }
                    Common.UI.alert({
                        closable: false,
                        title: this.notcriticalErrorTitle,
                        msg: (opts.data.error) ? opts.data.error : this.txtErrorLoadHistory,
                        iconCls: 'warn',
                        buttons: ['ok'],
                        callback: _.bind(function(btn){
                            this.onEditComplete();
                        }, this)
                    });
                } else {
                    this.api.asc_coAuthoringDisconnect();
                    this.getApplication().getController('Viewport').getView('Common.Views.Header').setCanRename(false);
                    this.getApplication().getController('LeftMenu').getView('LeftMenu').showHistory();
                    this.disableEditing(true);
                    var versions = opts.data.history,
                        historyStore = this.getApplication().getCollection('Common.Collections.HistoryVersions'),
                        currentVersion = null;
                    if (historyStore) {
                        var arrVersions = [], ver, version, group = -1, prev_ver = -1, arrColors = [], docIdPrev = '',
                            usersStore = this.getApplication().getCollection('Common.Collections.HistoryUsers'), user = null, usersCnt = 0;

                        for (ver=versions.length-1; ver>=0; ver--) {
                            version = versions[ver];
                            if (version.versionGroup===undefined || version.versionGroup===null)
                                version.versionGroup = version.version;
                            if (version) {
                                if (!version.user) version.user = {};
                                docIdPrev = (ver>0 && versions[ver-1]) ? versions[ver-1].key : version.key + '0';
                                user = usersStore.findUser(version.user.id);
                                if (!user) {
                                    user = new Common.Models.User({
                                        id          : version.user.id,
                                        username    : version.user.name,
                                        colorval    : Asc.c_oAscArrUserColors[usersCnt],
                                        color       : this.generateUserColor(Asc.c_oAscArrUserColors[usersCnt++])
                                    });
                                    usersStore.add(user);
                                }

                                arrVersions.push(new Common.Models.HistoryVersion({
                                    version: version.versionGroup,
                                    revision: version.version,
                                    userid : version.user.id,
                                    username : version.user.name,
                                    usercolor: user.get('color'),
                                    created: version.created,
                                    docId: version.key,
                                    markedAsVersion: (group!==version.versionGroup),
                                    selected: (opts.data.currentVersion == version.version),
                                    canRestore: this.appOptions.canHistoryRestore && (ver < versions.length-1),
                                    isExpanded: true,
                                    serverVersion: version.serverVersion
                                }));
                                if (opts.data.currentVersion == version.version) {
                                    currentVersion = arrVersions[arrVersions.length-1];
                                }
                                group = version.versionGroup;
                                if (prev_ver!==version.version) {
                                    prev_ver = version.version;
                                    arrColors.reverse();
                                    for (i=0; i<arrColors.length; i++) {
                                        arrVersions[arrVersions.length-i-2].set('arrColors',arrColors);
                                    }
                                    arrColors = [];
                                }
                                arrColors.push(user.get('colorval'));

                                var changes = version.changes, change, i;
                                if (changes && changes.length>0) {
                                    arrVersions[arrVersions.length-1].set('docIdPrev', docIdPrev);
                                    if (!_.isEmpty(version.serverVersion) && version.serverVersion == this.appOptions.buildVersion) {
                                        arrVersions[arrVersions.length-1].set('changeid', changes.length-1);
                                        arrVersions[arrVersions.length-1].set('hasChanges', changes.length>1);
                                        for (i=changes.length-2; i>=0; i--) {
                                            change = changes[i];

                                            user = usersStore.findUser(change.user.id);
                                            if (!user) {
                                                user = new Common.Models.User({
                                                    id          : change.user.id,
                                                    username    : change.user.name,
                                                    colorval    : Asc.c_oAscArrUserColors[usersCnt],
                                                    color       : this.generateUserColor(Asc.c_oAscArrUserColors[usersCnt++])
                                                });
                                                usersStore.add(user);
                                            }

                                            arrVersions.push(new Common.Models.HistoryVersion({
                                                version: version.versionGroup,
                                                revision: version.version,
                                                changeid: i,
                                                userid : change.user.id,
                                                username : change.user.name,
                                                usercolor: user.get('color'),
                                                created: change.created,
                                                docId: version.key,
                                                docIdPrev: docIdPrev,
                                                selected: false,
                                                canRestore: this.appOptions.canHistoryRestore,
                                                isRevision: false,
                                                isVisible: true,
                                                serverVersion: version.serverVersion
                                            }));
                                            arrColors.push(user.get('colorval'));
                                        }
                                    }
                                } else if (ver==0 && versions.length==1) {
                                     arrVersions[arrVersions.length-1].set('docId', version.key + '1');
                                }
                            }
                        }
                        if (arrColors.length>0) {
                            arrColors.reverse();
                            for (i=0; i<arrColors.length; i++) {
                                arrVersions[arrVersions.length-i-1].set('arrColors',arrColors);
                            }
                            arrColors = [];
                        }
                        historyStore.reset(arrVersions);
                        if (currentVersion===null && historyStore.size()>0) {
                            currentVersion = historyStore.at(0);
                            currentVersion.set('selected', true);
                        }
                        if (currentVersion)
                            this.getApplication().getController('Common.Controllers.History').onSelectRevision(null, null, currentVersion);
                    }
                }
            },

            generateUserColor: function(color) {
              return"#"+("000000"+color.toString(16)).substr(-6);
            },


            disableEditing: function(disable) {
                var app = this.getApplication();
                if (this.appOptions.canEdit && this.editorConfig.mode !== 'view') {
                    app.getController('RightMenu').getView('RightMenu').clearSelection();
                    app.getController('Toolbar').DisableToolbar(disable, disable);
                    app.getController('RightMenu').SetDisabled(disable, false);
                    app.getController('Statusbar').getView('Statusbar').SetDisabled(disable);

                    var tooltip = app.getController('Toolbar').getView('Toolbar').synchTooltip;
                    if (tooltip) tooltip.hide();
                }
                app.getController('LeftMenu').SetDisabled(disable, true);
            },

            goBack: function(blank) {
                var href = this.appOptions.customization.goback.url;
                if (blank) {
                    window.open(href, "_blank");
                } else {
                    parent.location.href = href;
                }
            },

            onEditComplete: function(cmp) {
//                this.getMainMenu().closeFullScaleMenu();
                var application = this.getApplication(),
                    toolbarController = application.getController('Toolbar'),
                    toolbarView = toolbarController.getView('Toolbar');

                if (this.appOptions.isEdit && toolbarView && (toolbarView.btnInsertShape.pressed || toolbarView.btnInsertText.pressed) &&
                    ( !_.isObject(arguments[1]) || arguments[1].id !== 'id-toolbar-btn-insertshape')) { // TODO: Event from api is needed to clear btnInsertShape state
                    if (this.api)
                        this.api.StartAddShape('', false);

                    toolbarView.btnInsertShape.toggle(false, false);
                    toolbarView.btnInsertText.toggle(false, false);
                }
                if (this.appOptions.isEdit && toolbarView && toolbarView.btnHighlightColor.pressed &&
                    ( !_.isObject(arguments[1]) || arguments[1].id !== 'id-toolbar-btn-highlight')) {
                    this.api.SetMarkerFormat(false);
                    toolbarView.btnHighlightColor.toggle(false, false);
                }
                application.getController('DocumentHolder').getView('DocumentHolder').focus();

                if (this.api) {
                    var cansave = this.api.asc_isDocumentCanSave(),
                        forcesave = this.appOptions.forcesave;
                    var isSyncButton = $('.btn-icon', toolbarView.btnSave.cmpEl).hasClass('btn-synch');
                    if (toolbarView.btnSave.isDisabled() !== (!cansave && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave))
                        toolbarView.btnSave.setDisabled(!cansave && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave);
                }
            },

            onLongActionBegin: function(type, id) {
                var action = {id: id, type: type};
                this.stackLongActions.push(action);
                this.setLongActionView(action);
            },

            onLongActionEnd: function(type, id) {
                var action = {id: id, type: type};
                this.stackLongActions.pop(action);

                this.getApplication()
                    .getController('Viewport')
                    .getView('Common.Views.Header')
                    .setDocumentCaption(this.api.asc_getDocumentName());

                this.updateWindowTitle(true);

                action = this.stackLongActions.get({type: Asc.c_oAscAsyncActionType.Information});
                if (action) {
                    this.setLongActionView(action)
                } else {
                    if ((id==Asc.c_oAscAsyncAction['Save'] || id==Asc.c_oAscAsyncAction['ForceSaveButton']) && !this.appOptions.isOffline) {
                        if (this._state.fastCoauth && this._state.usersCount>1) {
                            var me = this;
                            me._state.timerSave = setTimeout(function () {
                                me.getApplication().getController('Statusbar').setStatusCaption(me.textChangesSaved, false, 3000);
                            }, 500);
                        } else
                            this.getApplication().getController('Statusbar').setStatusCaption(this.textChangesSaved, false, 3000);
                    } else
                        this.getApplication().getController('Statusbar').setStatusCaption('');
                }

                action = this.stackLongActions.get({type: Asc.c_oAscAsyncActionType.BlockInteraction});
                action ? this.setLongActionView(action) : this.loadMask && this.loadMask.hide();

                if ((id==Asc.c_oAscAsyncAction['Save'] || id==Asc.c_oAscAsyncAction['ForceSaveButton']) && (!this._state.fastCoauth || this._state.usersCount<2))
                    this.synchronizeChanges();

                if ( type == Asc.c_oAscAsyncActionType.BlockInteraction &&
                    (!this.getApplication().getController('LeftMenu').dlgSearch || !this.getApplication().getController('LeftMenu').dlgSearch.isVisible()) &&
                    !( id == Asc.c_oAscAsyncAction['ApplyChanges'] && (this.dontCloseDummyComment || this.dontCloseChat)) ) {
//                        this.onEditComplete(this.loadMask); //???????? ???????????? ??????????, ???? ?????? ???????????????? ?????????? ??????????????????, ?????????????????????????? ???????? ?????????????????????? ????????
                        this.api.asc_enableKeyEvents(true);
                }
            },

            setLongActionView: function(action) {
                var title = '', text = '', force = false;

                switch (action.id) {
                    case Asc.c_oAscAsyncAction['Open']:
                        title   = this.openTitleText;
                        text    = this.openTextText;
                        break;

                    case Asc.c_oAscAsyncAction['Save']:
                    case Asc.c_oAscAsyncAction['ForceSaveButton']:
                        clearTimeout(this._state.timerSave);
                        force = true;
                        title   = (!this.appOptions.isOffline) ? this.saveTitleText : '';
                        text    = (!this.appOptions.isOffline) ? this.saveTextText : '';
                        break;

                    case Asc.c_oAscAsyncAction['ForceSaveTimeout']:
                        break;

                    case Asc.c_oAscAsyncAction['LoadDocumentFonts']:
                        title   = this.loadFontsTitleText;
                        text    = this.loadFontsTextText;
                        break;

                    case Asc.c_oAscAsyncAction['LoadDocumentImages']:
                        title   = this.loadImagesTitleText;
                        text    = this.loadImagesTextText;
                        break;

                    case Asc.c_oAscAsyncAction['LoadFont']:
                        title   = this.loadFontTitleText;
                        text    = this.loadFontTextText;
                        break;

                    case Asc.c_oAscAsyncAction['LoadImage']:
                        title   = this.loadImageTitleText;
                        text    = this.loadImageTextText;
                        break;

                    case Asc.c_oAscAsyncAction['DownloadAs']:
                        title   = this.downloadTitleText;
                        text    = this.downloadTextText;
                        break;

                    case Asc.c_oAscAsyncAction['Print']:
                        title   = this.printTitleText;
                        text    = this.printTextText;
                        break;

                    case Asc.c_oAscAsyncAction['UploadImage']:
                        title   = this.uploadImageTitleText;
                        text    = this.uploadImageTextText;
                        break;

                    case Asc.c_oAscAsyncAction['ApplyChanges']:
                        title   = this.applyChangesTitleText;
                        text    = this.applyChangesTextText;
                        break;

                    case Asc.c_oAscAsyncAction['PrepareToSave']:
                        title   = this.savePreparingText;
                        text    = this.savePreparingTitle;
                        break;

                    case Asc.c_oAscAsyncAction['MailMergeLoadFile']:
                        title   = this.mailMergeLoadFileText;
                        text    = this.mailMergeLoadFileTitle;
                        break;

                    case Asc.c_oAscAsyncAction['DownloadMerge']:
                        title   = this.downloadMergeTitle;
                        text    = this.downloadMergeText;
                        break;

                    case Asc.c_oAscAsyncAction['SendMailMerge']:
                        title   = this.sendMergeTitle;
                        text    = this.sendMergeText;
                        break;

                    case ApplyEditRights:
                        title   = this.txtEditingMode;
                        text    = this.txtEditingMode;
                        break;

                    case LoadingDocument:
                        title   = this.loadingDocumentTitleText;
                        text    = this.loadingDocumentTextText;
                        break;
                }

                if (action.type == Asc.c_oAscAsyncActionType['BlockInteraction']) {
                    if (!this.loadMask)
                        this.loadMask = new Common.UI.LoadMask({owner: $('#viewport')});

                    this.loadMask.setTitle(title);

                    if (!this.isShowOpenDialog)
                        this.loadMask.show();
                }
                else {
                    this.getApplication().getController('Statusbar').setStatusCaption(text, force);
                }
            },

            onApplyEditRights: function(data) {
                this.getApplication().getController('Statusbar').setStatusCaption('');

                if (data && !data.allowed) {
                    Common.UI.info({
                        title: this.requestEditFailedTitleText,
                        msg: data.message || this.requestEditFailedMessageText
                    });
                }
            },

            onDocumentContentReady: function() {
                if (this._isDocReady)
                    return;

                Common.Gateway.documentReady();

                var me = this,
                    value;

                me._isDocReady = true;

                me.api.SetDrawingFreeze(false);
                me.hidePreloader();
                me.onLongActionEnd(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);

                /** coauthoring begin **/
                value = Common.localStorage.getItem("de-settings-livecomment");
                this.isLiveCommenting = !(value!==null && parseInt(value) == 0);
                var resolved = Common.localStorage.getItem("de-settings-resolvedcomment");
                this.isLiveCommenting ? this.api.asc_showComments(!(resolved!==null && parseInt(resolved) == 0)) : this.api.asc_hideComments();
                /** coauthoring end **/

                value = Common.localStorage.getItem("de-settings-zoom");
                var zf = (value!==null) ? parseInt(value) : (this.appOptions.customization && this.appOptions.customization.zoom ? parseInt(this.appOptions.customization.zoom) : 100);
                (zf == -1) ? this.api.zoomFitToPage() : ((zf == -2) ? this.api.zoomFitToWidth() : this.api.zoom(zf>0 ? zf : 100));

                value = Common.localStorage.getItem("de-show-hiddenchars");
                me.api.put_ShowParaMarks((value!==null) ? eval(value) : false);

                value = Common.localStorage.getItem("de-show-tableline");
                me.api.put_ShowTableEmptyLine((value!==null) ? eval(value) : true);

                value = Common.localStorage.getItem("de-settings-spellcheck");
                me.api.asc_setSpellCheck(value===null || parseInt(value) == 1);

                Common.localStorage.setItem("de-settings-showsnaplines", me.api.get_ShowSnapLines() ? 1 : 0);

                function checkWarns() {
                    if (!window['AscDesktopEditor']) {
                        var tips = [];
                        Common.Utils.isIE9m && tips.push(me.warnBrowserIE9);

                        if (tips.length) me.showTips(tips);
                    }
                    document.removeEventListener('visibilitychange', checkWarns);
                }

                if (typeof document.hidden !== 'undefined' && document.hidden) {
                    document.addEventListener('visibilitychange', checkWarns);
                } else checkWarns();

                me.api.asc_registerCallback('asc_onStartAction',            _.bind(me.onLongActionBegin, me));
                me.api.asc_registerCallback('asc_onEndAction',              _.bind(me.onLongActionEnd, me));
                me.api.asc_registerCallback('asc_onCoAuthoringDisconnect',  _.bind(me.onCoAuthoringDisconnect, me));
                me.api.asc_registerCallback('asc_onPrint',                  _.bind(me.onPrint, me));

                var application = me.getApplication();
                application.getController('Viewport')
                    .getView('Common.Views.Header')
                    .setDocumentCaption(me.api.asc_getDocumentName());

                me.updateWindowTitle(true);

                value = Common.localStorage.getItem("de-settings-inputmode");
                me.api.SetTextBoxInputMode(value!==null && parseInt(value) == 1);

                /** coauthoring begin **/
                if (me.appOptions.isEdit && !me.appOptions.isOffline && me.appOptions.canCoAuthoring) {
                    value = Common.localStorage.getItem("de-settings-coauthmode");
                    if (value===null && Common.localStorage.getItem("de-settings-autosave")===null &&
                        me.appOptions.customization && me.appOptions.customization.autosave===false) {
                        value = 0; // use customization.autosave only when de-settings-coauthmode and de-settings-autosave are null
                    }
                    me._state.fastCoauth = (value===null || parseInt(value) == 1);
                    me.api.asc_SetFastCollaborative(me._state.fastCoauth);

                    value = Common.localStorage.getItem((me._state.fastCoauth) ? "de-settings-showchanges-fast" : "de-settings-showchanges-strict");
                    if (value !== null)
                        me.api.SetCollaborativeMarksShowType(value == 'all' ? Asc.c_oAscCollaborativeMarksShowType.All :
                                value == 'none' ? Asc.c_oAscCollaborativeMarksShowType.None : Asc.c_oAscCollaborativeMarksShowType.LastChanges);
                    else
                        me.api.SetCollaborativeMarksShowType(me._state.fastCoauth ? Asc.c_oAscCollaborativeMarksShowType.None : Asc.c_oAscCollaborativeMarksShowType.LastChanges);
                } else if (!me.appOptions.isEdit && me.appOptions.canComments) {
                    me._state.fastCoauth = true;
                    me.api.asc_SetFastCollaborative(me._state.fastCoauth);
                    me.api.SetCollaborativeMarksShowType(Asc.c_oAscCollaborativeMarksShowType.None);
                    me.api.asc_setAutoSaveGap(1);
                } else {
                    me._state.fastCoauth = false;
                    me.api.asc_SetFastCollaborative(me._state.fastCoauth);
                    me.api.SetCollaborativeMarksShowType(Asc.c_oAscCollaborativeMarksShowType.None);
                }
                /** coauthoring end **/

                var toolbarController           = application.getController('Toolbar'),
                    statusbarController         = application.getController('Statusbar'),
                    documentHolderController    = application.getController('DocumentHolder'),
                    fontsController             = application.getController('Common.Controllers.Fonts'),
                    rightmenuController         = application.getController('RightMenu'),
                    leftmenuController          = application.getController('LeftMenu'),
                    chatController              = application.getController('Common.Controllers.Chat'),
                    pluginsController           = application.getController('Common.Controllers.Plugins');

                leftmenuController.getView('LeftMenu').getMenu('file').loadDocument({doc:me.document});
                leftmenuController.setMode(me.appOptions).createDelayedElements().setApi(me.api);

                chatController.setApi(this.api).setMode(this.appOptions);
                application.getController('Common.Controllers.ExternalDiagramEditor').setApi(this.api).loadConfig({config:this.editorConfig, customization: this.editorConfig.customization});
                application.getController('Common.Controllers.ExternalMergeEditor').setApi(this.api).loadConfig({config:this.editorConfig, customization: this.editorConfig.customization});

                pluginsController.setApi(me.api);
                if (me.plugins && me.plugins.pluginsData && me.plugins.pluginsData.length>0)
                    me.updatePlugins(me.plugins, false);
                else
                    me.requestPlugins();
                me.api.asc_registerCallback('asc_onPluginsInit', _.bind(me.updatePluginsList, me));

                documentHolderController.setApi(me.api);
                documentHolderController.createDelayedElements();
                statusbarController.createDelayedElements();

                leftmenuController.getView('LeftMenu').disableMenu('all',false);

                if (me.appOptions.canBranding)
                    me.getApplication().getController('LeftMenu').leftMenu.getMenu('about').setLicInfo(me.editorConfig.customization);

                documentHolderController.getView('DocumentHolder').setApi(me.api).on('editcomplete', _.bind(me.onEditComplete, me));

                if (me.appOptions.isEdit) {
                    value = Common.localStorage.getItem("de-settings-autosave");
                    if (value===null && me.appOptions.customization && me.appOptions.customization.autosave===false)
                        value = 0;
                    value = (!me._state.fastCoauth && value!==null) ? parseInt(value) : (me.appOptions.canCoAuthoring ? 1 : 0);

                    me.api.asc_setAutoSaveGap(value);

                    if (me.appOptions.canForcesave) {// use asc_setIsForceSaveOnUserSave only when customization->forcesave = true
                        value = Common.localStorage.getItem("de-settings-forcesave");
                        me.appOptions.forcesave = (value===null) ? me.appOptions.canForcesave : (parseInt(value)==1);
                        me.api.asc_setIsForceSaveOnUserSave(me.appOptions.forcesave);
                    }

                    if (me.needToUpdateVersion)
                        Common.NotificationCenter.trigger('api:disconnect');
                    var timer_sl = setInterval(function(){
                        if (window.styles_loaded) {
                            clearInterval(timer_sl);

                            toolbarController.createDelayedElements();

                            documentHolderController.getView('DocumentHolder').createDelayedElements();
                            me.setLanguages();

                            var shapes = me.api.asc_getPropertyEditorShapes();
                            if (shapes)
                                me.fillAutoShapes(shapes[0], shapes[1]);

                            rightmenuController.createDelayedElements();

                            me.updateThemeColors();
                            toolbarController.activateControls();
                            if (me.needToUpdateVersion)
                                toolbarController.onApiCoAuthoringDisconnect();
                            me.api.UpdateInterfaceState();
                            me.fillTextArt(me.api.asc_getTextArtPreviews());

                            if (me.appOptions.canBrandingExt)
                                Common.NotificationCenter.trigger('document:ready', 'main');
                        }
                    }, 50);
                } else {
                    documentHolderController.getView('DocumentHolder').createDelayedElementsViewer();
                    if (me.appOptions.canBrandingExt)
                        Common.NotificationCenter.trigger('document:ready', 'main');
                }

                if (this.appOptions.canAnalytics && false)
                    Common.component.Analytics.initialize('UA-12442749-13', 'Document Editor');

                Common.Gateway.on('applyeditrights',        _.bind(me.onApplyEditRights, me));
                Common.Gateway.on('processsaveresult',      _.bind(me.onProcessSaveResult, me));
                Common.Gateway.on('processrightschange',    _.bind(me.onProcessRightsChange, me));
                Common.Gateway.on('processmouse',           _.bind(me.onProcessMouse, me));
                Common.Gateway.on('refreshhistory',         _.bind(me.onRefreshHistory, me));
                Common.Gateway.on('save', function () {
                    if (me.api.isDocumentModified()) {
                        me.api.asc_Save();
                        return true;
                    }
                });
                Common.Gateway.on('downloadas',             _.bind(me.onDownloadAs, me));

                Common.Gateway.sendInfo({mode:me.appOptions.isEdit?'edit':'view'});

                $(document).on('contextmenu', _.bind(me.onContextMenu, me));

                if (this._state.licenseWarning) {
                    value = Common.localStorage.getItem("de-license-warning");
                    value = (value!==null) ? parseInt(value) : 0;
                    var now = (new Date).getTime();
                    if (now - value > 86400000) {
                        Common.localStorage.setItem("de-license-warning", now);
                        Common.UI.info({
                            width: 500,
                            title: this.textNoLicenseTitle,
                            msg  : this.warnNoLicense,
                            buttons: [
                                {value: 'buynow', caption: this.textBuyNow},
                                {value: 'contact', caption: this.textContactUs}
                            ],
                            primary: 'buynow',
                            callback: function(btn) {
                                if (btn == 'buynow')
                                    window.open('https://www.onlyoffice.com', "_blank");
                                else if (btn == 'contact')
                                    window.open('mailto:sales@onlyoffice.com', "_blank");
                            }
                        });
                    }
                }
            },

            onOpenDocument: function(progress) {
                var elem = document.getElementById('loadmask-text');
                var proc = (progress.asc_getCurrentFont() + progress.asc_getCurrentImage())/(progress.asc_getFontsCount() + progress.asc_getImagesCount());
                proc = this.textLoadingDocument + ': ' + Math.min(Math.round(proc*100), 100) + '%';
                elem ? elem.innerHTML = proc : this.loadMask.setTitle(proc);
            },

            onEditorPermissions: function(params) {
                var licType = params.asc_getLicenseType();
                if (Asc.c_oLicenseResult.Expired === licType || Asc.c_oLicenseResult.Error === licType || Asc.c_oLicenseResult.ExpiredTrial === licType) {
                    Common.UI.warning({
                        title: this.titleLicenseExp,
                        msg: this.warnLicenseExp,
                        buttons: [],
                        closable: false
                    });
                    return;
                }

                if ( this.onServerVersion(params.asc_getBuildVersion()) ) return;

                this.permissions.review = (this.permissions.review === undefined) ? (this.permissions.edit !== false) : this.permissions.review;

                if (params.asc_getRights() !== Asc.c_oRights.Edit)
                    this.permissions.edit = this.permissions.review = false;

                this.appOptions.canAnalytics   = params.asc_getIsAnalyticsEnable();
                this.appOptions.canLicense     = (licType === Asc.c_oLicenseResult.Success || licType === Asc.c_oLicenseResult.SuccessLimit);
                this.appOptions.isLightVersion = params.asc_getIsLight();
                /** coauthoring begin **/
                this.appOptions.canCoAuthoring = !this.appOptions.isLightVersion;
                /** coauthoring end **/
                this.appOptions.isOffline      = this.api.asc_isOffline();
                this.appOptions.isReviewOnly   = (this.permissions.review === true) && (this.permissions.edit === false);
                this.appOptions.canRequestEditRights = this.editorConfig.canRequestEditRights;
                this.appOptions.canEdit        = (this.permissions.edit !== false || this.permissions.review === true) && // can edit or review
                                                 (this.editorConfig.canRequestEditRights || this.editorConfig.mode !== 'view') && // if mode=="view" -> canRequestEditRights must be defined
                                                 (!this.appOptions.isReviewOnly || this.appOptions.canLicense); // if isReviewOnly==true -> canLicense must be true
                this.appOptions.isEdit         = this.appOptions.canLicense && this.appOptions.canEdit && this.editorConfig.mode !== 'view';
                this.appOptions.canReview      = this.appOptions.canLicense && this.appOptions.isEdit && (this.permissions.review===true);
                this.appOptions.canUseHistory  = this.appOptions.canLicense && !this.appOptions.isLightVersion && this.editorConfig.canUseHistory && this.appOptions.canCoAuthoring && !this.appOptions.isDesktopApp;
                this.appOptions.canHistoryClose  = this.editorConfig.canHistoryClose;
                this.appOptions.canHistoryRestore= this.editorConfig.canHistoryRestore && !!this.permissions.changeHistory;
                this.appOptions.canUseMailMerge= this.appOptions.canLicense && this.appOptions.canEdit && /*!this.appOptions.isDesktopApp*/ !this.appOptions.isOffline && !!this.editorConfig.fileChoiceUrl;
                this.appOptions.canSendEmailAddresses  = this.appOptions.canLicense && this.editorConfig.canSendEmailAddresses && this.appOptions.canEdit && this.appOptions.canCoAuthoring;
                this.appOptions.canComments    = this.appOptions.canLicense && (this.permissions.comment===undefined ? this.appOptions.isEdit : this.permissions.comment);
                this.appOptions.canComments    = this.appOptions.canComments && !((typeof (this.editorConfig.customization) == 'object') && this.editorConfig.customization.comments===false);
                this.appOptions.canChat        = this.appOptions.canLicense && !this.appOptions.isOffline && !((typeof (this.editorConfig.customization) == 'object') && this.editorConfig.customization.chat===false);
                this.appOptions.canEditStyles  = this.appOptions.canLicense && this.appOptions.canEdit;
                this.appOptions.canPrint       = (this.permissions.print !== false);
                this.appOptions.canRename      = !!this.permissions.rename;
                this.appOptions.buildVersion   = params.asc_getBuildVersion();
                this.appOptions.canForcesave   = this.appOptions.isEdit && !this.appOptions.isOffline && (typeof (this.editorConfig.customization) == 'object' && !!this.editorConfig.customization.forcesave);
                this.appOptions.forcesave      = this.appOptions.canForcesave;
                this.appOptions.canEditComments= this.appOptions.isOffline || !(typeof (this.editorConfig.customization) == 'object' && this.editorConfig.customization.commentAuthorOnly);
                this.appOptions.trialMode      = params.asc_getLicenseMode();

                var type = /^(?:(pdf|djvu|xps))$/.exec(this.document.fileType);
                this.appOptions.canDownloadOrigin = !this.appOptions.nativeApp && this.permissions.download !== false && (type && typeof type[1] === 'string');
                this.appOptions.canDownload       = !this.appOptions.nativeApp && this.permissions.download !== false && (!type || typeof type[1] !== 'string');

                this._state.licenseWarning = (licType===Asc.c_oLicenseResult.Connections) && this.appOptions.canEdit && this.editorConfig.mode !== 'view';

                var headerView = this.getApplication().getController('Viewport').getView('Common.Views.Header');
                this.appOptions.canBranding  = (licType === Asc.c_oLicenseResult.Success) && (typeof this.editorConfig.customization == 'object');
                if (this.appOptions.canBranding)
                    headerView.setBranding(this.editorConfig.customization);

                this.appOptions.canRename && headerView.setCanRename(true);

                this.appOptions.canBrandingExt = params.asc_getCanBranding() && (typeof this.editorConfig.customization == 'object' || this.editorConfig.plugins);
                if (this.appOptions.canBrandingExt)
                    this.updatePlugins(this.plugins, true);

                this.applyModeCommonElements();
                this.applyModeEditorElements();

                this.api.asc_setViewMode(!this.appOptions.isEdit && !this.appOptions.canComments);
                (!this.appOptions.isEdit && this.appOptions.canComments) && this.api.asc_setRestriction(Asc.c_oAscRestrictionType.OnlyComments);
                this.api.asc_LoadDocument();

                if (!this.appOptions.isEdit) {
                    this.hidePreloader();
                    this.onLongActionBegin(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);
                }
            },

            applyModeCommonElements: function() {
                window.editor_elements_prepared = true;

                var value = Common.localStorage.getItem("de-hidden-title");
                    value = this.appOptions.isEdit && (value!==null && parseInt(value) == 1);

                var app             = this.getApplication(),
                    viewport        = app.getController('Viewport').getView('Viewport'),
                    headerView      = app.getController('Viewport').getView('Common.Views.Header'),
                    statusbarView   = app.getController('Statusbar').getView('Statusbar'),
                    documentHolder  = app.getController('DocumentHolder').getView('DocumentHolder');

                if (headerView) {
                    headerView.setHeaderCaption(this.appOptions.isEdit ? 'Document Editor' : 'Document Viewer');
                    headerView.setVisible(!this.appOptions.nativeApp && !value && !this.appOptions.isDesktopApp);
                }

                if (this.appOptions.nativeApp) {
                    $('body').removeClass('safari');
                }

                viewport && viewport.setMode(this.appOptions);
                statusbarView && statusbarView.setMode(this.appOptions);

                documentHolder.setMode(this.appOptions);

                this.api.asc_registerCallback('asc_onSendThemeColors', _.bind(this.onSendThemeColors, this));
                this.api.asc_registerCallback('asc_onDownloadUrl',     _.bind(this.onDownloadUrl, this));
            },

            applyModeEditorElements: function() {
                if (this.appOptions.canComments || this.appOptions.isEdit) {
                    /** coauthoring begin **/
                    this.contComments.setMode(this.appOptions);
                    this.contComments.setConfig({config: this.editorConfig}, this.api);
                    /** coauthoring end **/
                }
                if (this.appOptions.isEdit) {
                    var me = this,
                        application         = this.getApplication(),
                        toolbarController   = application.getController('Toolbar'),
                        rightmenuController = application.getController('RightMenu'),
                        fontsControllers    = application.getController('Common.Controllers.Fonts'),
                        reviewController    = (this.appOptions.canReview) ? application.getController('Common.Controllers.ReviewChanges') : null;

                    fontsControllers    && fontsControllers.setApi(me.api);
                    toolbarController   && toolbarController.setApi(me.api);

                    rightmenuController && rightmenuController.setApi(me.api);

                    if (reviewController)
                        reviewController.setMode(me.appOptions).setConfig({config: me.editorConfig}, me.api);

                    var viewport = this.getApplication().getController('Viewport').getView('Viewport');

                    viewport.applyEditorMode();

                    var toolbarView = (toolbarController) ? toolbarController.getView('Toolbar') : null;

                    _.each([
                        toolbarView,
                        rightmenuController.getView('RightMenu')
                    ], function(view) {
                        if (view) {
                            view.setApi(me.api);
                            view.on('editcomplete', _.bind(me.onEditComplete, me));
                            view.setMode(me.appOptions);
                        }
                    });

                    if (toolbarView) {
                        toolbarView.on('insertimage', _.bind(me.onInsertImage, me));
                        toolbarView.on('inserttable', _.bind(me.onInsertTable, me));
                        toolbarView.on('insertshape', _.bind(me.onInsertShape, me));
                        toolbarView.on('inserttextart', _.bind(me.onInsertTextArt, me));
                        toolbarView.on('insertchart', _.bind(me.onInsertChart, me));
                    }

                    var value = Common.localStorage.getItem('de-settings-unit');
                    value = (value!==null) ? parseInt(value) : Common.Utils.Metric.getDefaultMetric();
                    Common.Utils.Metric.setCurrentMetric(value);
                    me.api.asc_SetDocumentUnits((value==Common.Utils.Metric.c_MetricUnits.inch) ? Asc.c_oAscDocumentUnits.Inch : ((value==Common.Utils.Metric.c_MetricUnits.pt) ? Asc.c_oAscDocumentUnits.Point : Asc.c_oAscDocumentUnits.Millimeter));

                    value = Common.localStorage.getItem('de-hidden-rulers');
                    me.api.asc_SetViewRulers(value===null || parseInt(value) === 0);

                    me.api.asc_registerCallback('asc_onDocumentModifiedChanged', _.bind(me.onDocumentModifiedChanged, me));
                    me.api.asc_registerCallback('asc_onDocumentCanSaveChanged',  _.bind(me.onDocumentCanSaveChanged, me));
                    /** coauthoring begin **/
                    me.api.asc_registerCallback('asc_onCollaborativeChanges',    _.bind(me.onCollaborativeChanges, me));
                    me.api.asc_registerCallback('asc_OnTryUndoInFastCollaborative',_.bind(me.onTryUndoInFastCollaborative, me));
                    me.api.asc_registerCallback('asc_onAuthParticipantsChanged', _.bind(me.onAuthParticipantsChanged, me));
                    me.api.asc_registerCallback('asc_onParticipantsChanged',     _.bind(me.onAuthParticipantsChanged, me));
                    /** coauthoring end **/

                    if (me.stackLongActions.exist({id: ApplyEditRights, type: Asc.c_oAscAsyncActionType['BlockInteraction']})) {
                        me.onLongActionEnd(Asc.c_oAscAsyncActionType['BlockInteraction'], ApplyEditRights);
                    } else if (!this._isDocReady) {
                        me.hidePreloader();
                        me.onLongActionBegin(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);
                    }

                    // Message on window close
                    window.onbeforeunload = _.bind(me.onBeforeUnload, me);
                    window.onunload = _.bind(me.onUnload, me);
                }
            },

            onExternalMessage: function(msg) {
                if (msg && msg.msg) {
                    msg.msg = (msg.msg).toString();
                    this.showTips([msg.msg.charAt(0).toUpperCase() + msg.msg.substring(1)]);

                    Common.component.Analytics.trackEvent('External Error');
                }
            },

            onError: function(id, level, errData) {
                this.hidePreloader();
                this.onLongActionEnd(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);

                var config = {
                    closable: false
                };

                switch (id)
                {
                    case Asc.c_oAscError.ID.Unknown:
                        config.msg = this.unknownErrorText;
                        break;

                    case Asc.c_oAscError.ID.ConvertationTimeout:
                        config.msg = this.convertationTimeoutText;
                        break;

                    case Asc.c_oAscError.ID.ConvertationOpenError:
                        config.msg = this.openErrorText;
                        break;

                    case Asc.c_oAscError.ID.ConvertationSaveError:
                        config.msg = this.saveErrorText;
                        break;

                    case Asc.c_oAscError.ID.DownloadError:
                        config.msg = this.downloadErrorText;
                        break;

                    case Asc.c_oAscError.ID.UplImageSize:
                        config.msg = this.uploadImageSizeMessage;
                        break;

                    case Asc.c_oAscError.ID.UplImageExt:
                        config.msg = this.uploadImageExtMessage;
                        break;

                    case Asc.c_oAscError.ID.UplImageFileCount:
                        config.msg = this.uploadImageFileCountMessage;
                        break;

                    case Asc.c_oAscError.ID.SplitCellMaxRows:
                        config.msg = this.splitMaxRowsErrorText.replace('%1', errData.get_Value());
                        break;

                    case Asc.c_oAscError.ID.SplitCellMaxCols:
                        config.msg = this.splitMaxColsErrorText.replace('%1', errData.get_Value());
                        break;

                    case Asc.c_oAscError.ID.SplitCellRowsDivider:
                        config.msg = this.splitDividerErrorText.replace('%1', errData.get_Value());
                        break;

                    case Asc.c_oAscError.ID.VKeyEncrypt:
                        config.msg = this.errorToken;
                        break;

                    case Asc.c_oAscError.ID.KeyExpire:
                        config.msg = this.errorTokenExpire;
                        break;

                    case Asc.c_oAscError.ID.UserCountExceed:
                        config.msg = this.errorUsersExceed;
                        break;

                    case Asc.c_oAscError.ID.CoAuthoringDisconnect:
                        config.msg = this.errorViewerDisconnect;
                        break;

                    case Asc.c_oAscError.ID.ConvertationPassword:
                        config.msg = this.errorFilePassProtect;
                        break;

                    case Asc.c_oAscError.ID.StockChartError:
                        config.msg = this.errorStockChart;
                        break;

                    case Asc.c_oAscError.ID.DataRangeError:
                        config.msg = this.errorDataRange;
                        break;

                    case Asc.c_oAscError.ID.Database:
                        config.msg = this.errorDatabaseConnection;
                        break;

                    case Asc.c_oAscError.ID.UserDrop:
                        if (this._state.lostEditingRights) {
                            this._state.lostEditingRights = false;
                            return;
                        }
                        this._state.lostEditingRights = true;
                        config.msg = this.errorUserDrop;
                        break;

                    case Asc.c_oAscError.ID.MailMergeLoadFile:
                        config.msg = this.errorMailMergeLoadFile;
                        break;

                    case Asc.c_oAscError.ID.MailMergeSaveFile:
                        config.msg = this.errorMailMergeSaveFile;
                        break;

                    case Asc.c_oAscError.ID.Warning:
                        config.msg = this.errorConnectToServer;
                        break;

                    case Asc.c_oAscError.ID.SessionAbsolute:
                        config.msg = this.errorSessionAbsolute;
                        break;

                    case Asc.c_oAscError.ID.SessionIdle:
                        config.msg = this.errorSessionIdle;
                        break;

                    case Asc.c_oAscError.ID.SessionToken:
                        config.msg = this.errorSessionToken;
                        break;

                    case Asc.c_oAscError.ID.AccessDeny:
                        config.msg = this.errorAccessDeny;
                        break;

                    case Asc.c_oAscError.ID.UplImageUrl:
                        config.msg = this.errorBadImageUrl;
                        break;

                    default:
                        config.msg = this.errorDefaultMessage.replace('%1', id);
                        break;
                }


                if (level == Asc.c_oAscError.Level.Critical) {

                    // report only critical errors
                    Common.Gateway.reportError(id, config.msg);

                    config.title = this.criticalErrorTitle;
                    config.iconCls = 'error';

                    if (this.appOptions.canBackToFolder) {
                        config.msg += '<br/><br/>' + this.criticalErrorExtText;
                        config.callback = function(btn) {
                            if (btn == 'ok')
                                Common.NotificationCenter.trigger('goback');
                        }
                    }
                }
                else {
                    config.title    = this.notcriticalErrorTitle;
                    config.iconCls  = 'warn';
                    config.buttons  = ['ok'];
                    config.callback = _.bind(function(btn){
                        if (id == Asc.c_oAscError.ID.Warning && btn == 'ok' && (this.appOptions.canDownload || this.appOptions.canDownloadOrigin)) {
                            Common.UI.Menu.Manager.hideAll();
                            if (this.appOptions.isDesktopApp && this.appOptions.isOffline)
                                this.api.asc_DownloadAs();
                            else
                                (this.appOptions.canDownload) ? this.getApplication().getController('LeftMenu').leftMenu.showMenu('file:saveas') : this.api.asc_DownloadOrigin();
                        }
                        this._state.lostEditingRights = false;
                        this.onEditComplete();
                    }, this);
                }

                Common.UI.alert(config);

                Common.component.Analytics.trackEvent('Internal Error', id.toString());
            },

            onCoAuthoringDisconnect: function() {
                this.getApplication().getController('Viewport').getView('Viewport').setMode({isDisconnected:true});
                this.getApplication().getController('Viewport').getView('Common.Views.Header').setCanRename(false);
                this.appOptions.canRename = false;
                this._state.isDisconnected = true;
            },

            showTips: function(strings) {
                var me = this;
                if (!strings.length) return;
                if (typeof(strings)!='object') strings = [strings];

                function showNextTip() {
                    var str_tip = strings.shift();
                    if (str_tip) {
                        str_tip += '\n' + me.textCloseTip;
                        tooltip.setTitle(str_tip);
                        tooltip.show();
                    }
                }

                if (!this.tooltip) {
                    this.tooltip = new Common.UI.Tooltip({
                        owner: this.getApplication().getController('Toolbar').getView('Toolbar'),
                        hideonclick: true,
                        placement: 'bottom',
                        cls: 'main-info',
                        offset: 30
                    });
                }

                var tooltip = this.tooltip;
                tooltip.on('tooltip:hide', function(){
                    setTimeout(showNextTip, 300);
                });

                showNextTip();
            },

            updateWindowTitle: function(force) {
                var isModified = this.api.isDocumentModified();
                if (this._state.isDocModified !== isModified || force) {
                    var title = this.defaultTitleText;

                    var headerView = this.getApplication()
                        .getController('Viewport')
                        .getView('Common.Views.Header');

                    if (!_.isEmpty(headerView.getDocumentCaption()))
                        title = headerView.getDocumentCaption() + ' - ' + title;

                    if (isModified) {
                        clearTimeout(this._state.timerCaption);
                        if (!_.isUndefined(title)) {
                            title = '* ' + title;
                            headerView.setDocumentCaption(headerView.getDocumentCaption(), true);
                        }
                    } else {
                        if (this._state.fastCoauth && this._state.usersCount>1) {
                            this._state.timerCaption = setTimeout(function () {
                                headerView.setDocumentCaption(headerView.getDocumentCaption(), false);
                            }, 500);
                        } else
                            headerView.setDocumentCaption(headerView.getDocumentCaption(), false);
                    }

                    if (window.document.title != title)
                        window.document.title = title;

                    Common.Gateway.setDocumentModified(isModified);
                    if (isModified && (!this._state.fastCoauth || this._state.usersCount<2))
                        this.getApplication().getController('Statusbar').setStatusCaption('', true);

                    this._state.isDocModified = isModified;
                }
            },

            onDocumentModifiedChanged: function() {
                var isModified = this.api.asc_isDocumentCanSave();
                if (this._state.isDocModified !== isModified) {
                    Common.Gateway.setDocumentModified(this.api.isDocumentModified());
                }

                this.updateWindowTitle();

                var toolbarView = this.getApplication().getController('Toolbar').getView('Toolbar');

                if (toolbarView) {
                    var isSyncButton = $('.btn-icon', toolbarView.btnSave.cmpEl).hasClass('btn-synch'),
                        forcesave = this.appOptions.forcesave;
                    if (toolbarView.btnSave.isDisabled() !== (!isModified && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave))
                        toolbarView.btnSave.setDisabled(!isModified && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave);
                }

                /** coauthoring begin **/
                if (this.contComments.isDummyComment && !this.dontCloseDummyComment) {
                    this.contComments.clearDummyComment();
                }
                /** coauthoring end **/
            },
            onDocumentCanSaveChanged: function (isCanSave) {
                var application = this.getApplication(),
                    toolbarController = application.getController('Toolbar'),
                    toolbarView = toolbarController.getView('Toolbar');

                if (toolbarView && this.api) {
                    var isSyncButton = $('.btn-icon', toolbarView.btnSave.cmpEl).hasClass('btn-synch'),
                        forcesave = this.appOptions.forcesave;
                    if (toolbarView.btnSave.isDisabled() !== (!isCanSave && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave))
                        toolbarView.btnSave.setDisabled(!isCanSave && !isSyncButton && !forcesave || this._state.isDisconnected || this._state.fastCoauth && this._state.usersCount>1 && !forcesave);
                }
            },

            onContextMenu: function(event){
                var canCopyAttr = event.target.getAttribute('data-can-copy'),
                    isInputEl   = (event.target instanceof HTMLInputElement) || (event.target instanceof HTMLTextAreaElement);

                if ((isInputEl && canCopyAttr === 'false') ||
                   (!isInputEl && canCopyAttr !== 'true')) {
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            },

            onBeforeUnload: function() {
                Common.localStorage.save();

                if (this.api.isDocumentModified()) {
                    var me = this;
                    this.api.asc_stopSaving();
                    this.continueSavingTimer = window.setTimeout(function() {
                        me.api.asc_continueSaving();
                    }, 500);

                    return this.leavePageText;
                }
            },

            onUnload: function() {
                if (this.continueSavingTimer) clearTimeout(this.continueSavingTimer);
            },

            hidePreloader: function() {
                if (!this._state.customizationDone) {
                    this._state.customizationDone = true;
                    if (this.appOptions.customization) {
                        if (this.appOptions.isDesktopApp)
                            this.appOptions.customization.about = false;
                        else if (!this.appOptions.canBrandingExt)
                            this.appOptions.customization.about = true;
                    }
                    Common.Utils.applyCustomization(this.appOptions.customization, mapCustomizationElements);
                    if (this.appOptions.canBrandingExt) {
                        Common.Utils.applyCustomization(this.appOptions.customization, mapCustomizationExtElements);
                        Common.Utils.applyCustomizationPlugins(this.UICustomizePlugins);
                    }
                }

                Common.NotificationCenter.trigger('layout:changed', 'main');
                $('#loading-mask').hide().remove();
            },

            onDownloadUrl: function(url) {
                if (this._state.isFromGatewayDownloadAs)
                    Common.Gateway.downloadAs(url);
                this._state.isFromGatewayDownloadAs = false;
            },

            onUpdateVersion: function(callback) {
                var me = this;
                me.needToUpdateVersion = true;
                me.onLongActionEnd(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);
                Common.UI.warning({
                    title: me.titleUpdateVersion,
                    msg: this.errorUpdateVersion,
                    callback: function() {
                        _.defer(function() {
                            Common.Gateway.updateVersion();
                            if (callback) callback.call(me);
                            me.onLongActionBegin(Asc.c_oAscAsyncActionType['BlockInteraction'], LoadingDocument);
                        })
                    }
                });
            },

            onServerVersion: function(buildVersion) {
                if (this.changeServerVersion) return true;

                if (DocsAPI.DocEditor.version() !== buildVersion && !window.compareVersions) {
                    this.changeServerVersion = true;
                    Common.UI.warning({
                        title: this.titleServerVersion,
                        msg: this.errorServerVersion,
                        callback: function() {
                            _.defer(function() {
                                Common.Gateway.updateVersion();
                            })
                        }
                    });
                    return true;
                }
                return false;
            },

            /** coauthoring begin **/
//            fillUserStore: function(users){
//                if (!_.isEmpty(users)){
//                    var userStore = this.getCommonStoreUsersStore();
//
//                    if (userStore)
//                        userStore.add(users);
//                }
//            },

            onCollaborativeChanges: function() {
                if (this._state.hasCollaborativeChanges) return;
                this._state.hasCollaborativeChanges = true;
                if (this.appOptions.isEdit)
                    this.getApplication().getController('Statusbar').setStatusCaption(this.txtNeedSynchronize, true);
            },
            /** coauthoring end **/

            synchronizeChanges: function() {
                this.getApplication().getController('Statusbar').synchronizeChanges();
                this.getApplication().getController('DocumentHolder').getView('DocumentHolder').hideTips();
                /** coauthoring begin **/
                this.getApplication().getController('Toolbar').getView('Toolbar').synchronizeChanges();
                /** coauthoring end **/
                this._state.hasCollaborativeChanges = false;
            },

            initNames: function() {
                this.shapeGroupNames = [
                    this.txtBasicShapes,
                    this.txtFiguredArrows,
                    this.txtMath,
                    this.txtCharts,
                    this.txtStarsRibbons,
                    this.txtCallouts,
                    this.txtButtons,
                    this.txtRectangles,
                    this.txtLines
                ];
            },

            fillAutoShapes: function(groupNames, shapes){
                if (_.isEmpty(shapes) || _.isEmpty(groupNames) || shapes.length != groupNames.length)
                    return;

                var me = this,
                    shapegrouparray = [],
                    shapeStore = this.getCollection('ShapeGroups');

                shapeStore.reset();

                var groupscount = groupNames.length;
                _.each(groupNames, function(groupName, index){
                    var store = new Backbone.Collection([], {
                        model: DE.Models.ShapeModel
                    });

                    var cols = (shapes[index].length) > 18 ? 7 : 6,
                        height = Math.ceil(shapes[index].length/cols) * 35 + 3,
                        width = 30 * cols;

                    _.each(shapes[index], function(shape, idx){
                        store.add({
                            imageUrl : shape.Image,
                            data     : {shapeType: shape.Type},
                            tip      : me.textShape + ' ' + (idx+1),
                            allowSelected : true,
                            selected: false
                        });
                    });

                    shapegrouparray.push({
                        groupName   : me.shapeGroupNames[index],
                        groupStore  : store,
                        groupWidth  : width,
                        groupHeight : height
                    });
                });

                shapeStore.add(shapegrouparray);

                setTimeout(function(){
                    me.getApplication().getController('Toolbar').fillAutoShapes();
                }, 50);

            },

            fillTextArt: function(shapes){
                if (_.isEmpty(shapes)) return;

                var me = this, arr = [],
                    artStore = this.getCollection('Common.Collections.TextArt');

                _.each(shapes, function(shape, index){
                    arr.push({
                        imageUrl : shape,
                        data     : index,
                        allowSelected : true,
                        selected: false
                    });
                });
                artStore.reset(arr);

                setTimeout(function(){
                    me.getApplication().getController('Toolbar').fillTextArt();
                }, 50);

                setTimeout(function(){
                    me.getApplication().getController('RightMenu').fillTextArt();
                }, 50);

            },

            updateThemeColors: function() {
                var me = this;
                setTimeout(function(){
                    me.getApplication().getController('RightMenu').UpdateThemeColors();
                }, 50);
                setTimeout(function(){
                    me.getApplication().getController('DocumentHolder').getView('DocumentHolder').updateThemeColors();
                }, 50);

                setTimeout(function(){
                    me.getApplication().getController('Toolbar').updateThemeColors();
                }, 50);
            },

            onSendThemeColors: function(colors, standart_colors) {
                Common.Utils.ThemeColor.setColors(colors, standart_colors);
                if (window.styles_loaded) {
                    this.updateThemeColors();
                    this.fillTextArt(this.api.asc_getTextArtPreviews());
                }
            },

            loadLanguages: function(apiLangs) {
                var langs = [], info;
                _.each(apiLangs, function(lang, index, list){
                    lang = parseInt(lang);
                    info = Common.util.LanguageInfo.getLocalLanguageName(lang);
                    langs.push({
                        title:  info[1],
                        tip:    info[0],
                        code:   lang
                    });
                }, this);

                langs.sort(function(a, b){
                    if (a.tip < b.tip) return -1;
                    if (a.tip > b.tip) return 1;
                    return 0;
                });

                this.languages = langs;
                window.styles_loaded && this.setLanguages();
            },

            setLanguages: function() {
                if (this.languages && this.languages.length>0) {
                    this.getApplication().getController('DocumentHolder').getView('DocumentHolder').setLanguages(this.languages);
                    this.getApplication().getController('Statusbar').setLanguages(this.languages);
                }
            },

            onInsertTable:  function() {
                this.getApplication().getController('RightMenu').onInsertTable();
            },

            onInsertImage:  function() {
                this.getApplication().getController('RightMenu').onInsertImage();
            },

            onInsertChart:  function() {
                this.getApplication().getController('RightMenu').onInsertChart();
            },

            onInsertShape:  function() {
                this.getApplication().getController('RightMenu').onInsertShape();
            },

            onInsertTextArt:  function() {
                this.getApplication().getController('RightMenu').onInsertTextArt();
            },

            unitsChanged: function(m) {
                var value = Common.localStorage.getItem("de-settings-unit");
                value = (value!==null) ? parseInt(value) : Common.Utils.Metric.getDefaultMetric();
                Common.Utils.Metric.setCurrentMetric(value);
                this.api.asc_SetDocumentUnits((value==Common.Utils.Metric.c_MetricUnits.inch) ? Asc.c_oAscDocumentUnits.Inch : ((value==Common.Utils.Metric.c_MetricUnits.pt) ? Asc.c_oAscDocumentUnits.Point : Asc.c_oAscDocumentUnits.Millimeter));
                this.getApplication().getController('RightMenu').updateMetricUnit();
                this.getApplication().getController('Toolbar').getView('Toolbar').updateMetricUnit();
            },

            onAdvancedOptions: function(advOptions) {
                var type = advOptions.asc_getOptionId(),
                    me = this, dlg;
                if (type == Asc.c_oAscAdvancedOptionsID.TXT) {
                    dlg = new Common.Views.OpenDialog({
                        type: type,
                        codepages: advOptions.asc_getOptions().asc_getCodePages(),
                        settings: advOptions.asc_getOptions().asc_getRecommendedSettings(),
                        handler: function (encoding) {
                            me.isShowOpenDialog = false;
                            if (me && me.api) {
                                me.api.asc_setAdvancedOptions(type, new Asc.asc_CTXTAdvancedOptions(encoding));
                                me.loadMask && me.loadMask.show();
                            }
                        }
                    });
                } else if (type == Asc.c_oAscAdvancedOptionsID.DRM) {
                    dlg = new Common.Views.OpenDialog({
                        type: type,
                        handler: function (value) {
                            me.isShowOpenDialog = false;
                            if (me && me.api) {
                                me.api.asc_setAdvancedOptions(type, new Asc.asc_CDRMAdvancedOptions(value));
                                me.loadMask && me.loadMask.show();
                            }
                        }
                    });
                }
                if (dlg) {
                    this.isShowOpenDialog = true;
                    this.loadMask && this.loadMask.hide();
                    this.onLongActionEnd(Asc.c_oAscAsyncActionType.BlockInteraction, LoadingDocument);
                    dlg.show();
                }
            },

            onTryUndoInFastCollaborative: function() {
                var val = window.localStorage.getItem("de-hide-try-undoredo");
                if (!(val && parseInt(val) == 1))
                    Common.UI.info({
                        width: 500,
                        msg: this.textTryUndoRedo,
                        iconCls: 'info',
                        buttons: ['custom', 'cancel'],
                        primary: 'custom',
                        customButtonText: this.textStrict,
                        dontshow: true,
                        callback: _.bind(function(btn, dontshow){
                            if (dontshow) window.localStorage.setItem("de-hide-try-undoredo", 1);
                            if (btn == 'custom') {
                                Common.localStorage.setItem("de-settings-coauthmode", 0);
                                this.api.asc_SetFastCollaborative(false);
                                this._state.fastCoauth = false;
                                Common.localStorage.setItem("de-settings-showchanges-strict", 'last');
                                this.api.SetCollaborativeMarksShowType(Asc.c_oAscCollaborativeMarksShowType.LastChanges);
                            }
                            this.fireEvent('editcomplete', this);
                        }, this)
                    });
            },

            onAuthParticipantsChanged: function(users) {
                var length = 0;
                _.each(users, function(item){
                    if (!item.asc_getView())
                        length++;
                });
                this._state.usersCount = length;
            },

            applySettings: function() {
                if (this.appOptions.isEdit && !this.appOptions.isOffline && this.appOptions.canCoAuthoring) {
                    var value = Common.localStorage.getItem("de-settings-coauthmode"),
                        oldval = this._state.fastCoauth;
                    this._state.fastCoauth = (value===null || parseInt(value) == 1);
                    if (this._state.fastCoauth && !oldval)
                        this.synchronizeChanges();
                }
                if (this.appOptions.canForcesave) {
                    value = Common.localStorage.getItem("de-settings-forcesave");
                    this.appOptions.forcesave = (value===null) ? this.appOptions.canForcesave : (parseInt(value)==1);
                    this.api.asc_setIsForceSaveOnUserSave(this.appOptions.forcesave);
                }
            },

            onDocumentName: function(name) {
                this.getApplication().getController('Viewport').getView('Common.Views.Header').setDocumentCaption(name);
                this.updateWindowTitle(true);
            },

            onMeta: function(meta) {
                var app = this.getApplication(),
                    filemenu = app.getController('LeftMenu').getView('LeftMenu').getMenu('file');
                app.getController('Viewport').getView('Common.Views.Header').setDocumentCaption(meta.title);
                this.updateWindowTitle(true);
                this.document.title = meta.title;
                filemenu.loadDocument({doc:this.document});
                filemenu.panels['info'].updateInfo(this.document);
                Common.Gateway.metaChange(meta);
            },

            onPrint: function() {
                if (!this.appOptions.canPrint) return;
                
                if (this.api)
                    this.api.asc_Print(Common.Utils.isChrome || Common.Utils.isSafari || Common.Utils.isOpera); // if isChrome or isSafari or isOpera == true use asc_onPrintUrl event
                Common.component.Analytics.trackEvent('Print');
            },

            onPrintUrl: function(url) {
                if (this.iframePrint) {
                    this.iframePrint.parentNode.removeChild(this.iframePrint);
                    this.iframePrint = null;
                }
                if (!this.iframePrint) {
                    var me = this;
                    this.iframePrint = document.createElement("iframe");
                    this.iframePrint.id = "id-print-frame";
                    this.iframePrint.style.display = 'none';
                    this.iframePrint.style.visibility = "hidden";
                    this.iframePrint.style.position = "fixed";
                    this.iframePrint.style.right = "0";
                    this.iframePrint.style.bottom = "0";
                    document.body.appendChild(this.iframePrint);
                    this.iframePrint.onload = function() {
                        me.iframePrint.contentWindow.focus();
                        me.iframePrint.contentWindow.print();
                        me.iframePrint.contentWindow.blur();
                        window.focus();
                    };
                }
                if (url) this.iframePrint.src = url;
            },

            requestPlugins: function(pluginsPath) { // request plugins
                if (!pluginsPath) return;

                this.updatePlugins( Common.Utils.getConfigJson(pluginsPath), false );
            },

            updatePlugins: function(plugins, uiCustomize) { // plugins from config
                if (!plugins) return;
                
                var pluginsData = (uiCustomize) ? plugins.UIpluginsData : plugins.pluginsData;
                if (!pluginsData || pluginsData.length<1) return;

                var arr = [],
                    baseUrl = _.isEmpty(plugins.url) ? "" : plugins.url;

                if (baseUrl !== "")
                    console.warn("Obsolete: The url parameter is deprecated. Please check the documentation for new plugin connection configuration.");

                pluginsData.forEach(function(item){
                    item = baseUrl + item; // for compatibility with previouse version of server, where plugins.url is used.
                    var value = Common.Utils.getConfigJson(item);
                    if (value) {
                        value.baseUrl = item.substring(0, item.lastIndexOf("config.json"));
                        value.oldVersion = (baseUrl !== "");
                        arr.push(value);
                    }
                });

                if (arr.length>0) {
                    var autostart = plugins.autostart || plugins.autoStartGuid;
                    if (typeof (autostart) == 'string')
                        autostart = [autostart];
                    plugins.autoStartGuid && console.warn("Obsolete: The autoStartGuid parameter is deprecated. Please check the documentation for new plugin connection configuration.");

                    this.updatePluginsList({
                        autostart: autostart,
                        pluginsData: arr
                    }, !!uiCustomize);
                }
            },

            updatePluginsList: function(plugins, uiCustomize) {
                var pluginStore = this.getApplication().getCollection('Common.Collections.Plugins'),
                    isEdit = this.appOptions.isEdit;
                if (plugins) {
                    var arr = [], arrUI = [];
                    plugins.pluginsData.forEach(function(item){
                        var variationsArr = [];
                        item.variations.forEach(function(itemVar){
                            if (_.contains(itemVar.EditorsSupport, 'word') && (isEdit || itemVar.isViewer)) {
                                var icons = itemVar.icons;
                                if (item.oldVersion) { // for compatibility with previouse version of server, where plugins.url is used.
                                    icons = [];
                                    itemVar.icons.forEach(function(icon){
                                        icons.push(icon.substring(icon.lastIndexOf("\/")+1));
                                    });
                                }
                                item.isUICustomizer ? arrUI.push(item.baseUrl + itemVar.url) :
                                variationsArr.push(new Common.Models.PluginVariation({
                                    description: itemVar.description,
                                    index: variationsArr.length,
                                    url : (item.oldVersion) ? (itemVar.url.substring(itemVar.url.lastIndexOf("\/")+1) ) : itemVar.url,
                                    icons  : icons,
                                    isViewer: itemVar.isViewer,
                                    EditorsSupport: itemVar.EditorsSupport,
                                    isVisual: itemVar.isVisual,
                                    isCustomWindow: itemVar.isCustomWindow,
                                    isModal: itemVar.isModal,
                                    isInsideMode: itemVar.isInsideMode,
                                    initDataType: itemVar.initDataType,
                                    initData: itemVar.initData,
                                    isUpdateOleOnResize : itemVar.isUpdateOleOnResize,
                                    buttons: itemVar.buttons,
                                    size: itemVar.size,
                                    initOnSelectionChanged: itemVar.initOnSelectionChanged
                                }));
                            }
                        });
                        if (variationsArr.length>0 && !item.isUICustomizer)
                            arr.push(new Common.Models.Plugin({
                                name : item.name,
                                guid: item.guid,
                                baseUrl : item.baseUrl,
                                variations: variationsArr,
                                currentVariation: 0
                            }));
                    });

                    if (uiCustomize!==false)  // from ui customizer in editor config or desktop event
                        this.UICustomizePlugins = arrUI;

                    if ( !uiCustomize ) {
                        if (pluginStore) pluginStore.reset(arr);
                        this.appOptions.canPlugins = !pluginStore.isEmpty();
                    }
                } else if (!uiCustomize){
                    this.appOptions.canPlugins = false;
                }
                if (this.appOptions.canPlugins) {
                    this.getApplication().getController('Common.Controllers.Plugins').setMode(this.appOptions);
                    if (plugins.autostart && plugins.autostart.length>0)
                        this.api.asc_pluginRun(plugins.autostart[0], 0, '');
                }
                if (!uiCustomize) this.getApplication().getController('LeftMenu').enablePlugins();
            },

            leavePageText: 'You have unsaved changes in this document. Click \'Stay on this Page\' then \'Save\' to save them. Click \'Leave this Page\' to discard all the unsaved changes.',
            defaultTitleText: 'ONLYOFFICE Document Editor',
            criticalErrorTitle: 'Error',
            notcriticalErrorTitle: 'Warning',
            errorDefaultMessage: 'Error code: %1',
            criticalErrorExtText: 'Press "Ok" to back to document list.',
            openTitleText: 'Opening Document',
            openTextText: 'Opening document...',
            saveTitleText: 'Saving Document',
            saveTextText: 'Saving document...',
            loadFontsTitleText: 'Loading Data',
            loadFontsTextText: 'Loading data...',
            loadImagesTitleText: 'Loading Images',
            loadImagesTextText: 'Loading images...',
            loadFontTitleText: 'Loading Data',
            loadFontTextText: 'Loading data...',
            loadImageTitleText: 'Loading Image',
            loadImageTextText: 'Loading image...',
            downloadTitleText: 'Downloading Document',
            downloadTextText: 'Downloading document...',
            printTitleText: 'Printing Document',
            printTextText: 'Printing document...',
            uploadImageTitleText: 'Uploading Image',
            uploadImageTextText: 'Uploading image...',
            savePreparingText: 'Preparing to save',
            savePreparingTitle: 'Preparing to save. Please wait...',
            uploadImageSizeMessage: 'Maximium image size limit exceeded.',
            uploadImageExtMessage: 'Unknown image format.',
            uploadImageFileCountMessage: 'No images uploaded.',
            reloadButtonText: 'Reload Page',
            unknownErrorText: 'Unknown error.',
            convertationTimeoutText: 'Convertation timeout exceeded.',
            downloadErrorText: 'Download failed.',
            unsupportedBrowserErrorText : 'Your browser is not supported.',
            splitMaxRowsErrorText: 'The number of rows must be less than %1',
            splitMaxColsErrorText: 'The number of columns must be less than %1',
            splitDividerErrorText: 'The number of rows must be a divisor of %1',
            requestEditFailedTitleText: 'Access denied',
            requestEditFailedMessageText: 'Someone is editing this document right now. Please try again later.',
            txtNeedSynchronize: 'You have an updates',
            textLoadingDocument: 'Loading document',
            warnBrowserZoom: 'Your browser\'s current zoom setting is not fully supported. Please reset to the default zoom by pressing Ctrl+0.',
            warnBrowserIE9: 'The application has low capabilities on IE9. Use IE10 or higher',
            applyChangesTitleText: 'Loading Data',
            applyChangesTextText: 'Loading data...',
            errorKeyEncrypt: 'Unknown key descriptor',
            errorKeyExpire: 'Key descriptor expired',
            errorUsersExceed: 'Count of users was exceed',
            errorCoAuthoringDisconnect: 'Server connection lost. You can\'t edit anymore.',
            errorFilePassProtect: 'The document is password protected.',
            txtBasicShapes: 'Basic Shapes',
            txtFiguredArrows: 'Figured Arrows',
            txtMath: 'Math',
            txtCharts: 'Charts',
            txtStarsRibbons: 'Stars & Ribbons',
            txtCallouts: 'Callouts',
            txtButtons: 'Buttons',
            txtRectangles: 'Rectangles',
            txtLines: 'Lines',
            txtEditingMode: 'Set editing mode...',
            textAnonymous: 'Anonymous',
            loadingDocumentTitleText: 'Loading document',
            loadingDocumentTextText: 'Loading document...',
            warnProcessRightsChange: 'You have been denied the right to edit the file.',
            errorProcessSaveResult: 'Saving is failed.',
            textCloseTip: 'Click to close the tip.',
            textShape: 'Shape',
            errorStockChart: 'Incorrect row order. To build a stock chart place the data on the sheet in the following order:<br> opening price, max price, min price, closing price.',
            errorDataRange: 'Incorrect data range.',
            errorDatabaseConnection: 'External error.<br>Database connection error. Please, contact support.',
            titleUpdateVersion: 'Version changed',
            errorUpdateVersion: 'The file version has been changed. The page will be reloaded.',
            errorUserDrop: 'The file cannot be accessed right now.',
            txtDiagramTitle: 'Chart Title',
            txtXAxis: 'X Axis',
            txtYAxis: 'Y Axis',
            txtSeries: 'Seria',
            errorMailMergeLoadFile: 'Loading failed',
            mailMergeLoadFileText: 'Loading Data Source...',
            mailMergeLoadFileTitle: 'Loading Data Source',
            errorMailMergeSaveFile: 'Merge failed.',
            downloadMergeText: 'Downloading...',
            downloadMergeTitle: 'Downloading',
            sendMergeTitle: 'Sending Merge',
            sendMergeText: 'Sending Merge...',
            txtArt: 'Your text here',
            errorConnectToServer: ' The document could not be saved. Please check connection settings or contact your administrator.<br>When you click the \'OK\' button, you will be prompted to download the document.<br><br>' +
                                  'Find more information about connecting Document Server <a href=\"https://api.onlyoffice.com/editors/callback\" target=\"_blank\">here</a>',
            textTryUndoRedo: 'The Undo/Redo functions are disabled for the Fast co-editing mode.<br>Click the \'Strict mode\' button to switch to the Strict co-editing mode to edit the file without other users interference and send your changes only after you save them. You can switch between the co-editing modes using the editor Advanced settings.',
            textStrict: 'Strict mode',
            txtErrorLoadHistory: 'Loading history failed',
            textBuyNow: 'Visit website',
            textNoLicenseTitle: 'ONLYOFFICE open source version',
            warnNoLicense: 'You are using an open source version of ONLYOFFICE. The version has limitations for concurrent connections to the document server (20 connections at a time).<br>If you need more please consider purchasing a commercial license.',
            textContactUs: 'Contact sales',
            errorViewerDisconnect: 'Connection is lost. You can still view the document,<br>but will not be able to download or print until the connection is restored.',
            warnLicenseExp: 'Your license has expired.<br>Please update your license and refresh the page.',
            titleLicenseExp: 'License expired',
            openErrorText: 'An error has occurred while opening the file',
            saveErrorText: 'An error has occurred while saving the file',
            errorToken: 'The document security token is not correctly formed.<br>Please contact your Document Server administrator.',
            errorTokenExpire: 'The document security token has expired.<br>Please contact your Document Server administrator.',
            errorSessionAbsolute: 'The document editing session has expired. Please reload the page.',
            errorSessionIdle: 'The document has not been edited for quite a long time. Please reload the page.',
            errorSessionToken: 'The connection to the server has been interrupted. Please reload the page.',
            errorAccessDeny: 'You are trying to perform an action you do not have rights for.<br>Please contact your Document Server administrator.',
            titleServerVersion: 'Editor updated',
            errorServerVersion: 'The editor version has been updated. The page will be reloaded to apply the changes.',
            textChangesSaved: 'All changes saved',
            errorBadImageUrl: 'Image url is incorrect',
            txtStyle_Normal: 'Normal',
            txtStyle_No_Spacing: 'No Spacing',
            txtStyle_Heading_1: 'Heading 1',
            txtStyle_Heading_2: 'Heading 2',
            txtStyle_Heading_3: 'Heading 3',
            txtStyle_Heading_4: 'Heading 4',
            txtStyle_Heading_5: 'Heading 5',
            txtStyle_Heading_6: 'Heading 6',
            txtStyle_Heading_7: 'Heading 7',
            txtStyle_Heading_8: 'Heading 8',
            txtStyle_Heading_9: 'Heading 9',
            txtStyle_Title: 'Title',
            txtStyle_Subtitle: 'Subtitle',
            txtStyle_Quote: 'Quote',
            txtStyle_Intense_Quote: 'Intense Quote',
            txtStyle_List_Paragraph: 'List Paragraph'
        }
    })(), DE.Controllers.Main || {}))
});
