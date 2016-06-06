<?xml version="1.0"?>
<ZopeData>
  <record id="1" aka="AAAAAAAAAAE=">
    <pickle>
      <global name="DTMLDocument" module="OFS.DTMLDocument"/>
    </pickle>
    <pickle>
      <dictionary>
        <item>
            <key> <string>_Cacheable__manager_id</string> </key>
            <value> <string>http_cache</string> </value>
        </item>
        <item>
            <key> <string>__name__</string> </key>
            <value> <string>jquery.calendar.js</string> </value>
        </item>
        <item>
            <key> <string>_vars</string> </key>
            <value>
              <dictionary/>
            </value>
        </item>
        <item>
            <key> <string>globals</string> </key>
            <value>
              <dictionary/>
            </value>
        </item>
        <item>
            <key> <string>raw</string> </key>
            <value> <string encoding="cdata"><![CDATA[

/**\n
  * @description {Class} wdCalendar\n
  * This is the main class of wdCalendar.\n
  */\n
; (function($) {\n
    var __WDAY = new Array(i18n.xgcalendar.dateformat.sun, i18n.xgcalendar.dateformat.mon, i18n.xgcalendar.dateformat.tue, i18n.xgcalendar.dateformat.wed, i18n.xgcalendar.dateformat.thu, i18n.xgcalendar.dateformat.fri, i18n.xgcalendar.dateformat.sat);\n
    var __MonthName = new Array(i18n.xgcalendar.dateformat.jan, i18n.xgcalendar.dateformat.feb, i18n.xgcalendar.dateformat.mar, i18n.xgcalendar.dateformat.apr, i18n.xgcalendar.dateformat.may, i18n.xgcalendar.dateformat.jun, i18n.xgcalendar.dateformat.jul, i18n.xgcalendar.dateformat.aug, i18n.xgcalendar.dateformat.sep, i18n.xgcalendar.dateformat.oct, i18n.xgcalendar.dateformat.nov, i18n.xgcalendar.dateformat.dec);\n
    if (!Clone || typeof (Clone) != "function") {\n
        var Clone = function(obj) {\n
            var objClone = new Object();\n
            if (obj.constructor == Object) {\n
                objClone = new obj.constructor();\n
            } else {\n
                objClone = new obj.constructor(obj.valueOf());\n
            }\n
            for (var key in obj) {\n
                if (objClone[key] != obj[key]) {\n
                    if (typeof (obj[key]) == \'object\') {\n
                        objClone[key] = Clone(obj[key]);\n
                    } else {\n
                        objClone[key] = obj[key];\n
                    }\n
                }\n
            }\n
            objClone.toString = obj.toString;\n
            objClone.valueOf = obj.valueOf;\n
            return objClone;\n
        }\n
    }\n
    if (!dateFormat || typeof (dateFormat) != "function") {\n
        var dateFormat = function(format) {\n
            var o = {\n
                "M+": this.getMonth() + 1,\n
                "d+": this.getDate(),\n
                "h+": this.getHours(),\n
                "H+": this.getHours(),\n
                "m+": this.getMinutes(),\n
                "s+": this.getSeconds(),\n
                "q+": Math.floor((this.getMonth() + 3) / 3),\n
                "w": "0123456".indexOf(this.getDay()),\n
                "W": __WDAY[this.getDay()],\n
                "L": __MonthName[this.getMonth()] //non-standard\n
            };\n
            if (/(y+)/.test(format)) {\n
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));\n
            }\n
            for (var k in o) {\n
                if (new RegExp("(" + k + ")").test(format))\n
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));\n
            }\n
            return format;\n
        };\n
    }\n
    if (!DateAdd || typeof (DateDiff) != "function") {\n
        var DateAdd = function(interval, number, idate) {\n
            number = parseInt(number);\n
            var date;\n
            if (typeof (idate) == "string") {\n
                date = idate.split(/\\D/);\n
                eval("var date = new Date(" + date.join(",") + ")");\n
            }\n
\n
            if (typeof (idate) == "object") {\n
                date = new Date(idate.toString());\n
            }\n
            switch (interval) {\n
                case "y": date.setFullYear(date.getFullYear() + number); break;\n
                case "m": date.setMonth(date.getMonth() + number); break;\n
                case "d": date.setDate(date.getDate() + number); break;\n
                case "w": date.setDate(date.getDate() + 7 * number); break;\n
                case "h": date.setHours(date.getHours() + number); break;\n
                case "n": date.setMinutes(date.getMinutes() + number); break;\n
                case "s": date.setSeconds(date.getSeconds() + number); break;\n
                case "l": date.setMilliseconds(date.getMilliseconds() + number); break;\n
            }\n
            return date;\n
        }\n
    }\n
    if (!DateDiff || typeof (DateDiff) != "function") {\n
        var DateDiff = function(interval, d1, d2) {\n
            switch (interval) {\n
                case "d": //date\n
                case "w":\n
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());\n
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());\n
                    break;  //w\n
                case "h":\n
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours());\n
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours());\n
                    break; //h\n
                case "n":\n
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes());\n
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes());\n
                    break;\n
                case "s":\n
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds());\n
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds());\n
                    break;\n
            }\n
            var t1 = d1.getTime(), t2 = d2.getTime();\n
            var diff = NaN;\n
            switch (interval) {\n
                case "y": diff = d2.getFullYear() - d1.getFullYear(); break; //y\n
                case "m": diff = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth(); break;    //m\n
                case "d": diff = Math.floor(t2 / 86400000) - Math.floor(t1 / 86400000); break;\n
                case "w": diff = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t1 + 345600000) / (604800000)); break; //w\n
                case "h": diff = Math.floor(t2 / 3600000) - Math.floor(t1 / 3600000); break; //h\n
                case "n": diff = Math.floor(t2 / 60000) - Math.floor(t1 / 60000); break; //\n
                case "s": diff = Math.floor(t2 / 1000) - Math.floor(t1 / 1000); break; //s\n
                case "l": diff = t2 - t1; break;\n
            }\n
            return diff;\n
\n
        }\n
    }\n
    if ($.fn.noSelect == undefined) {\n
        $.fn.noSelect = function(p) { //no select plugin by me :-)\n
            if (p == null)\n
                prevent = true;\n
            else\n
                prevent = p;\n
            if (prevent) {\n
                return this.each(function() {\n
                    if ($.browser.msie || $.browser.safari) $(this).bind(\'selectstart\', function() { return false; });\n
                    else if ($.browser.mozilla) {\n
                        $(this).css(\'MozUserSelect\', \'none\');\n
                        $(\'body\').trigger(\'focus\');\n
                    }\n
                    else if ($.browser.opera) $(this).bind(\'mousedown\', function() { return false; });\n
                    else $(this).attr(\'unselectable\', \'on\');\n
                });\n
\n
            } else {\n
                return this.each(function() {\n
                    if ($.browser.msie || $.browser.safari) $(this).unbind(\'selectstart\');\n
                    else if ($.browser.mozilla) $(this).css(\'MozUserSelect\', \'inherit\');\n
                    else if ($.browser.opera) $(this).unbind(\'mousedown\');\n
                    else $(this).removeAttr(\'unselectable\', \'on\');\n
                });\n
\n
            }\n
        }; //end noSelect\n
    }\n
    $.fn.bcalendar = function(option) {\n
        var def = {\n
            /**\n
             * @description {Config} view  \n
             * {String} Three calendar view provided, \'day\',\'week\',\'month\'. \'week\' by default.\n
             */\n
            view: "week", \n
            /**\n
             * @description {Config} weekstartday  \n
             * {Number} First day of week 0 for Sun, 1 for Mon, 2 for Tue.\n
             */\n
            weekstartday: 1,  //start from Monday by default\n
            theme: 0, //theme no\n
            /**\n
             * @description {Config} height  \n
             * {Number} Calendar height, false for page height by default.\n
             */\n
            height: false, \n
            /**\n
             * @description {Config} url  \n
             * {String} Url to request calendar data.\n
             */\n
            url: "", \n
            /**\n
             * @description {Config} eventItems  \n
             * {Array} event items for initialization.\n
             */   \n
            eventItems: [], \n
            method: "POST", \n
            /**\n
             * @description {Config} showday  \n
             * {Date} Current date. today by default.\n
             */\n
            showday: new Date(), \n
            /**\n
             * @description {Event} onBeforeRequestData:function(stage)\n
             * Fired before any ajax request is sent.\n
             * @param {Number} stage. 1 for retrieving events, 2 - adding event, 3 - removiing event, 4 - update event.\n
             */\n
            onBeforeRequestData: false, \n
            /**\n
             * @description {Event} onAfterRequestData:function(stage)\n
             * Fired before any ajax request is finished.\n
             * @param {Number} stage. 1 for retrieving events, 2 - adding event, 3 - removiing event, 4 - update event.\n
             */\n
            onAfterRequestData: false, \n
            /**\n
             * @description {Event} onAfterRequestData:function(stage)\n
             * Fired when some errors occur while any ajax request is finished.\n
             * @param {Number} stage. 1 for retrieving events, 2 - adding event, 3 - removiing event, 4 - update event.\n
             */\n
            onRequestDataError: false,              \n
            \n
            onWeekOrMonthToDay: false, \n
            /**\n
             * @description {Event} quickAddHandler:function(calendar, param )\n
             * Fired when user quick adds an item. If this function is set, ajax request to quickAddUrl will abort. \n
             * @param {Object} calendar Calendar object.\n
             * @param {Array} param Format [{name:"name1", value:"value1"}, ...]\n
             *             \n
             */\n
            quickAddHandler: false, \n
            /**\n
             * @description {Config} quickAddUrl  \n
             * {String} Url for quick adding. \n
             */\n
            quickAddUrl: "", \n
            /**\n
             * @description {Config} quickUpdateUrl  \n
             * {String} Url for time span update.\n
             */\n
            quickUpdateUrl: "", \n
            /**\n
             * @description {Config} quickDeleteUrl  \n
             * {String} Url for removing an event.\n
             */\n
            quickDeleteUrl: "", \n
            /**\n
             * @description {Config} autoload  \n
             * {Boolean} If event items is empty, and this param is set to true. \n
             * Event will be retrieved by ajax call right after calendar is initialized.\n
             */  \n
            autoload: false,\n
            /**\n
             * @description {Config} readonly  \n
             * {Boolean} Indicate calendar is readonly or editable \n
             */\n
            readonly: false, \n
            /**\n
             * @description {Config} extParam  \n
             * {Array} Extra params submitted to server. \n
             * Sample - [{name:"param1", value:"value1"}, {name:"param2", value:"value2"}]\n
             */\n
            extParam: [], \n
            /**\n
             * @description {Config} enableDrag  \n
             * {Boolean} Whether end user can drag event item by mouse. \n
             */\n
            enableDrag: true, \n
            loadDateR: [] \n
        };\n
        var eventDiv = $("#gridEvent");\n
        if (eventDiv.length == 0) {\n
            eventDiv = $("<div id=\'gridEvent\' style=\'display:none;\'></div>").appendTo(document.body);\n
        }\n
        var gridcontainer = $(this);\n
        option = $.extend(def, option);\n
        //no quickUpdateUrl, dragging disabled.\n
        if (option.quickUpdateUrl == null || option.quickUpdateUrl == "") {\n
            option.enableDrag = false;\n
        }\n
        //template for month and date\n
        var __SCOLLEVENTTEMP = "<DIV style=\\"WIDTH:${width};top:${top};left:${left};\\" title=\\"${title}\\" class=\\"chip chip${i} ${drag}\\"><div class=\\"dhdV\\" style=\\"display:none\\">${data}</div><DIV style=\\"BORDER-BOTTOM-COLOR:${bdcolor}\\" class=ct>&nbsp;</DIV><DL style=\\"BORDER-BOTTOM-COLOR:${bdcolor}; BACKGROUND-COLOR:${bgcolor1}; BORDER-TOP-COLOR: ${bdcolor}; HEIGHT: ${height}px; BORDER-RIGHT-COLOR:${bdcolor}; BORDER-LEFT-COLOR:${bdcolor}\\"><DT style=\\"BACKGROUND-COLOR:${bgcolor2}\\">${starttime} - ${endtime} ${icon}</DT><DD><SPAN>${content}</SPAN></DD><DIV class=\'resizer\' style=\'display:${redisplay}\'><DIV class=rszr_icon>&nbsp;</DIV></DIV></DL><DIV style=\\"BORDER-BOTTOM-COLOR:${bdcolor}; BACKGROUND-COLOR:${bgcolor1}; BORDER-TOP-COLOR: ${bdcolor}; BORDER-RIGHT-COLOR: ${bdcolor}; BORDER-LEFT-COLOR:${bdcolor}\\" class=cb1>&nbsp;</DIV><DIV style=\\"BORDER-BOTTOM-COLOR:${bdcolor}; BORDER-TOP-COLOR:${bdcolor}; BORDER-RIGHT-COLOR:${bdcolor}; BORDER-LEFT-COLOR:${bdcolor}\\" class=cb2>&nbsp;</DIV></DIV>";\n
        var __ALLDAYEVENTTEMP = \'<div class="rb-o ${eclass}" id="${id}" title="${title}" style="color:${color};"><div class="dhdV" style="display:none">${data}</div><div class="${extendClass} rb-m" style="background-color:${color}">${extendHTML}<div class="rb-i">${content}</div></div></div>\';\n
        var __MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];\n
        var __LASSOTEMP = "<div class=\'drag-lasso\' style=\'left:${left}px;top:${top}px;width:${width}px;height:${height}px;\'>&nbsp;</div>";\n
        //for dragging var\n
        var _dragdata;\n
        var _dragevent;\n
\n
        //clear DOM\n
        clearcontainer();\n
\n
        //no height specified in options, we get page height.\n
        if (!option.height) {\n
            option.height = document.documentElement.clientHeight;\n
        }\n
        //\n
        gridcontainer.css("overflow-y", "visible").height(option.height - 8);\n
\n
        //populate events data for first display.\n
        if (option.url && option.autoload) {\n
            populate(); \n
        }\n
        else {\n
            //contruct HTML          \n
            render();\n
            //get date range\n
            var d = getRdate();\n
            pushER(d.start, d.end);\n
        }\n
\n
        //clear DOM\n
        function clearcontainer() {\n
            gridcontainer.empty();\n
        }\n
        //get range\n
        function getRdate() {\n
            return { start: option.vstart, end: option.vend };\n
        }\n
        //add date range to cache.\n
        function pushER(start, end) {\n
            var ll = option.loadDateR.length;\n
            if (!end) {\n
                end = start;\n
            }\n
            if (ll == 0) {\n
                option.loadDateR.push({ startdate: start, enddate: end });\n
            }\n
            else {\n
                for (var i = 0; i < ll; i++) {\n
                    var dr = option.loadDateR[i];\n
                    var diff = DateDiff("d", start, dr.startdate);\n
                    if (diff == 0 || diff == 1) {\n
                        if (dr.enddate < end) {\n
                            dr.enddate = end;\n
                        }\n
                        break;\n
                    }\n
                    else if (diff > 1) {\n
                        var d2 = DateDiff("d", end, dr.startdate);\n
                        if (d2 > 1) {\n
                            option.loadDateR.splice(0, 0, { startdate: start, enddate: end });\n
                        }\n
                        else {\n
                            dr.startdate = start;\n
                            if (dr.enddate < end) {\n
                                dr.enddate = end;\n
                            }\n
                        }\n
                        break;\n
                    }\n
                    else {\n
                        var d3 = DateDiff("d", end, dr.startdate);\n
\n
                        if (dr.enddate < end) {\n
                            if (d3 < 1) {\n
                                dr.enddate = end;\n
                                break;\n
                            }\n
                            else {\n
                                if (i == ll - 1) {\n
                                    option.loadDateR.push({ startdate: start, enddate: end });\n
                                }\n
                            }\n
                        }\n
                    }\n
                }\n
                //end for\n
                //clear\n
                ll = option.loadDateR.length;\n
                if (ll > 1) {\n
                    for (var i = 0; i < ll - 1; ) {\n
                        var d1 = option.loadDateR[i];\n
                        var d2 = option.loadDateR[i + 1];\n
\n
                        var diff1 = DateDiff("d", d2.startdate, d1.enddate);\n
                        if (diff1 <= 1) {\n
                            d1.startdate = d2.startdate > d1.startdate ? d1.startdate : d2.startdate;\n
                            d1.enddate = d2.enddate > d1.enddate ? d2.enddate : d1.enddate;\n
                            option.loadDateR.splice(i + 1, 1);\n
                            ll--;\n
                            continue;\n
                        }\n
                        i++;\n
                    }\n
                }\n
            }\n
        }\n
        //contruct DOM \n
        function render() {\n
            //params needed\n
            //viewType, showday, events, config     \n
            var showday = new Date(option.showday.getFullYear(), option.showday.getMonth(), option.showday.getDate());\n
            var events = option.eventItems;\n
            var config = { view: option.view, weekstartday: option.weekstartday, theme: option.theme };\n
            if (option.view == "day" || option.view == "week") {\n
                var $dvtec = $("#dvtec");\n
                if ($dvtec.length > 0) {\n
                    option.scoll = $dvtec.attr("scrollTop"); //get scroll bar position\n
                }\n
            }\n
            switch (option.view) {\n
                case "day":\n
                    BuildDaysAndWeekView(showday, 1, events, config);\n
                    break;\n
                case "week":\n
                    BuildDaysAndWeekView(showday, 7, events, config);\n
                    break;\n
                case "month":\n
                    BuildMonthView(showday, events, config);\n
                    break;\n
                default:\n
                    alert(i18n.xgcalendar.no_implement);\n
                    break;\n
            }\n
            initevents(option.view); \n
            ResizeView();\n
        }\n
\n
        //build day view\n
        function BuildDaysAndWeekView(startday, l, events, config) {\n
            var days = [];\n
            if (l == 1) {\n
                var show = dateFormat.call(startday, i18n.xgcalendar.dateformat.Md);\n
                days.push({ display: show, date: startday, day: startday.getDate(), year: startday.getFullYear(), month: startday.getMonth() + 1 });\n
                option.datestrshow = CalDateShow(days[0].date);\n
                option.vstart = days[0].date;\n
                option.vend = days[0].date;\n
            }\n
            else {\n
                var w = 0;\n
                if (l == 7) {\n
                    w = config.weekstartday - startday.getDay();\n
                    if (w > 0) w = w - 7;\n
                }\n
                var ndate;\n
                for (var i = w, j = 0; j < l; i = i + 1, j++) {\n
                    ndate = DateAdd("d", i, startday);\n
                    var show = dateFormat.call(ndate, i18n.xgcalendar.dateformat.Md);\n
                    days.push({ display: show, date: ndate, day: ndate.getDate(), year: ndate.getFullYear(), month: ndate.getMonth() + 1 });\n
                }\n
                option.vstart = days[0].date;\n
                option.vend = days[l - 1].date;\n
                option.datestrshow = CalDateShow(days[0].date, days[l - 1].date);\n
            }\n
\n
            var allDayEvents = [];\n
            var scollDayEvents = [];\n
            //get number of all-day events, including more-than-one-day events.\n
            var dM = PropareEvents(days, events, allDayEvents, scollDayEvents);\n
\n
            var html = [];\n
            html.push("<div id=\\"dvwkcontaienr\\" class=\\"wktopcontainer\\">");\n
            html.push("<table class=\\"wk-top\\" border=\\"0\\" cellpadding=\\"0\\" cellspacing=\\"0\\">");\n
            BuildWT(html, days, allDayEvents, dM);\n
            html.push("</table>");\n
            html.push("</div>");\n
\n
            //onclick=\\"javascript:FunProxy(\'rowhandler\',event,this);\\"\n
            html.push("<div id=\\"dvtec\\"  class=\\"scolltimeevent\\"><table style=\\"table-layout: fixed;", jQuery.browser.msie ? "" : "width:100%", "\\" cellspacing=\\"0\\" cellpadding=\\"0\\"><tbody><tr><td>");\n
            html.push("<table style=\\"height: 1008px\\" id=\\"tgTable\\" class=\\"tg-timedevents\\" cellspacing=\\"0\\" cellpadding=\\"0\\"><tbody>");\n
            BuildDayScollEventContainer(html, days, scollDayEvents);\n
            html.push("</tbody></table></td></tr></tbody></table></div>");\n
            gridcontainer.html(html.join(""));\n
            html = null;\n
            //TODO event handlers\n
            //$("#weekViewAllDaywk").click(RowHandler);\n
        }\n
        //build month view\n
        function BuildMonthView(showday, events, config) {\n
            var cc = "<div id=\'cal-month-cc\' class=\'cc\'><div id=\'cal-month-cc-header\'><div class=\'cc-close\' id=\'cal-month-closebtn\'></div><div id=\'cal-month-cc-title\' class=\'cc-title\'></div></div><div id=\'cal-month-cc-body\' class=\'cc-body\'><div id=\'cal-month-cc-content\' class=\'st-contents\'><table class=\'st-grid\' cellSpacing=\'0\' cellPadding=\'0\'><tbody></tbody></table></div></div></div>";\n
            var html = [];\n
            html.push(cc);\n
            //build header\n
            html.push("<div id=\\"mvcontainer\\" class=\\"mv-container\\">");\n
            html.push("<table id=\\"mvweek\\" class=\\"mv-daynames-table\\" cellSpacing=\\"0\\" cellPadding=\\"0\\"><tbody><tr>");\n
            for (var i = config.weekstartday, j = 0; j < 7; i++, j++) {\n
                if (i > 6) i = 0;\n
                var p = { dayname: __WDAY[i] };\n
                html.push("<th class=\\"mv-dayname\\" title=\\"", __WDAY[i], "\\">", __WDAY[i], "");\n
            }\n
            html.push("</tr></tbody></table>");\n
            html.push("</div>");\n
            var bH = GetMonthViewBodyHeight() - GetMonthViewHeaderHeight();\n
\n
            html.push("<div id=\\"mvEventContainer\\" class=\\"mv-event-container\\" style=\\"height:", bH, "px;", "\\">");\n
            BuilderMonthBody(html, showday, config.weekstartday, events, bH);\n
            html.push("</div>");\n
            gridcontainer.html(html.join(""));\n
            html = null;\n
            $("#cal-month-closebtn").click(closeCc);\n
        }\n
        function closeCc() {\n
            $("#cal-month-cc").css("visibility", "hidden");\n
        }\n
        \n
        //all-day event, including more-than-one-day events \n
        function PropareEvents(dayarrs, events, aDE, sDE) {\n
            var l = dayarrs.length;\n
            var el = events.length;\n
            var fE = [];\n
            var deB = aDE;\n
            var deA = sDE;\n
            for (var j = 0; j < el; j++) {\n
                var sD = events[j][2];\n
                var eD = events[j][3];\n
                var s = {};\n
                s.event = events[j];\n
                s.day = sD.getDate();\n
                s.year = sD.getFullYear();\n
                s.month = sD.getMonth() + 1;\n
                s.allday = events[j][4] == 1;\n
                s.crossday = events[j][5] == 1;\n
                s.reevent = events[j][6] == 1; //Recurring event\n
                s.daystr = [s.year, s.month, s.day].join("/");\n
                s.st = {};\n
                s.st.hour = sD.getHours();\n
                s.st.minute = sD.getMinutes();\n
                s.st.p = s.st.hour * 60 + s.st.minute; // start time\n
                s.et = {};\n
                s.et.hour = eD.getHours();\n
                s.et.minute = eD.getMinutes();\n
                s.et.p = s.et.hour * 60 + s.et.minute; // end time\n
                fE.push(s);\n
            }\n
            var dMax = 0;\n
            for (var i = 0; i < l; i++) {\n
                var da = dayarrs[i];\n
                deA[i] = []; deB[i] = [];\n
                da.daystr = da.year + "/" + da.month + "/" + da.day;\n
                for (var j = 0; j < fE.length; j++) {\n
                    if (!fE[j].crossday && !fE[j].allday) {\n
                        if (da.daystr == fE[j].daystr)\n
                            deA[i].push(fE[j]);\n
                    }\n
                    else {\n
                        if (da.daystr == fE[j].daystr) {\n
                            deB[i].push(fE[j]);\n
                            dMax++;\n
                        }\n
                        else {\n
                            if (i == 0 && da.date >= fE[j].event[2] && da.date <= fE[j].event[3])//first more-than-one-day event\n
                            {\n
                                deB[i].push(fE[j]);\n
                                dMax++;\n
                            }\n
                        }\n
                    }\n
                }\n
            }\n
            var lrdate = dayarrs[l - 1].date;\n
            for (var i = 0; i < l; i++) { //to deal with more-than-one-day event\n
                var de = deB[i];\n
                if (de.length > 0) { //           \n
                    for (var j = 0; j < de.length; j++) {\n
                        var end = DateDiff("d", lrdate, de[j].event[3]) > 0 ? lrdate : de[j].event[3];\n
                        de[j].colSpan = DateDiff("d", dayarrs[i].date, end) + 1\n
                    }\n
                }\n
                de = null;\n
            }\n
            //for all-day events\n
            for (var i = 0; i < l; i++) {\n
                var de = deA[i];\n
                if (de.length > 0) { \n
                    var x = []; \n
                    var y = []; \n
                    var D = [];\n
                    var dl = de.length;\n
                    var Ia;\n
                    for (var j = 0; j < dl; ++j) {\n
                        var ge = de[j];\n
                        for (var La = ge.st.p, Ia = 0; y[Ia] > La; ) Ia++;\n
                        ge.PO = Ia; ge.ne = []; //PO is how many events before this one\n
                        y[Ia] = ge.et.p || 1440;\n
                        x[Ia] = ge;\n
                        if (!D[Ia]) {\n
                            D[Ia] = [];\n
                        }\n
                        D[Ia].push(ge);\n
                        if (Ia != 0) {\n
                            ge.pe = [x[Ia - 1]]; //previous event\n
                            x[Ia - 1].ne.push(ge); //next event\n
                        }\n
                        for (Ia = Ia + 1; y[Ia] <= La; ) Ia++;\n
                        if (x[Ia]) {\n
                            var k = x[Ia];\n
                            ge.ne.push(k);\n
                            k.pe.push(ge);\n
                        }\n
                        ge.width = 1 / (ge.PO + 1);\n
                        ge.left = 1 - ge.width;\n
                    }\n
                    var k = Array.prototype.concat.apply([], D);\n
                    x = y = D = null;\n
                    var t = k.length;\n
                    for (var y = t; y--; ) {\n
                        var H = 1;\n
                        var La = 0;\n
                        var x = k[y];\n
                        for (var D = x.ne.length; D--; ) {\n
                            var Ia = x.ne[D];\n
                            La = Math.max(La, Ia.VL);\n
                            H = Math.min(H, Ia.left)\n
                        }\n
                        x.VL = La + 1;\n
                        x.width = H / (x.PO + 1);\n
                        x.left = H - x.width;\n
                    }\n
                    for (var y = 0; y < t; y++) {\n
                        var x = k[y];\n
                        x.left = 0;\n
                        if (x.pe) for (var D = x.pe.length; D--; ) {\n
                            var H = x.pe[D];\n
                            x.left = Math.max(x.left, H.left + H.width);\n
                        }\n
                        var p = (1 - x.left) / x.VL;\n
                        x.width = Math.max(x.width, p);\n
                        x.aQ = Math.min(1 - x.left, x.width + 0.7 * p); //width offset\n
                    }\n
                    de = null;\n
                    deA[i] = k;\n
                }\n
            }\n
            return dMax;\n
        }\n
\n
        function BuildWT(ht, dayarrs, events, dMax) {\n
            //1:\n
            ht.push("<tr>", "<th width=\\"60\\" rowspan=\\"3\\">&nbsp;</th>");\n
            for (var i = 0; i < dayarrs.length; i++) {\n
                var ev, title, cl;\n
                if (dayarrs.length == 1) {\n
                    ev = "";\n
                    title = "";\n
                    cl = "";\n
                }\n
                else {\n
                    ev = ""; // "onclick=\\"javascript:FunProxy(\'week2day\',event,this);\\"";\n
                    title = i18n.xgcalendar.to_date_view;\n
                    cl = "wk-daylink";\n
                }\n
                ht.push("<th abbr=\'", dateFormat.call(dayarrs[i].date, i18n.xgcalendar.dateformat.fulldayvalue), "\' class=\'gcweekname\' scope=\\"col\\"><div title=\'", title, "\' ", ev, " class=\'wk-dayname\'><span class=\'", cl, "\'>", dayarrs[i].display, "</span></div></th>");\n
\n
            }\n
            ht.push("<th width=\\"16\\" rowspan=\\"3\\">&nbsp;</th>");\n
            ht.push("</tr>"); //end tr1;\n
            //2:          \n
            ht.push("<tr>");\n
            ht.push("<td class=\\"wk-allday\\"");\n
\n
            if (dayarrs.length > 1) {\n
                ht.push(" colSpan=\'", dayarrs.length, "\'");\n
            }\n
            //onclick=\\"javascript:FunProxy(\'rowhandler\',event,this);\\"\n
            ht.push("><div id=\\"weekViewAllDaywk\\" ><table class=\\"st-grid\\" cellpadding=\\"0\\" cellspacing=\\"0\\"><tbody>");\n
\n
            if (dMax == 0) {\n
                ht.push("<tr>");\n
                for (var i = 0; i < dayarrs.length; i++) {\n
                    ht.push("<td class=\\"st-c st-s\\"", " ch=\'qkadd\' abbr=\'", dateFormat.call(dayarrs[i].date, "yyyy-M-d"), "\' axis=\'00:00\'>&nbsp;</td>");\n
                }\n
                ht.push("</tr>");\n
            }\n
            else {\n
                var l = events.length;\n
                var el = 0;\n
                var x = [];\n
                for (var j = 0; j < l; j++) {\n
                    x.push(0);\n
                }\n
                //var c = tc();\n
                for (var j = 0; el < dMax; j++) {\n
                    ht.push("<tr>");\n
                    for (var h = 0; h < l; ) {\n
                        var e = events[h][x[h]];\n
                        ht.push("<td class=\'st-c");\n
                        if (e) { //if exists\n
                            x[h] = x[h] + 1;\n
                            ht.push("\'");\n
                            var t = BuildMonthDayEvent(e, dayarrs[h].date, l - h);\n
                            if (e.colSpan > 1) {\n
                                ht.push(" colSpan=\'", e.colSpan, "\'");\n
                                h += e.colSpan;\n
                            }\n
                            else {\n
                                h++;\n
                            }\n
                            ht.push(" ch=\'show\'>", t);\n
                            t = null;\n
                            el++;\n
                        }\n
                        else {\n
                            ht.push(" st-s\' ch=\'qkadd\' abbr=\'", dateFormat.call(dayarrs[h].date, i18n.xgcalendar.dateformat.fulldayvalue), "\' axis=\'00:00\'>&nbsp;");\n
                            h++;\n
                        }\n
                        ht.push("</td>");\n
                    }\n
                    ht.push("</tr>");\n
                }\n
                ht.push("<tr>");\n
                for (var h = 0; h < l; h++) {\n
                    ht.push("<td class=\'st-c st-s\' ch=\'qkadd\' abbr=\'", dateFormat.call(dayarrs[h].date, i18n.xgcalendar.dateformat.fulldayvalue), "\' axis=\'00:00\'>&nbsp;</td>");\n
                }\n
                ht.push("</tr>");\n
            }\n
            ht.push("</tbody></table></div></td></tr>"); // stgrid end //wvAd end //td2 end //tr2 end\n
            //3:\n
            ht.push("<tr>");\n
\n
            ht.push("<td style=\\"height: 5px;\\"");\n
            if (dayarrs.length > 1) {\n
                ht.push(" colSpan=\'", dayarrs.length, "\'");\n
            }\n
            ht.push("></td>");\n
            ht.push("</tr>");\n
        }\n
\n
        function BuildDayScollEventContainer(ht, dayarrs, events) {\n
            //1:\n
            ht.push("<tr>");\n
            ht.push("<td style=\'width:60px;\'></td>");\n
            ht.push("<td");\n
            if (dayarrs.length > 1) {\n
                ht.push(" colSpan=\'", dayarrs.length, "\'");\n
            }\n
            ht.push("><div id=\\"tgspanningwrapper\\" class=\\"tg-spanningwrapper\\"><div style=\\"font-size: 20px\\" class=\\"tg-hourmarkers\\">");\n
            for (var i = 0; i < 24; i++) {\n
                ht.push("<div class=\\"tg-dualmarker\\"></div>");\n
            }\n
            ht.push("</div></div></td></tr>");\n
\n
            //2:\n
            ht.push("<tr>");\n
            ht.push("<td style=\\"width: 60px\\" class=\\"tg-times\\">");\n
\n
            //get current time \n
            var now = new Date(); var h = now.getHours(); var m = now.getMinutes();\n
            var mHg = gP(h, m) - 4; //make middle alignment vertically\n
            ht.push("<div id=\\"tgnowptr\\" class=\\"tg-nowptr\\" style=\\"left:0px;top:", mHg, "px\\"></div>");\n
            var tmt = "";\n
            for (var i = 0; i < 24; i++) {\n
                tmt = fomartTimeShow(i);\n
                ht.push("<div style=\\"height: 41px\\" class=\\"tg-time\\">", tmt, "</div>");\n
            }\n
            ht.push("</td>");\n
\n
            var l = dayarrs.length;\n
            for (var i = 0; i < l; i++) {\n
                ht.push("<td class=\\"tg-col\\" ch=\'qkadd\' abbr=\'", dateFormat.call(dayarrs[i].date, i18n.xgcalendar.dateformat.fulldayvalue), "\'>");\n
                var istoday = dateFormat.call(dayarrs[i].date, "yyyyMMdd") == dateFormat.call(new Date(), "yyyyMMdd");\n
                // Today\n
                if (istoday) {\n
                    ht.push("<div style=\\"margin-bottom: -1008px; height:1008px\\" class=\\"tg-today\\">&nbsp;</div>");\n
                }\n
                //var eventC = $(eventWrap);\n
                //onclick=\\"javascript:FunProxy(\'rowhandler\',event,this);\\"\n
                ht.push("<div  style=\\"margin-bottom: -1008px; height: 1008px\\" id=\'tgCol", i, "\' class=\\"tg-col-eventwrapper\\">");\n
                BuildEvents(ht, events[i], dayarrs[i]);\n
                ht.push("</div>");\n
\n
                ht.push("<div class=\\"tg-col-overlaywrapper\\" id=\'tgOver", i, "\'>");\n
                if (istoday) {\n
                    var mhh = mHg + 4;\n
                    ht.push("<div id=\\"tgnowmarker\\" class=\\"tg-hourmarker tg-nowmarker\\" style=\\"left:0px;top:", mhh, "px\\"></div>");\n
                }\n
                ht.push("</div>");\n
                ht.push("</td>");\n
            }\n
            ht.push("</tr>");\n
        }\n
        //show events to calendar\n
        function BuildEvents(hv, events, sday) {\n
            for (var i = 0; i < events.length; i++) {\n
                var c;\n
                if (events[i].event[7] && events[i].event[7] >= 0) {\n
                    c = tc(events[i].event[7]); //theme\n
                }\n
                else {\n
                    c = tc(); //default theme\n
                }\n
                var tt = BuildDayEvent(c, events[i], i);\n
                hv.push(tt);\n
            }\n
        }\n
        function getTitle(event) {      \n
            var timeshow, locationshow, attendsshow, eventshow;\n
            var showtime = event[4] != 1;\n
            eventshow = event[1];\n
            var startformat = getymformat(event[2], null, showtime, true);\n
            var endformat = getymformat(event[3], event[2], showtime, true);\n
            timeshow = dateFormat.call(event[2], startformat) + " - " + dateFormat.call(event[3], endformat);\n
            locationshow = (event[9] != undefined && event[9] != "") ? event[9] : i18n.xgcalendar.i_undefined;\n
            attendsshow = (event[10] != undefined && event[10] != "") ? event[10] : "";\n
            var ret = [];\n
            if (event[4] == 1) {\n
                ret.push("[" + i18n.xgcalendar.allday_event + "]",$.browser.mozilla?"":"\\r\\n" );\n
            }\n
            else {\n
                if (event[5] == 1) {\n
                    ret.push("[" + i18n.xgcalendar.repeat_event + "]",$.browser.mozilla?"":"\\r\\n");\n
                }\n
            }\n
            ret.push(i18n.xgcalendar.time + ":", timeshow, $.browser.mozilla?"":"\\r\\n", i18n.xgcalendar.event + ":", eventshow,$.browser.mozilla?"":"\\r\\n", i18n.xgcalendar.location + ":", locationshow);\n
            if (attendsshow != "") {\n
                ret.push($.browser.mozilla?"":"\\r\\n", i18n.xgcalendar.participant + ":", attendsshow);\n
            }\n
            return ret.join("");\n
        }\n
        function BuildDayEvent(theme, e, index) {\n
            var p = { bdcolor: theme[0], bgcolor2: theme[0], bgcolor1: theme[2], width: "70%", icon: "", title: "", data: "" };\n
            p.starttime = pZero(e.st.hour) + ":" + pZero(e.st.minute);\n
            p.endtime = pZero(e.et.hour) + ":" + pZero(e.et.minute);\n
            p.content = e.event[1];\n
            p.title = getTitle(e.event);\n
            p.data = e.event.join("$");\n
            var icons = [];\n
            icons.push("<I class=\\"cic cic-tmr\\">&nbsp;</I>");\n
            if (e.reevent) {\n
                icons.push("<I class=\\"cic cic-spcl\\">&nbsp;</I>");\n
            }\n
            p.icon = icons.join("");\n
            var sP = gP(e.st.hour, e.st.minute);\n
            var eP = gP(e.et.hour, e.et.minute);\n
            p.top = sP + "px";\n
            p.left = (e.left * 100) + "%";\n
            p.width = (e.aQ * 100) + "%";\n
            p.height = (eP - sP - 4);\n
            p.i = index;\n
            if (option.enableDrag && e.event[8] == 1) {\n
                p.drag = "drag";\n
                p.redisplay = "block";\n
            }\n
            else {\n
                p.drag = "";\n
                p.redisplay = "none";\n
            }\n
            var newtemp = Tp(__SCOLLEVENTTEMP, p);\n
            p = null;\n
            return newtemp;\n
        }\n
\n
        //get body height in month view\n
        function GetMonthViewBodyHeight() {\n
            return option.height;\n
        }\n
        function GetMonthViewHeaderHeight() {\n
            return 21;\n
        }\n
        function BuilderMonthBody(htb, showday, startday, events, bodyHeight) {\n
\n
            var firstdate = new Date(showday.getFullYear(), showday.getMonth(), 1);\n
            var diffday = startday - firstdate.getDay();\n
            var showmonth = showday.getMonth();\n
            if (diffday > 0) {\n
                diffday -= 7;\n
            }\n
            var startdate = DateAdd("d", diffday, firstdate);\n
            var enddate = DateAdd("d", 34, startdate);\n
            var rc = 5;\n
\n
            if (enddate.getFullYear() == showday.getFullYear() && enddate.getMonth() == showday.getMonth() && enddate.getDate() < __MonthDays[showmonth]) {\n
                enddate = DateAdd("d", 7, enddate);\n
                rc = 6;\n
            }\n
            option.vstart = startdate;\n
            option.vend = enddate;\n
            option.datestrshow = CalDateShow(startdate, enddate);\n
            bodyHeight = bodyHeight - 18 * rc;\n
            var rowheight = bodyHeight / rc;\n
            var roweventcount = parseInt(rowheight / 21);\n
            if (rowheight % 21 > 15) {\n
                roweventcount++;\n
            }\n
            var p = 100 / rc;\n
            var formatevents = [];\n
            var hastdata = formartEventsInHashtable(events, startday, 7, startdate, enddate);\n
            var B = [];\n
            var C = [];\n
            for (var j = 0; j < rc; j++) {\n
                var k = 0;\n
                formatevents[j] = b = [];\n
                for (var i = 0; i < 7; i++) {\n
                    var newkeyDate = DateAdd("d", j * 7 + i, startdate);\n
                    C[j * 7 + i] = newkeyDate;\n
                    var newkey = dateFormat.call(newkeyDate, i18n.xgcalendar.dateformat.fulldaykey);\n
                    b[i] = hastdata[newkey];\n
                    if (b[i] && b[i].length > 0) {\n
                        k += b[i].length;\n
                    }\n
                }\n
                B[j] = k;\n
            }\n
            //var c = tc();\n
            eventDiv.data("mvdata", formatevents);\n
            for (var j = 0; j < rc; j++) {\n
                //onclick=\\"javascript:FunProxy(\'rowhandler\',event,this);\\"\n
                htb.push("<div id=\'mvrow_", j, "\' style=\\"HEIGHT:", p, "%; TOP:", p * j, "%\\"  class=\\"month-row\\">");\n
                htb.push("<table class=\\"st-bg-table\\" cellSpacing=\\"0\\" cellPadding=\\"0\\"><tbody><tr>");\n
                var dMax = B[j];\n
\n
                for (var i = 0; i < 7; i++) {\n
                    var day = C[j * 7 + i];\n
                    htb.push("<td abbr=\'", dateFormat.call(day, i18n.xgcalendar.dateformat.fulldayvalue), "\' ch=\'qkadd\' axis=\'00:00\' title=\'\'");\n
\n
                    if (dateFormat.call(day, "yyyyMMdd") == dateFormat.call(new Date(), "yyyyMMdd")) {\n
                        htb.push(" class=\\"st-bg st-bg-today\\">");\n
                    }\n
                    else {\n
                        htb.push(" class=\\"st-bg\\">");\n
                    }\n
                    htb.push("&nbsp;</td>");\n
                }\n
                //bgtable\n
                htb.push("</tr></tbody></table>");\n
\n
                //stgrid\n
                htb.push("<table class=\\"st-grid\\" cellpadding=\\"0\\" cellspacing=\\"0\\"><tbody>");\n
\n
                //title tr\n
                htb.push("<tr>");\n
                var titletemp = "<td class=\\"st-dtitle${titleClass}\\" ch=\'qkadd\' abbr=\'${abbr}\' axis=\'00:00\' title=\\"${title}\\"><span class=\'monthdayshow\'>${dayshow}</span></a></td>";\n
\n
                for (var i = 0; i < 7; i++) {\n
                    var o = { titleClass: "", dayshow: "" };\n
                    var day = C[j * 7 + i];\n
                    if (dateFormat.call(day, "yyyyMMdd") == dateFormat.call(new Date(), "yyyyMMdd")) {\n
                        o.titleClass = " st-dtitle-today";\n
                    }\n
                    if (day.getMonth() != showmonth) {\n
                        o.titleClass = " st-dtitle-nonmonth";\n
                    }\n
                    o.title = dateFormat.call(day, i18n.xgcalendar.dateformat.fulldayshow);\n
                    if (day.getDate() == 1) {\n
                        if (day.getMonth == 0) {\n
                            o.dayshow = dateFormat.call(day, i18n.xgcalendar.dateformat.fulldayshow);\n
                        }\n
                        else {\n
                            o.dayshow = dateFormat.call(day, i18n.xgcalendar.dateformat.Md3);\n
                        }\n
                    }\n
                    else {\n
                        o.dayshow = day.getDate();\n
                    }\n
                    o.abbr = dateFormat.call(day, i18n.xgcalendar.dateformat.fulldayvalue);\n
                    htb.push(Tp(titletemp, o));\n
                }\n
                htb.push("</tr>");\n
                var sfirstday = C[j * 7];\n
                BuildMonthRow(htb, formatevents[j], dMax, roweventcount, sfirstday);\n
                //htb=htb.concat(rowHtml); rowHtml = null;  \n
\n
                htb.push("</tbody></table>");\n
                //month-row\n
                htb.push("</div>");\n
            }\n
\n
            formatevents = B = C = hastdata = null;\n
            //return htb;\n
        }\n
        \n
        //formate datetime \n
        function formartEventsInHashtable(events, startday, daylength, rbdate, redate) {\n
            var hast = new Object();\n
            var l = events.length;\n
            for (var i = 0; i < l; i++) {\n
                var sD = events[i][2];\n
                var eD = events[i][3];\n
                var diff = DateDiff("d", sD, eD);\n
                var s = {};\n
                s.event = events[i];\n
                s.day = sD.getDate();\n
                s.year = sD.getFullYear();\n
                s.month = sD.getMonth() + 1;\n
                s.allday = events[i][4] == 1;\n
                s.crossday = events[i][5] == 1;\n
                s.reevent = events[i][6] == 1; //Recurring event\n
                s.daystr = s.year + "/" + s.month + "/" + s.day;\n
                s.st = {};\n
                s.st.hour = sD.getHours();\n
                s.st.minute = sD.getMinutes();\n
                s.st.p = s.st.hour * 60 + s.st.minute; // start time position\n
                s.et = {};\n
                s.et.hour = eD.getHours();\n
                s.et.minute = eD.getMinutes();\n
                s.et.p = s.et.hour * 60 + s.et.minute; // end time postition\n
\n
                if (diff > 0) {\n
                    if (sD < rbdate) { //start date out of range\n
                        sD = rbdate;\n
                    }\n
                    if (eD > redate) { //end date out of range\n
                        eD = redate;\n
                    }\n
                    var f = startday - sD.getDay();\n
                    if (f > 0) { f -= daylength; }\n
                    var sdtemp = DateAdd("d", f, sD);\n
                    for (; sdtemp <= eD; sD = sdtemp = DateAdd("d", daylength, sdtemp)) {\n
                        var d = Clone(s);\n
                        var key = dateFormat.call(sD, i18n.xgcalendar.dateformat.fulldaykey);\n
                        var x = DateDiff("d", sdtemp, eD);\n
                        if (hast[key] == null) {\n
                            hast[key] = [];\n
                        }\n
                        d.colSpan = (x >= daylength) ? daylength - DateDiff("d", sdtemp, sD) : DateDiff("d", sD, eD) + 1;\n
                        hast[key].push(d);\n
                        d = null;\n
                    }\n
                }\n
                else {\n
                    var key = dateFormat.call(events[i][2], i18n.xgcalendar.dateformat.fulldaykey);\n
                    if (hast[key] == null) {\n
                        hast[key] = [];\n
                    }\n
                    s.colSpan = 1;\n
                    hast[key].push(s);\n
                }\n
                s = null;\n
            }\n
            return hast;\n
        }\n
        function BuildMonthRow(htr, events, dMax, sc, day) {\n
            var x = []; \n
            var y = []; \n
            var z = []; \n
            var cday = [];  \n
            var l = events.length;\n
            var el = 0;\n
            //var c = tc();\n
            for (var j = 0; j < l; j++) {\n
                x.push(0);\n
                y.push(0);\n
                z.push(0);\n
                cday.push(DateAdd("d", j, day));\n
            }\n
            for (var j = 0; j < l; j++) {\n
                var ec = events[j] ? events[j].length : 0;\n
                y[j] += ec;\n
                for (var k = 0; k < ec; k++) {\n
                    var e = events[j][k];\n
                    if (e && e.colSpan > 1) {\n
                        for (var m = 1; m < e.colSpan; m++) {\n
                            y[j + m]++;\n
                        }\n
                    }\n
                }\n
            }\n
            //var htr=[];\n
            var tdtemp = "<td class=\'${cssclass}\' axis=\'${axis}\' ch=\'${ch}\' abbr=\'${abbr}\' title=\'${title}\' ${otherAttr}>${html}</td>";\n
            for (var j = 0; j < sc && el < dMax; j++) {\n
                htr.push("<tr>");\n
                //var gridtr = $(__TRTEMP);\n
                for (var h = 0; h < l; ) {\n
                    var e = events[h] ? events[h][x[h]] : undefined;\n
                    var tempdata = { "class": "", axis: "", ch: "", title: "", abbr: "", html: "", otherAttr: "", click: "javascript:void(0);" };\n
                    var tempCss = ["st-c"];\n
\n
                    if (e) { \n
                        x[h] = x[h] + 1;\n
                        //last event of the day\n
                        var bs = false;\n
                        if (z[h] + 1 == y[h] && e.colSpan == 1) {\n
                            bs = true;\n
                        }\n
                        if (!bs && j == (sc - 1) && z[h] < y[h]) {\n
                            el++;\n
                            $.extend(tempdata, { "axis": h, ch: "more", "abbr": dateFormat.call(cday[h], i18n.xgcalendar.dateformat.fulldayvalue), html: i18n.xgcalendar.others + (y[h] - z[h]) + i18n.xgcalendar.item, click: "javascript:alert(\'more event\');" });\n
                            tempCss.push("st-more st-moreul");\n
                            h++;\n
                        }\n
                        else {\n
                            tempdata.html = BuildMonthDayEvent(e, cday[h], l - h);\n
                            tempdata.ch = "show";\n
                            if (e.colSpan > 1) {\n
                                tempdata.otherAttr = " colSpan=\'" + e.colSpan + "\'";\n
                                for (var m = 0; m < e.colSpan; m++) {\n
                                    z[h + m] = z[h + m] + 1;\n
                                }\n
                                h += e.colSpan;\n
\n
                            }\n
                            else {\n
                                z[h] = z[h] + 1;\n
                                h++;\n
                            }\n
                            el++;\n
                        }\n
                    }\n
                    else {\n
                        if (j == (sc - 1) && z[h] < y[h] && y[h] > 0) {\n
                            $.extend(tempdata, { "axis": h, ch: "more", "abbr": dateFormat.call(cday[h], i18n.xgcalendar.dateformat.fulldayvalue), html: i18n.xgcalendar.others + (y[h] - z[h]) + i18n.xgcalendar.item, click: "javascript:alert(\'more event\');" });\n
                            tempCss.push("st-more st-moreul");\n
                            h++;\n
                        }\n
                        else {\n
                            $.extend(tempdata, { html: "&nbsp;", ch: "qkadd", "axis": "00:00", "abbr": dateFormat.call(cday[h], i18n.xgcalendar.dateformat.fulldayvalue), title: "" });\n
                            tempCss.push("st-s");\n
                            h++;\n
                        }\n
                    }\n
                    tempdata.cssclass = tempCss.join(" ");\n
                    tempCss = null;\n
                    htr.push(Tp(tdtemp, tempdata));\n
                    tempdata = null;\n
                }\n
                htr.push("</tr>");\n
            }\n
            x = y = z = cday = null;\n
            //return htr;\n
        }\n
        function BuildMonthDayEvent(e, cday, length) {\n
            var theme;\n
            if (e.event[7] && e.event[7] >= 0) {\n
                theme = tc(e.event[7]);\n
            }\n
            else {\n
                theme = tc();\n
            }\n
            var p = { color: theme[2], title: "", extendClass: "", extendHTML: "", data: "" };\n
\n
            p.title = getTitle(e.event);\n
            p.id = "bbit_cal_event_" + e.event[0];\n
            if (option.enableDrag && e.event[8] == 1) {\n
                p.eclass = "drag";\n
            }\n
            else {\n
                p.eclass = "cal_" + e.event[0];\n
            }\n
            p.data = e.event.join("$");\n
            var sp = "<span style=\\"cursor: pointer\\">${content}</span>";\n
            var i = "<I class=\\"cic cic-tmr\\">&nbsp;</I>";\n
            var i2 = "<I class=\\"cic cic-rcr\\">&nbsp;</I>";\n
            var ml = "<div class=\\"st-ad-ml\\"></div>";\n
            var mr = "<div class=\\"st-ad-mr\\"></div>";\n
            var arrm = [];\n
            var sf = e.event[2] < cday;\n
            var ef = DateDiff("d", cday, e.event[3]) >= length;  //e.event[3] >= DateAdd("d", 1, cday);\n
            if (sf || ef) {\n
                if (sf) {\n
                    arrm.push(ml);\n
                    p.extendClass = "st-ad-mpad ";\n
                }\n
                if (ef)\n
                { arrm.push(mr); }\n
                p.extendHTML = arrm.join("");\n
\n
            }\n
            var cen;\n
            if (!e.allday && !sf) {\n
                cen = pZero(e.st.hour) + ":" + pZero(e.st.minute) + " " + e.event[1];\n
            }\n
            else {\n
                cen = e.event[1];\n
            }\n
            var content = [];\n
            content.push(Tp(sp, { content: cen }));\n
            content.push(i);\n
            if (e.reevent)\n
            { content.push(i2); }\n
            p.content = content.join("");\n
            return Tp(__ALLDAYEVENTTEMP, p);\n
        }\n
        //to populate the data \n
        function populate() {\n
            if (option.isloading){\n
                return true;\n
            }\n
            if (option.url && option.url != "") {\n
                option.isloading = true;\n
                //clearcontainer();\n
                if (option.onBeforeRequestData && $.isFunction(option.onBeforeRequestData)) {\n
                  option.onBeforeRequestData(1);\n
                }\n
                var zone = new Date().getTimezoneOffset() / 60 * -1;\n
                var param = [\n
                  {name: "showdate", value: dateFormat.call(option.showday, i18n.xgcalendar.dateformat.fulldayvalue)},\n
                  {name: "viewtype", value: option.view},\n
                  {name: "timezone", value: zone}\n
];\n
                if (option.extParam) {\n
                  for (var pi = 0; pi < option.extParam.length; pi++) {\n
                    param[param.length] = option.extParam[pi];\n
                  }\n
                }\n
                $.ajax({\n
                    type: option.method,//\n
                    url: option.url,\n
                    data: param,   \n
                    //dataType: "text",  // fixed jquery 1.4 not support Ms Date Json Format /Date(@Tickets)/\n
                    dataType: "json",\n
                    dataFilter: function(data, type) { \n
                      return data;\n
                    },\n
                    success: function(data) {\n
                      if (data != null && data.error != null) {\n
                        if (option.onRequestDataError) {\n
                          option.onRequestDataError(1, data);\n
                        }\n
                      }\n
                      else {\n
                        data["start"] = parseDate(data["start"]);\n
                        data["end"] = parseDate(data["end"]);\n
                        $.each(data.events, function(index, value) { \n
                          value[2] = parseDate(value[2]);\n
                          value[3] = parseDate(value[3]); \n
                        });\n
                        responseData(data, data.start, data.end);\n
                        pushER(data.start, data.end);\n
                      }\n
                      if (option.onAfterRequestData && $.isFunction(option.onAfterRequestData)) {\n
                        option.onAfterRequestData(1);\n
                      }\n
                      option.isloading = false;\n
                    },\n
                    error: function(data) { \n
            try {             \n
                            if (option.onRequestDataError) {\n
                                option.onRequestDataError(1, data);\n
                            } else {\n
                                alert(i18n.xgcalendar.get_data_exception);\n
                            }\n
                            if (option.onAfterRequestData && $.isFunction(option.onAfterRequestData)) {\n
                                option.onAfterRequestData(1);\n
                            }\n
                            option.isloading = false;\n
                        } catch (e) { }\n
                    }\n
                });\n
            }\n
            else {\n
                alert("url" + i18n.xgcalendar.i_undefined);\n
            }\n
        }\n
        function responseData(data, start, end) {\n
            var events;\n
            if (data.issort == false) {\n
                if (data.events && data.events.length > 0) {\n
                    events = data.sort(function(l, r) { return l[2] > r[2] ? -1 : 1; });\n
                }\n
                else {\n
                    events = [];\n
                }\n
            }\n
            else {\n
                events = data.events;\n
            }\n
            ConcatEvents(events, start, end);\n
            render();\n
        }\n
        function clearrepeat(events, start, end) {\n
            var jl = events.length;\n
            if (jl > 0) {\n
                var es = events[0][2];\n
                var el = events[jl - 1][2];\n
                for (var i = 0, l = option.eventItems.length; i < l; i++) {\n
\n
                    if (option.eventItems[i][2] > el || jl == 0) {\n
                        break;\n
                    }\n
                    if (option.eventItems[i][2] >= es) {\n
                        for (var j = 0; j < jl; j++) {\n
                            if (option.eventItems[i][0] == events[j][0] && option.eventItems[i][2] < start) {\n
                                events.splice(j, 1); //for duplicated event\n
                                jl--;\n
                                break;\n
                            }\n
                        }\n
                    }\n
                }\n
            }\n
        }\n
        function ConcatEvents(events, start, end) {\n
            if (!events) {\n
                events = [];\n
            }\n
            if (events) {\n
                if (option.eventItems.length == 0) {\n
                    option.eventItems = events;\n
                }\n
                else {\n
                    //remove duplicated one\n
                    clearrepeat(events, start, end);\n
                    var l = events.length;\n
                    var sl = option.eventItems.length;\n
                    var sI = -1;\n
                    var eI = sl;\n
                    var s = start;\n
                    var e = end;\n
                    if (option.eventItems[0][2] > e)\n
                    {\n
                        option.eventItems = events.concat(option.eventItems);\n
                        return;\n
                    }\n
                    if (option.eventItems[sl - 1][2] < s) \n
                    {\n
                        option.eventItems = option.eventItems.concat(events);\n
                        return;\n
                    }\n
                    for (var i = 0; i < sl; i++) {\n
                        if (option.eventItems[i][2] >= s && sI < 0) {\n
                            sI = i;\n
                            continue;\n
                        }\n
                        if (option.eventItems[i][2] > e) {\n
                            eI = i;\n
                            break;\n
                        }\n
                    }\n
\n
                    var e1 = sI <= 0 ? [] : option.eventItems.slice(0, sI);\n
                    var e2 = eI == sl ? [] : option.eventItems.slice(eI);\n
                    option.eventItems = [].concat(e1, events, e2);\n
                    events = e1 = e2 = null;\n
                }\n
            }\n
        }\n
        //utils goes here\n
        function weekormonthtoday(e) {\n
            var th = $(this);\n
            var daystr = th.attr("abbr");\n
            option.showday = strtodate(daystr + " 00:00");\n
            option.view = "day";\n
            render();\n
            if (option.onweekormonthtoday) {\n
                option.onweekormonthtoday(option);\n
            }\n
            return false;\n
        }\n
        function parseDate(str){\n
            return new Date(Date.parse(str));\n
        }\n
        function gP(h, m) {\n
            return h * 42 + parseInt(m / 60 * 42);\n
        }\n
        function gW(ts1, ts2) {\n
            var t1 = ts1 / 42;\n
            var t2 = parseInt(t1);\n
            var t3 = t1 - t2 >= 0.5 ? 30 : 0;\n
            var t4 = ts2 / 42;\n
            var t5 = parseInt(t4);\n
            var t6 = t4 - t5 >= 0.5 ? 30 : 0;\n
            return { sh: t2, sm: t3, eh: t5, em: t6, h: ts2 - ts1 };\n
        }\n
        function gH(y1, y2, pt) {\n
            var sy1 = Math.min(y1, y2);\n
            var sy2 = Math.max(y1, y2);\n
            var t1 = (sy1 - pt) / 42;\n
            var t2 = parseInt(t1);\n
            var t3 = t1 - t2 >= 0.5 ? 30 : 0;\n
            var t4 = (sy2 - pt) / 42;\n
            var t5 = parseInt(t4);\n
            var t6 = t4 - t5 >= 0.5 ? 30 : 0;\n
            return { sh: t2, sm: t3, eh: t5, em: t6, h: sy2 - sy1 };\n
        }\n
        function pZero(n) {\n
            return n < 10 ? "0" + n : "" + n;\n
        }\n
        //to get color list array\n
        function tc(d) {\n
            function zc(c, i) {\n
                var d = "666666888888aaaaaabbbbbbdddddda32929cc3333d96666e69999f0c2c2b1365fdd4477e67399eea2bbf5c7d67a367a994499b373b3cca2cce1c7e15229a36633cc8c66d9b399e6d1c2f029527a336699668cb399b3ccc2d1e12952a33366cc668cd999b3e6c2d1f01b887a22aa9959bfb391d5ccbde6e128754e32926265ad8999c9b1c2dfd00d78131096184cb05288cb8cb8e0ba52880066aa008cbf40b3d580d1e6b388880eaaaa11bfbf4dd5d588e6e6b8ab8b00d6ae00e0c240ebd780f3e7b3be6d00ee8800f2a640f7c480fadcb3b1440edd5511e6804deeaa88f5ccb8865a5aa87070be9494d4b8b8e5d4d47057708c6d8ca992a9c6b6c6ddd3dd4e5d6c6274878997a5b1bac3d0d6db5a69867083a894a2beb8c1d4d4dae54a716c5c8d8785aaa5aec6c3cedddb6e6e41898951a7a77dc4c4a8dcdccb8d6f47b08b59c4a883d8c5ace7dcce";\n
                return "#" + d.substring(c * 30 + i * 6, c * 30 + (i + 1) * 6);\n
            }\n
            var c = d != null && d != undefined ? d : option.theme;\n
            return [zc(c, 0), zc(c, 1), zc(c, 2), zc(c, 3)];\n
        }\n
        function Tp(temp, dataarry) {\n
            return temp.replace(/\\$\\{([\\w]+)\\}/g, function(s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { return s; } else { return s1; } });\n
        }\n
        function Ta(temp, dataarry) {\n
            return temp.replace(/\\{([\\d])\\}/g, function(s1, s2) { var s = dataarry[s2]; if (typeof (s) != "undefined") { return encodeURIComponent(s); } else { return ""; } });\n
        }\n
        function fomartTimeShow(h) {\n
            return h < 10 ? "0" + h + ":00" : h + ":00";\n
        }\n
        function getymformat(date, comparedate, isshowtime, isshowweek, showcompare) {\n
            var showyear = isshowtime != undefined ? (date.getFullYear() != new Date().getFullYear()) : true;\n
            var showmonth = true;\n
            var showday = true;\n
            var showtime = isshowtime || false;\n
            var showweek = isshowweek || false;\n
            if (comparedate) {\n
                showyear = comparedate.getFullYear() != date.getFullYear();\n
                //showmonth = comparedate.getFullYear() != date.getFullYear() || date.getMonth() != comparedate.getMonth();\n
                if (comparedate.getFullYear() == date.getFullYear() &&\n
          date.getMonth() == comparedate.getMonth() &&\n
          date.getDate() == comparedate.getDate()\n
          ) {\n
                    showyear = showmonth = showday = showweek = false;\n
                }\n
            }\n
\n
            var a = [];\n
            if (showyear) {\n
                a.push(i18n.xgcalendar.dateformat.fulldayshow)\n
            } else if (showmonth) {\n
                a.push(i18n.xgcalendar.dateformat.Md3)\n
            } else if (showday) {\n
                a.push(i18n.xgcalendar.dateformat.day);\n
            }\n
            a.push(showweek ? " (W)" : "", showtime ? " HH:mm" : "");\n
            return a.join("");\n
        }\n
        function CalDateShow(startday, endday, isshowtime, isshowweek) {\n
            if (!endday) {\n
                return dateFormat.call(startday, getymformat(startday,null,isshowtime));\n
            } else {\n
                var strstart= dateFormat.call(startday, getymformat(startday, null, isshowtime, isshowweek));\n
        var strend=dateFormat.call(endday, getymformat(endday, startday, isshowtime, isshowweek));\n
        var join = (strend!=""? " - ":"");\n
        return [strstart,strend].join(join);\n
            }\n
        }\n
\n
        function dochange() {\n
            var d = getRdate();\n
            var loaded = checkInEr(d.start, d.end);\n
            if (!loaded) {\n
                populate();\n
            }\n
        }\n
\n
        function checkInEr(start, end) {\n
            var ll = option.loadDateR.length;\n
            if (ll == 0) {\n
                return false;\n
            }\n
            var r = false;\n
            var r2 = false;\n
            for (var i = 0; i < ll; i++) {\n
                r = false, r2 = false;\n
                var dr = option.loadDateR[i];\n
                if (start >= dr.startdate && start <= dr.enddate) {\n
                    r = true;\n
                }\n
                if (dateFormat.call(start, "yyyyMMdd") == dateFormat.call(dr.startdate, "yyyyMMdd") || dateFormat.call(start, "yyyyMMdd") == dateFormat.call(dr.enddate, "yyyyMMdd")) {\n
                    r = true;\n
                }\n
                if (!end)\n
                { r2 = true; }\n
                else {\n
                    if (end >= dr.startdate && end <= dr.enddate) {\n
                        r2 = true;\n
                    }\n
                    if (dateFormat.call(end, "yyyyMMdd") == dateFormat.call(dr.startdate, "yyyyMMdd") || dateFormat.call(end, "yyyyMMdd") == dateFormat.call(dr.enddate, "yyyyMMdd")) {\n
                        r2 = true;\n
                    }\n
                }\n
                if (r && r2) {\n
                    break;\n
                }\n
            }\n
            return r && r2;\n
        }\n
\n
        function buildtempdayevent(sh, sm, eh, em, h, title, w, resize, thindex) {\n
            var theme = thindex != undefined && thindex >= 0 ? tc(thindex) : tc();\n
            var newtemp = Tp(__SCOLLEVENTTEMP, {\n
                bdcolor: theme[0],\n
                bgcolor2: theme[0],\n
                bgcolor1: theme[2],\n
                data: "",\n
                starttime: [pZero(sh), pZero(sm)].join(":"),\n
                endtime: [pZero(eh), pZero(em)].join(":"),\n
                content: title ? title : i18n.xgcalendar.new_event,\n
                title: title ? title : i18n.xgcalendar.new_event,\n
                icon: "<I class=\\"cic cic-tmr\\">&nbsp;</I>",\n
                top: "0px",\n
                left: "",\n
                width: w ? w : "100%",\n
                height: h - 4,\n
                i: "-1",\n
                drag: "drag-chip",\n
                redisplay: resize ? "block" : "none"\n
            });\n
            return newtemp;\n
        }\n
\n
        function getdata(chip) {\n
            var hddata = chip.find("div.dhdV");\n
            if (hddata.length == 1) {\n
                var str = hddata.text();\n
                return parseED(str.split("$"));\n
            }\n
            return null;\n
        }\n
        function parseED(data) {\n
            if (data.length > 6) {\n
                var e = [];\n
                e.push(data[0],\n
                       data[1],\n
                       new Date(data[2]), \n
                       new Date(data[3]),\n
                       parseInt(data[4]),\n
                       parseInt(data[5]),\n
                       parseInt(data[6]),\n
                       data[7] != undefined ? parseInt(data[7]) : -1,\n
                       data[8] != undefined ? parseInt(data[8]) : 0,\n
                       data[9],\n
                       data[10],\n
                       data[11] != undefined ? data[11]: null);\n
                return e;\n
            }\n
            return null;\n
\n
        }\n
        function quickd(type) {\n
            $("#bbit-cs-buddle").css("visibility", "hidden");\n
            var calid = $("#bbit-cs-id").val();\n
            var title = $("#bbit-cs-what").text();\n
            var param = [{"name": "calendarId", value: calid },\n
                        {"name": "type", value: type},\n
                        {"name": "title", value: title}];\n
            var de = rebyKey(calid, true);\n
            option.onBeforeRequestData && option.onBeforeRequestData(3);\n
            $.post(option.quickDeleteUrl, param, function(data) {\n
                if (data) {\n
                    if (data.IsSuccess) {\n
                        de = null;\n
                        option.onAfterRequestData && option.onAfterRequestData(3);\n
                    }\n
                    else {\n
                        option.onRequestDataError && option.onRequestDataError(3, data);\n
                        Ind(de);\n
                        render();\n
                        option.onAfterRequestData && option.onAfterRequestData(3);\n
                    }\n
                }\n
            }, "json");\n
            render();\n
        }\n
        function getbuddlepos(x, y) {\n
            var tleft = x - 110; \n
            var ttop = y - 217; \n
            var maxLeft = document.documentElement.clientWidth;\n
            var maxTop = document.documentElement.clientHeight;\n
            var ishide = false;\n
            if (tleft <= 0 || ttop <= 0 || tleft + 400 > maxLeft) {\n
                tleft = x - 200 <= 0 ? 10 : x - 200;\n
                ttop = y - 159 <= 0 ? 10 : y - 159;\n
                if (tleft + 400 >= maxLeft) {\n
                    tleft = maxLeft - 410;\n
                }\n
                if (ttop + 164 >= maxTop) {\n
                    ttop = maxTop - 165;\n
                }\n
                ishide = true;\n
            }\n
            return { left: tleft, top: ttop, hide: ishide };\n
        }\n
        function dayshow(e, data) {\n
            if (data == undefined) {\n
                data = getdata($(this));\n
            }\n
            if (data != null) {\n
                if (option.quickDeleteUrl != "" && data[8] == 1 && option.readonly != true) {\n
                    var csbuddle = \'<div id="bbit-cs-buddle" style="z-index: 180; width: 400px;visibility:hidden;" class="bubble"><table class="bubble-table" cellSpacing="0" cellPadding="0"><tbody><tr><td class="bubble-cell-side"><div id="tl1" class="bubble-corner"><div class="bubble-sprite bubble-tl"></div></div><td class="bubble-cell-main"><div class="bubble-top"></div><td class="bubble-cell-side"><div id="tr1" class="bubble-corner"><div class="bubble-sprite bubble-tr"></div></div>  <tr><td class="bubble-mid" colSpan="3"><div style="overflow: hidden" id="bubbleContent1"><div><div></div><div class="cb-root"><table class="cb-table" cellSpacing="0" cellPadding="0"><tbody><tr><td class="cb-value"><div class="textbox-fill-wrapper"><div class="textbox-fill-mid"><div id="bbit-cs-what" title="\'\n
                      + i18n.xgcalendar.click_to_detail + \'" class="textbox-fill-div lk" style="cursor:pointer;"></div></div></div></td></tr><tr><td class=cb-value><div id="bbit-cs-buddle-timeshow"></div></td></tr></tbody></table><div class="bbit-cs-split"><input id="bbit-cs-id" type="hidden" value=""/>[ <span id="bbit-cs-delete" class="lk">\'\n
                      + i18n.xgcalendar.i_delete + \'</span> ]&nbsp; <SPAN id="bbit-cs-editLink" class="lk">\'\n
                      + i18n.xgcalendar.update_detail + \' <StrONG>&gt;&gt;</StrONG></SPAN></div></div></div></div><tr><td><div id="bl1" class="bubble-corner"><div class="bubble-sprite bubble-bl"></div></div><td><div class="bubble-bottom"></div><td><div id="br1" class="bubble-corner"><div class="bubble-sprite bubble-br"></div></div></tr></tbody></table><div id="bubbleClose2" class="bubble-closebutton"></div><div id="prong1" class="prong"><div class=bubble-sprite></div></div></div>\';\n
                    var bud = $("#bbit-cs-buddle");\n
                    if (bud.length == 0) {\n
                        bud = $(csbuddle).appendTo(document.body);\n
                        var calbutton = $("#bbit-cs-delete");\n
                        var lbtn = $("#bbit-cs-editLink");\n
                        var closebtn = $("#bubbleClose2").click(function() {\n
                            $("#bbit-cs-buddle").css("visibility", "hidden");\n
                        });\n
                        calbutton.click(function() {\n
                            var data = $("#bbit-cs-buddle").data("cdata");\n
                            if (option.DeleteCmdhandler && $.isFunction(option.DeleteCmdhandler)) {\n
                                option.DeleteCmdhandler.call(this, data, quickd);\n
                            }\n
                            else {\n
                                if (confirm(i18n.xgcalendar.confirm_delete_event + "?")) {\n
                                    var s = 0; //0 single event , 1 for Recurring event\n
                                    if (data[6] == 1) {\n
                                        if (confirm(i18n.xgcalendar.confrim_delete_event_or_all)) {\n
                                            s = 0;\n
                                        }\n
                                        else {\n
                                            s = 1;\n
                                        }\n
                                    }\n
                                    else {\n
                                        s = 0;\n
                                    }\n
                                    quickd(s);\n
                                }\n
                            }\n
                        });\n
                        $("#bbit-cs-what").click(function(e) {\n
                            if (!option.ViewCmdhandler) {\n
                                alert("ViewCmdhandler" + i18n.xgcalendar.i_undefined);\n
                            }\n
                            else {\n
                                if (option.ViewCmdhandler && $.isFunction(option.ViewCmdhandler)) {\n
                                    option.ViewCmdhandler.call(this, $("#bbit-cs-buddle").data("cdata"));\n
                                }\n
                            }\n
                            $("#bbit-cs-buddle").css("visibility", "hidden");\n
                            return false;\n
                        });\n
                        lbtn.click(function(e) {\n
                            if (!option.EditCmdhandler) {\n
                                alert("EditCmdhandler" + i18n.xgcalendar.i_undefined);\n
                            }\n
                            else {\n
                                if (option.EditCmdhandler && $.isFunction(option.EditCmdhandler)) {\n
                                    option.EditCmdhandler.call(this, $("#bbit-cs-buddle").data("cdata"));\n
                                }\n
                            }\n
                            $("#bbit-cs-buddle").css("visibility", "hidden");\n
                            return false;\n
                        });\n
                        bud.click(function() { return false });\n
                    }\n
                    var pos = getbuddlepos(e.pageX, e.pageY);\n
                    if (pos.hide) {\n
                        $("#prong1").hide()\n
                    }\n
                    else {\n
                        $("#prong1").show()\n
                    }\n
                    var ss = [];\n
                    var iscos = DateDiff("d", data[2], data[3]) != 0;\n
                    ss.push(dateFormat.call(data[2], i18n.xgcalendar.dateformat.Md3), " (", __WDAY[data[2].getDay()], ")");\n
                    if (data[4] != 1) {\n
                        ss.push(",", dateFormat.call(data[2], "HH:mm"));\n
                    }\n
\n
                    if (iscos) {\n
                        ss.push(" - ", dateFormat.call(data[3], i18n.xgcalendar.dateformat.Md3), " (", __WDAY[data[3].getDay()], ")");\n
                        if (data[4] != 1) {\n
                            ss.push(",", dateFormat.call(data[3], "HH:mm"));\n
                        }\n
                    }\n
                    var ts = $("#bbit-cs-buddle-timeshow").html(ss.join(""));\n
                    $("#bbit-cs-what").html(data[1]);\n
                    $("#bbit-cs-id").val(data[0]);\n
                    bud.data("cdata", data);\n
                    bud.css({ "visibility": "visible", left: pos.left, top: pos.top });\n
\n
                    $(document).one("click", function() {\n
                        $("#bbit-cs-buddle").css("visibility", "hidden");\n
                    });\n
                }\n
                else {\n
                    if (!option.ViewCmdhandler) {\n
                        alert("ViewCmdhandler" + i18n.xgcalendar.i_undefined);\n
                    }\n
                    else {\n
                        if (option.ViewCmdhandler && $.isFunction(option.ViewCmdhandler)) {\n
                            option.ViewCmdhandler.call(this, data);\n
                        }\n
                    }\n
                }\n
            }\n
            else {\n
                alert(i18n.xgcalendar.data_format_error);\n
            }\n
            return false;\n
        }\n
\n
        function moreshow(mv) {\n
            var me = $(this);\n
            var divIndex = mv.id.split(\'_\')[1];\n
            var pdiv = $(mv);\n
            var offsetMe = me.position();\n
            var offsetP = pdiv.position();\n
            var width = (me.width() + 2) * 1.5;\n
            var top = offsetP.top + 15;\n
            var left = offsetMe.left;\n
\n
            var daystr = this.abbr;\n
            var arrdays = daystr.split(\'/\');\n
            var day = new Date(arrdays[0], parseInt(arrdays[1] - 1), arrdays[2]);\n
            var cc = $("#cal-month-cc");\n
            var ccontent = $("#cal-month-cc-content table tbody");\n
            var ctitle = $("#cal-month-cc-title");\n
            ctitle.html(dateFormat.call(day, i18n.xgcalendar.dateformat.Md3) + " " + __WDAY[day.getDay()]);\n
            ccontent.empty();\n
            //var c = tc()[2];\n
            var edata = $("#gridEvent").data("mvdata");\n
            var events = edata[divIndex];\n
            var index = parseInt(this.axis);\n
            var htm = [];\n
            for (var i = 0; i <= index; i++) {\n
                var ec = events[i] ? events[i].length : 0;\n
                for (var j = 0; j < ec; j++) {\n
                    var e = events[i][j];\n
                    if (e) {\n
                        if ((e.colSpan + i - 1) >= index) {\n
                            htm.push("<tr><td class=\'st-c\'>");\n
                            htm.push(BuildMonthDayEvent(e, day, 1));\n
                            htm.push("</td></tr>");\n
                        }\n
                    }\n
                }\n
            }\n
            ccontent.html(htm.join(""));\n
            //click\n
            ccontent.find("div.rb-o").each(function(i) {\n
                $(this).click(dayshow);\n
            });\n
\n
            edata = events = null;\n
            var height = cc.height();\n
            var maxleft = document.documentElement.clientWidth;\n
            var maxtop = document.documentElement.clientHeight;\n
            if (left + width >= maxleft) {\n
                left = offsetMe.left - (me.width() + 2) * 0.5;\n
            }\n
            if (top + height >= maxtop) {\n
                top = maxtop - height - 2;\n
            }\n
            var newOff = { left: left, top: top, "z-index": 180, width: width, "visibility": "visible" };\n
            cc.css(newOff);\n
            $(document).one("click", closeCc);\n
            return false;\n
        }\n
        function dayupdate(data, start, end) {\n
            if (option.quickUpdateUrl != "" && data[8] == 1 && option.readonly != true) {\n
                if (option.isloading) {\n
                    return false;\n
                }\n
                option.isloading = true;\n
                var id = data[0];\n
                var title = data[1];\n
                var os = data[2];\n
                var od = data[3];\n
                var zone = new Date().getTimezoneOffset() / 60 * -1;\n
                var param = [{ "name": "calendarId", value: id },\n
                             { "name": "CalendarStartTime", value: dateFormat.call(start, i18n.xgcalendar.dateformat.fulldayvalue + " HH:mm") },\n
                             { "name": "CalendarEndTime", value: dateFormat.call(end, i18n.xgcalendar.dateformat.fulldayvalue + " HH:mm") },\n
                             { "name": "timezone", value: zone },\n
                             { "name": "title", value: title },\n
                             { "name": "event_id", value: data[9]},\n
];\n
                var d;\n
                if (option.quickUpdateHandler && $.isFunction(option.quickUpdateHandler)) {\n
                    option.quickUpdateHandler.call(this, param);\n
                }\n
                else {\n
                    option.onBeforeRequestData && option.onBeforeRequestData(4);\n
                    $.post(option.quickUpdateUrl, param, function(data) {\n
                        if (data) {\n
                            if (data.IsSuccess == true) {\n
                                option.isloading = false;\n
                                option.onAfterRequestData && option.onAfterRequestData(4);\n
                            }\n
                            else {\n
                                option.onRequestDataError && option.onRequestDataError(4, data);\n
                                option.isloading = false;                 \n
                                d = rebyKey(id, true);\n
                                d[2] = os;\n
                                d[3] = od;\n
                                Ind(d);\n
                                render();\n
                                d = null;\n
                                option.onAfterRequestData && option.onAfterRequestData(4);\n
                            }\n
                        }\n
                    }, "json");         \n
                    d = rebyKey(id, true);\n
                    if (d) {\n
                        d[2] = start;\n
                        d[3] = end;\n
                    }\n
                    Ind(d);\n
                    render();\n
                }\n
            }\n
        }\n
        function quickadd(start, end, isallday, pos) {\n
            if ((!option.quickAddHandler && option.quickAddUrl == "") || option.readonly) {\n
                return;\n
            }\n
            var buddle = $("#bbit-cal-buddle");\n
            if (buddle.length == 0) {\n
                var temparr = [];\n
                temparr.push(\'<div id="bbit-cal-buddle" style="z-index: 180; width: 400px;visibility:hidden;" class="bubble">\');\n
                temparr.push(\'<table class="bubble-table" cellSpacing="0" cellPadding="0"><tbody><tr><td class="bubble-cell-side"><div id="tl1" class="bubble-corner"><div class="bubble-sprite bubble-tl"></div></div>\');\n
                temparr.push(\'<td class="bubble-cell-main"><div class="bubble-top"></div><td class="bubble-cell-side"><div id="tr1" class="bubble-corner"><div class="bubble-sprite bubble-tr"></div></div>  <tr><td class="bubble-mid" colSpan="3"><div style="overflow: hidden" id="bubbleContent1"><div><div></div><div class="cb-root">\');\n
                temparr.push(\'<table class="cb-table" cellSpacing="0" cellPadding="0"><tbody><tr><th class="cb-key">\');\n
                temparr.push(i18n.xgcalendar.time, \':</th><td class=cb-value><div id="bbit-cal-buddle-timeshow"></div></td></tr><tr><th class="cb-key">\');\n
                temparr.push(i18n.xgcalendar.content, \':</th><td class="cb-value"><div class="textbox-fill-wrapper"><div class="textbox-fill-mid"><input id="bbit-cal-what" class="textbox-fill-input"/></div></div><div class="cb-example">\');\n
                temparr.push(i18n.xgcalendar.example, \'</div></td></tr>\');\n
                if (option.loadFieldOnDialog && $.isFunction(option.loadFieldOnDialog)){\n
                  temparr.push("<tr>", option.loadFieldOnDialog(), "</tr>");\n
                }\n
                temparr.push(\'</tbody></table><input id="bbit-cal-start" type="hidden"/><input id="bbit-cal-end" type="hidden"/><input id="bbit-cal-allday" type="hidden"/><input id="bbit-cal-quickAddBTN" value="\');\n
                temparr.push(i18n.xgcalendar.create_event, \'" type="button"/>&nbsp; <SPAN id="bbit-cal-editLink" class="lk">\');\n
                temparr.push(i18n.xgcalendar.update_detail, \' <StrONG>&gt;&gt;</StrONG></SPAN></div></div></div><tr><td><div id="bl1" class="bubble-corner"><div class="bubble-sprite bubble-bl"></div></div><td><div class="bubble-bottom"></div><td><div id="br1" class="bubble-corner"><div class="bubble-sprite bubble-br"></div></div></tr></tbody></table><div id="bubbleClose1" class="bubble-closebutton"></div><div id="prong2" class="prong"><div class=bubble-sprite></div></div></div>\');\n
                var tempquickAddHanler = temparr.join("");\n
                temparr = null;\n
                $(document.body).append(tempquickAddHanler);\n
                buddle = $("#bbit-cal-buddle");\n
                var calbutton = $("#bbit-cal-quickAddBTN");\n
                var lbtn = $("#bbit-cal-editLink");\n
                var closebtn = $("#bubbleClose1").click(function() {\n
                    $("#bbit-cal-buddle").css("visibility", "hidden");\n
                    realsedragevent();\n
                });\n
                calbutton.click(function(e) {\n
                    if (option.isloading) {\n
                        return false;\n
                    }\n
                    option.isloading = true;\n
                    var what = $("#bbit-cal-what").val();\n
                    var datestart = $("#bbit-cal-start").val();\n
                    var dateend = $("#bbit-cal-end").val();\n
                    var allday = $("#bbit-cal-allday").val();\n
                    var f = /^[^\\$\\<\\>]+$/.test(what);\n
                    if (!f) {\n
                        alert(i18n.xgcalendar.invalid_title);\n
                        $("#bbit-cal-what").focus();\n
                        option.isloading = false;\n
                        return false;\n
                    }\n
                    var zone = new Date().getTimezoneOffset() / 60 * -1;\n
                    var portalType = $("select[name=\'portal_type\']").val();\n
                    var param = [{ "name": "CalendarTitle", value: what },\n
                                 { "name": "CalendarStartTime", value: datestart },\n
                                 { "name": "CalendarEndTime", value: dateend },\n
                                 { "name": "IsAllDayEvent", value: allday },\n
                                 { "name": "timezone", value: zone},\n
                                 { "name": "portal_type", value: portalType}];\n
\n
                    if (option.extParam) {\n
                        for (var pi = 0; pi < option.extParam.length; pi++) {\n
                            param[param.length] = option.extParam[pi];\n
                        }\n
                    }\n
\n
                    if (option.quickAddHandler && $.isFunction(option.quickAddHandler)) {\n
                        option.quickAddHandler.call(this, param);\n
                        $("#bbit-cal-buddle").css("visibility", "hidden");\n
                        realsedragevent();\n
                    }\n
                    else {\n
                        $("#bbit-cal-buddle").css("visibility", "hidden");\n
                        var newdata = [];\n
                        var tId = -1;\n
                        option.onBeforeRequestData && option.onBeforeRequestData(2);                       \n
                        $.post(option.quickAddUrl, param, function(data) {\n
                          if (data) {\n
                            if (data.IsSuccess == true) {\n
                              option.isloading = false;\n
                              option.eventItems[tId][0] = data.Data;\n
                              option.eventItems[tId][8] = 1;\n
                              render();\n
                              option.onAfterRequestData && option.onAfterRequestData(2);\n
                            }\n
                            else {\n
                              option.onRequestDataError && option.onRequestDataError(2, data);\n
                              option.isloading = false;\n
                              option.onAfterRequestData && option.onAfterRequestData(2);\n
                            }\n
                          }\n
                        }, "json");\n
\n
                        newdata.push(-1, what);\n
                        var sd = strtodate(datestart);\n
                        var ed = strtodate(dateend);\n
                        var diff = DateDiff("d", sd, ed);\n
                        newdata.push(sd, ed, allday == "1" ? 1 : 0, diff > 0 ? 1 : 0, 0);\n
                        newdata.push(-1, 0, "", ""); \n
                        tId = Ind(newdata);\n
                        realsedragevent();\n
                        render();\n
                    }\n
                });\n
                lbtn.click(function(e) {\n
                    if (!option.EditCmdhandler) {\n
                        alert("EditCmdhandler" + i18n.xgcalendar.i_undefined);\n
                    }\n
                    else {\n
                        if (option.EditCmdhandler && $.isFunction(option.EditCmdhandler)) {\n
                            option.EditCmdhandler.call(this, [\'0\', $("#bbit-cal-what").val(), $("#bbit-cal-start").val(), $("#bbit-cal-end").val(), $("#bbit-cal-allday").val()]);\n
                        }\n
                        $("#bbit-cal-buddle").css("visibility", "hidden");\n
                        realsedragevent();\n
                    }\n
                    return false;\n
                });\n
                buddle.mousedown(function(e) { return false });\n
            }\n
      \n
            var dateshow = CalDateShow(start, end, !isallday, true);      \n
            var off = getbuddlepos(pos.left, pos.top);\n
            if (off.hide) {\n
                $("#prong2").hide()\n
            }\n
            else {\n
                $("#prong2").show()\n
            }\n
            $("#bbit-cal-buddle-timeshow").html(dateshow);\n
            var calwhat = $("#bbit-cal-what").val("");\n
            $("#bbit-cal-allday").val(isallday ? "1" : "0");\n
            $("#bbit-cal-start").val(dateFormat.call(start, i18n.xgcalendar.dateformat.fulldayvalue + " HH:mm"));\n
            $("#bbit-cal-end").val(dateFormat.call(end, i18n.xgcalendar.dateformat.fulldayvalue + " HH:mm"));\n
            buddle.css({ "visibility": "visible", left: off.left, top: off.top });      \n
      calwhat.blur().focus(); //add 2010-01-26 blur() fixed chrome \n
            $(document).one("mousedown", function() {\n
                $("#bbit-cal-buddle").css("visibility", "hidden");\n
                realsedragevent();\n
            });\n
            return false;\n
        }\n
        //format datestring to Date Type\n
        function strtodate(str) {\n
\n
            var arr = str.split(" ");\n
            var arr2 = arr[0].split(i18n.xgcalendar.dateformat.separator);\n
            var arr3 = arr[1].split(":");\n
\n
            var y = arr2[i18n.xgcalendar.dateformat.year_index];\n
            var m = arr2[i18n.xgcalendar.dateformat.month_index].indexOf("0") == 0 ? arr2[i18n.xgcalendar.dateformat.month_index].substr(1, 1) : arr2[i18n.xgcalendar.dateformat.month_index];\n
            var d = arr2[i18n.xgcalendar.dateformat.day_index].indexOf("0") == 0 ? arr2[i18n.xgcalendar.dateformat.day_index].substr(1, 1) : arr2[i18n.xgcalendar.dateformat.day_index];\n
            var h = arr3[0].indexOf("0") == 0 ? arr3[0].substr(1, 1) : arr3[0];\n
            var n = arr3[1].indexOf("0") == 0 ? arr3[1].substr(1, 1) : arr3[1];\n
            return new Date(y, parseInt(m) - 1, d, h, n);\n
        }\n
\n
        function rebyKey(key, remove) {\n
            if (option.eventItems && option.eventItems.length > 0) {\n
                var sl = option.eventItems.length;\n
                var i = -1;\n
                for (var j = 0; j < sl; j++) {\n
                    if (option.eventItems[j][0] == key) {\n
                        i = j;\n
                        break;\n
                    }\n
                }\n
                if (i >= 0) {\n
                    var t = option.eventItems[i];\n
                    if (remove) {\n
                        option.eventItems.splice(i, 1);\n
                    }\n
                    return t;\n
                }\n
            }\n
            return null;\n
        }\n
        function Ind(event, i) {\n
            var d = 0;\n
            if (!i) {\n
                if (option.eventItems && option.eventItems.length > 0) {\n
                    var sl = option.eventItems.length;\n
                    var s = event[2];\n
                    var d1 = s.getTime() - option.eventItems[0][2].getTime();\n
                    var d2 = option.eventItems[sl - 1][2].getTime() - s.getTime();\n
                    var diff = d1 - d2;\n
                    if (d1 < 0 || diff < 0) {\n
                        for (var j = 0; j < sl; j++) {\n
                            if (option.eventItems[j][2] >= s) {\n
                                i = j;\n
                                break;\n
                            }\n
                        }\n
                    }\n
                    else if (d2 < 0) {\n
                        i = sl;\n
                    }\n
                    else {\n
                        for (var j = sl - 1; j >= 0; j--) {\n
                            if (option.eventItems[j][2] < s) {\n
                                i = j + 1;\n
                                break;\n
                            }\n
                        }\n
                    }\n
                }\n
                else {\n
                    i = 0;\n
                }\n
            }\n
            else {\n
                d = 1;\n
            }\n
            if (option.eventItems && option.eventItems.length > 0) {\n
                if (i == option.eventItems.length) {\n
                    option.eventItems.push(event);\n
                }\n
                else { option.eventItems.splice(i, d, event); }\n
            }\n
            else {\n
                option.eventItems = [event];\n
            }\n
            return i;\n
        }\n
        \n
        \n
        function ResizeView() {\n
            var _MH = document.documentElement.clientHeight;\n
            var _viewType = option.view;\n
            if (_viewType == "day" || _viewType == "week") {\n
                var $dvwkcontaienr = $("#dvwkcontaienr");\n
                var $dvtec = $("#dvtec");\n
                if ($dvwkcontaienr.length == 0 || $dvtec.length == 0) {\n
                    alert(i18n.xgcalendar.view_no_ready); return;\n
                }\n
                var dvwkH = $dvwkcontaienr.height() + 2;\n
                var calH = option.height - 8 - dvwkH;\n
                $dvtec.height(calH);\n
                if (typeof (option.scoll) == "undefined") {\n
                    var currentday = new Date();\n
                    var h = currentday.getHours();\n
                    var m = currentday.getMinutes();\n
                    var th = gP(h, m);\n
                    var ch = $dvtec.attr("clientHeight");\n
                    var sh = th - 0.5 * ch;\n
                    var ph = $dvtec.attr("scrollHeight");\n
                    if (sh < 0) sh = 0;\n
                    if (sh > ph - ch) sh = ph - ch - 10 * (23 - h);\n
                    $dvtec.attr("scrollTop", sh);\n
                }\n
                else {\n
                    $dvtec.attr("scrollTop", option.scoll);\n
                }\n
            }\n
            else if (_viewType == "month") {\n
                //Resize GridContainer\n
            }\n
        }\n
        function returnfalse() {\n
            return false;\n
        }\n
        function initevents(viewtype) {\n
            if (viewtype == "week" || viewtype == "day") {\n
                $("div.chip", gridcontainer).each(function(i) {\n
                    var chip = $(this);\n
                    chip.click(dayshow);\n
                    if (chip.hasClass("drag")) {\n
                        chip.mousedown(function(e) { dragStart.call(this, "dw3", e); return false; });\n
                        //resize                      \n
                        chip.find("div.resizer").mousedown(function(e) {\n
                            dragStart.call($(this).parent().parent(), "dw4", e); return false;\n
                        });\n
                    }\n
                    else {\n
                        chip.mousedown(returnfalse)\n
                    }\n
                });\n
                $("div.rb-o", gridcontainer).each(function(i) {\n
                    var chip = $(this);\n
                    chip.click(dayshow);\n
                    if (chip.hasClass("drag") && viewtype == "week") {\n
                        //drag;\n
                        chip.mousedown(function(e) { dragStart.call(this, "dw5", e); return false; });\n
                    }\n
                    else {\n
                        chip.mousedown(returnfalse)\n
                    }\n
                });\n
                if (option.readonly == false) {\n
                    $("td.tg-col", gridcontainer).each(function(i) {\n
                        $(this).mousedown(function(e) { dragStart.call(this, "dw1", e); return false; });\n
                    });\n
                    $("#weekViewAllDaywk").mousedown(function(e) { dragStart.call(this, "dw2", e); return false; });\n
                }\n
\n
                if (viewtype == "week") {\n
                    $("#dvwkcontaienr th.gcweekname").each(function(i) {\n
                        $(this).click(weekormonthtoday);\n
                    });\n
                }\n
\n
\n
            }\n
            else if (viewtype = "month") {\n
                $("div.rb-o", gridcontainer).each(function(i) {\n
                    var chip = $(this);\n
                    chip.click(dayshow);\n
                    if (chip.hasClass("drag")) {\n
                        //drag;\n
                        chip.mousedown(function(e) { dragStart.call(this, "m2", e); return false; });\n
                    }\n
                    else {\n
                        chip.mousedown(returnfalse)\n
                    }\n
                });\n
                $("td.st-more", gridcontainer).each(function(i) {\n
\n
                    $(this).click(function(e) {\n
                        moreshow.call(this, $(this).parent().parent().parent().parent()[0]); return false;\n
                    }).mousedown(function() { return false; });\n
                });\n
                if (option.readonly == false) {\n
                    $("#mvEventContainer").mousedown(function(e) { dragStart.call(this, "m1", e); return false; });\n
                }\n
            }\n
\n
        }\n
        function realsedragevent() {\n
            if (_dragevent) {\n
                _dragevent();\n
                _dragevent = null;\n
            }\n
        }\n
        function dragStart(type, e) {\n
            var obj = $(this);\n
            var source = e.srcElement || e.target;\n
            realsedragevent();\n
            switch (type) {\n
                case "dw1": \n
                    _dragdata = { type: 1, target: obj, sx: e.pageX, sy: e.pageY };\n
                    break;\n
                case "dw2": \n
                    var w = obj.width();\n
                    var h = obj.height();\n
                    var offset = obj.offset();\n
                    var left = offset.left;\n
                    var top = offset.top;\n
                    var l = option.view == "day" ? 1 : 7;\n
                    var py = w % l;\n
                    var pw = parseInt(w / l);\n
                    if (py > l / 2 + 1) {\n
                        pw++;\n
                    }\n
                    var xa = [];\n
                    var ya = [];\n
                    for (var i = 0; i < l; i++) {\n
                        xa.push({ s: i * pw + left, e: (i + 1) * pw + left });\n
                    }\n
                    ya.push({ s: top, e: top + h });\n
                    _dragdata = { type: 2, target: obj, sx: e.pageX, sy: e.pageY, pw: pw, xa: xa, ya: ya, h: h };\n
                    w = left = l = py = pw = xa = null;\n
                    break;\n
                case "dw3": \n
                    var evid = obj.parent().attr("id").replace("tgCol", "");\n
                    var p = obj.parent();\n
                    var pos = p.offset();\n
                    var w = p.width() + 10;\n
                    var h = obj.height();\n
                    var data = getdata(obj);\n
                    _dragdata = { type: 4, target: obj, sx: e.pageX, sy: e.pageY,\n
                        pXMin: pos.left, pXMax: pos.left + w, pw: w, h: h,\n
                        cdi: parseInt(evid), fdi: parseInt(evid), data: data\n
                    };\n
                    break;\n
                case "dw4": //resize;\n
                    var h = obj.height();\n
                    var data = getdata(obj);\n
                    _dragdata = { type: 5, target: obj, sx: e.pageX, sy: e.pageY, h: h, data: data };\n
                    break;\n
                case "dw5":\n
                    var con = $("#weekViewAllDaywk");\n
                    var w = con.width();\n
                    var h = con.height();\n
                    var offset = con.offset();\n
                    var moffset = obj.offset();\n
                    var left = offset.left;\n
                    var top = offset.top;\n
                    var l = 7;\n
                    var py = w % l;\n
                    var pw = parseInt(w / l);\n
                    if (py > l / 2 + 1) {\n
                        pw++;\n
                    }\n
                    var xa = [];\n
                    var ya = [];\n
                    var di = 0;\n
                    for (var i = 0; i < l; i++) {\n
                        xa.push({ s: i * pw + left, e: (i + 1) * pw + left });\n
                        if (moffset.left >= xa[i].s && moffset.left < xa[i].e) {\n
                            di = i;\n
                        }\n
                    }\n
                    var fdi = { x: di, y: 0, di: di };\n
                    ya.push({ s: top, e: top + h });\n
                    var data = getdata(obj);\n
                    var dp = DateDiff("d", data[2], data[3]) + 1;\n
                    _dragdata = { type: 6, target: obj, sx: e.pageX, sy: e.pageY, data: data, xa: xa, ya: ya, fdi: fdi, h: h, dp: dp, pw: pw };\n
                    break;\n
                case "m1": \n
                    var w = obj.width();\n
                    var offset = obj.offset();\n
                    var left = offset.left;\n
                    var top = offset.top;\n
                    var l = 7;\n
                    var yl = obj.children().length;\n
                    var py = w % l;\n
                    var pw = parseInt(w / l);\n
                    if (py > l / 2 + 1) {\n
                        pw++;\n
                    }\n
                    var h = $("#mvrow_0").height();\n
                    var xa = [];\n
                    var ya = [];\n
                    for (var i = 0; i < l; i++) {\n
                        xa.push({ s: i * pw + left, e: (i + 1) * pw + left });\n
                    }\n
                    var xa = [];\n
                    var ya = [];\n
                    for (var i = 0; i < l; i++) {\n
                        xa.push({ s: i * pw + left, e: (i + 1) * pw + left });\n
                    }\n
                    for (var i = 0; i < yl; i++) {\n
                        ya.push({ s: i * h + top, e: (i + 1) * h + top });\n
                    }\n
                    _dragdata = { type: 3, target: obj, sx: e.pageX, sy: e.pageY, pw: pw, xa: xa, ya: ya, h: h };\n
                    break;\n
                case "m2": \n
                    var row0 = $("#mvrow_0");\n
                    var row1 = $("#mvrow_1");\n
                    var w = row0.width();\n
                    var offset = row0.offset();\n
                    var diffset = row1.offset();\n
                    var moffset = obj.offset();\n
                    var h = diffset.top - offset.top;\n
                    var left = offset.left;\n
                    var top = offset.top;\n
                    var l = 7;\n
                    var yl = row0.parent().children().length;\n
                    var py = w % l;\n
                    var pw = parseInt(w / l);\n
                    if (py > l / 2 + 1) {\n
                        pw++;\n
                    }\n
                    var xa = [];\n
                    var ya = [];\n
                    var xi = 0;\n
                    var yi = 0;\n
                    for (var i = 0; i < l; i++) {\n
                        xa.push({ s: i * pw + left, e: (i + 1) * pw + left });\n
                        if (moffset.left >= xa[i].s && moffset.left < xa[i].e) {\n
                            xi = i;\n
                        }\n
                    }\n
                    for (var i = 0; i < yl; i++) {\n
                        ya.push({ s: i * h + top, e: (i + 1) * h + top });\n
                        if (moffset.top >= ya[i].s && moffset.top < ya[i].e) {\n
                            yi = i;\n
                        }\n
                    }\n
                    var fdi = { x: xi, y: yi, di: yi * 7 + xi };\n
                    var data = getdata(obj);\n
                    var dp = DateDiff("d", data[2], data[3]) + 1;\n
                    _dragdata = { type: 7, target: obj, sx: e.pageX, sy: e.pageY, data: data, xa: xa, ya: ya, fdi: fdi, h: h, dp: dp, pw: pw };\n
                    break;\n
            }\n
            $(\'body\').noSelect();\n
        }\n
        function dragMove(e) {\n
            if (_dragdata) {\n
                if (e.pageX < 0 || e.pageY < 0\n
          || e.pageX > document.documentElement.clientWidth\n
          || e.pageY >= document.documentElement.clientHeight) {\n
                    dragEnd(e);\n
                    return false;\n
                }\n
                var d = _dragdata;\n
                switch (d.type) {\n
                    case 1:\n
                        var sy = d.sy;\n
                        var y = e.pageY;\n
                        var diffy = y - sy;\n
                        if (diffy > 11 || diffy < -11 || d.cpwrap) {\n
                            if (diffy == 0) { diffy = 21; }\n
                            var dy = diffy % 21;\n
                            if (dy != 0) {\n
                                diffy = dy > 0 ? diffy + 21 - dy : diffy - 21 - dy;\n
                                y = d.sy + diffy;\n
                                if (diffy < 0) {\n
                                    sy = sy + 21;\n
                                }\n
                            }\n
                            if (!d.tp) {\n
                                d.tp = $(d.target).offset().top;\n
                            }\n
                            var gh = gH(sy, y, d.tp);\n
                            var ny = gP(gh.sh, gh.sm);\n
                            var tempdata;\n
                            if (!d.cpwrap) {\n
                                tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h);\n
                                var cpwrap = $("<div class=\'ca-evpi drag-chip-wrapper\' style=\'top:" + ny + "px\'/>").html(tempdata);\n
                                $(d.target).find("div.tg-col-overlaywrapper").append(cpwrap);\n
                                d.cpwrap = cpwrap;\n
                            }\n
                            else {\n
                                if (d.cgh.sh != gh.sh || d.cgh.eh != gh.eh || d.cgh.sm != gh.sm || d.cgh.em != gh.em) {\n
                                    tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h);\n
                                    d.cpwrap.css("top", ny + "px").html(tempdata);\n
                                }\n
                            }\n
                            d.cgh = gh;\n
                        }\n
                        break;\n
                    case 2:\n
                        var sx = d.sx;\n
                        var x = e.pageX;\n
                        var diffx = x - sx;\n
                        if (diffx > 5 || diffx < -5 || d.lasso) {\n
                            if (!d.lasso) {\n
                                d.lasso = $("<div style=\'z-index: 10; display: block\' class=\'drag-lasso-container\'/>");\n
                                $(document.body).append(d.lasso);\n
                            }\n
                            if (!d.sdi) {\n
                                d.sdi = getdi(d.xa, d.ya, sx, d.sy);\n
                            }\n
                            var ndi = getdi(d.xa, d.ya, x, e.pageY);\n
                            if (!d.fdi || d.fdi.di != ndi.di) {\n
                                addlasso(d.lasso, d.sdi, ndi, d.xa, d.ya, d.h);\n
                            }\n
                            d.fdi = ndi;\n
                        }\n
                        break;\n
                    case 3:\n
                        var sx = d.sx;\n
                        var x = e.pageX;\n
                        var sy = d.sy;\n
                        var y = e.pageY;\n
                        var diffx = x - sx;\n
                        var diffy = y - sy;\n
                        if (diffx > 5 || diffx < -5 || diffy < -5 || diffy > 5 || d.lasso) {\n
                            if (!d.lasso) {\n
                                d.lasso = $("<div style=\'z-index: 10; display: block\' class=\'drag-lasso-container\'/>");\n
                                $(document.body).append(d.lasso);\n
                            }\n
                            if (!d.sdi) {\n
                                d.sdi = getdi(d.xa, d.ya, sx, sy);\n
                            }\n
                            var ndi = getdi(d.xa, d.ya, x, y);\n
                            if (!d.fdi || d.fdi.di != ndi.di) {\n
                                addlasso(d.lasso, d.sdi, ndi, d.xa, d.ya, d.h);\n
                            }\n
                            d.fdi = ndi;\n
                        }\n
                        break;\n
                    case 4:\n
                        var data = d.data;\n
                        if (data != null && data[8] == 1) {\n
                            var sx = d.sx;\n
                            var x = e.pageX;\n
                            var sy = d.sy;\n
                            var y = e.pageY;\n
                            var diffx = x - sx;\n
                            var diffy = y - sy;\n
                            if (diffx > 5 || diffx < -5 || diffy > 5 || diffy < -5 || d.cpwrap) {\n
                                var gh, ny, tempdata;\n
                                if (!d.cpwrap) {\n
                                    gh = { sh: data[2].getHours(),\n
                                        sm: data[2].getMinutes(),\n
                                        eh: data[3].getHours(),\n
                                        em: data[3].getMinutes(),\n
                                        h: d.h\n
                                    };\n
                                    d.target.hide();\n
                                    ny = gP(gh.sh, gh.sm);\n
                                    d.top = ny;\n
                                    tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h, data[1], false, false, data[7]);\n
                                    var cpwrap = $("<div class=\'ca-evpi drag-chip-wrapper\' style=\'top:" + ny + "px\'/>").html(tempdata);\n
                                    var evid = d.target.parent().attr("id").replace("tgCol", "#tgOver");\n
                                    $(evid).append(cpwrap);\n
                                    d.cpwrap = cpwrap;\n
                                    d.ny = ny;\n
                                }\n
                                else {\n
                                    var pd = 0;\n
                                    if (x < d.pXMin) {\n
                                        pd = -1;\n
                                    }\n
                                    else if (x > d.pXMax) {\n
                                        pd = 1;\n
                                    }\n
                                    if (pd != 0) {\n
\n
                                        d.cdi = d.cdi + pd;\n
                                        var ov = $("#tgOver" + d.cdi);\n
                                        if (ov.length == 1) {\n
                                            d.pXMin = d.pXMin + d.pw * pd;\n
                                            d.pXMax = d.pXMax + d.pw * pd;\n
                                            ov.append(d.cpwrap);\n
                                        }\n
                                        else {\n
                                            d.cdi = d.cdi - pd;\n
                                        }\n
                                    }\n
                                    ny = d.top + diffy;\n
                                    var pny = ny % 21;\n
                                    if (pny != 0) {\n
                                        ny = ny - pny;\n
                                    }\n
                                    if (d.ny != ny) {\n
                                        //log.info("ny=" + ny);\n
                                        gh = gW(ny, ny + d.h);\n
                                        //log.info("sh=" + gh.sh + ",sm=" + gh.sm);\n
                                        tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h, data[1], false, false, data[7]);\n
                                        d.cpwrap.css("top", ny + "px").html(tempdata);\n
                                    }\n
                                    d.ny = ny;\n
                                }\n
                            }\n
                        }\n
\n
                        break;\n
                    case 5:\n
                        var data = d.data;\n
                        if (data != null && data[8] == 1) {\n
                            var sy = d.sy;\n
                            var y = e.pageY;\n
                            var diffy = y - sy;\n
                            if (diffy != 0 || d.cpwrap) {\n
                                var gh, ny, tempdata;\n
                                if (!d.cpwrap) {\n
                                    gh = { sh: data[2].getHours(),\n
                                        sm: data[2].getMinutes(),\n
                                        eh: data[3].getHours(),\n
                                        em: data[3].getMinutes(),\n
                                        h: d.h\n
                                    };\n
                                    d.target.hide();\n
                                    ny = gP(gh.sh, gh.sm);\n
                                    d.top = ny;\n
                                    tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h, data[1], "100%", true, data[7]);\n
                                    var cpwrap = $("<div class=\'ca-evpi drag-chip-wrapper\' style=\'top:" + ny + "px\'/>").html(tempdata);\n
                                    var evid = d.target.parent().attr("id").replace("tgCol", "#tgOver");\n
                                    $(evid).append(cpwrap);\n
                                    d.cpwrap = cpwrap;\n
                                }\n
                                else {\n
                                    nh = d.h + diffy;\n
                                    var pnh = nh % 21;\n
                                    nh = pnh > 1 ? nh - pnh + 21 : nh - pnh;\n
                                    if (d.nh != nh) {\n
                                        var sp = gP(data[2].getHours(), data[2].getMinutes());\n
                                        var ep = sp + nh;\n
                                        gh = gW(d.top, d.top + nh);\n
                                        tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h, data[1], "100%", true, data[7]);\n
                                        d.cpwrap.html(tempdata);\n
                                    }\n
                                    d.nh = nh;\n
                                }\n
                            }\n
                        }\n
                        break;\n
                    case 6:\n
                        var sx = d.sx;\n
                        var x = e.pageX;\n
                        var y = e.pageY;\n
                        var diffx = x - sx;\n
                        if (diffx > 5 || diffx < -5 || d.lasso) {\n
                            if (!d.lasso) {\n
                                var w1 = d.dp > 1 ? (d.pw - 4) * 1.5 : (d.pw - 4);\n
                                var cp = d.target.clone();\n
                                if (d.dp > 1) {\n
                                    cp.find("div.rb-i>span").prepend("(" + d.dp + " " + i18n.xgcalendar.day_plural + ")&nbsp;");\n
                                }\n
                                var cpwrap = $("<div class=\'drag-event st-contents\' style=\'width:" + w1 + "px\'/>").append(cp).appendTo(document.body);\n
                                d.cpwrap = cpwrap;\n
                                d.lasso = $("<div style=\'z-index: 10; display: block\' class=\'drag-lasso-container\'/>");\n
                                $(document.body).append(d.lasso);\n
                                cp = cpwrap = null;\n
                            }\n
                            fixcppostion(d.cpwrap, e, d.xa, d.ya);\n
                            var ndi = getdi(d.xa, d.ya, x, e.pageY);\n
                            if (!d.cdi || d.cdi.di != ndi.di) {\n
                                addlasso(d.lasso, ndi, { x: ndi.x, y: ndi.y, di: ndi.di + d.dp - 1 }, d.xa, d.ya, d.h);\n
                            }\n
                            d.cdi = ndi;\n
                        }\n
                        break;\n
                    case 7:\n
                        var sx = d.sx;\n
                        var sy = d.sy;\n
                        var x = e.pageX;\n
                        var y = e.pageY;\n
                        var diffx = x - sx;\n
                        var diffy = y - sy;\n
                        if (diffx > 5 || diffx < -5 || diffy > 5 || diffy < -5 || d.lasso) {\n
                            if (!d.lasso) {\n
                                var w1 = d.dp > 1 ? (d.pw - 4) * 1.5 : (d.pw - 4);\n
                                var cp = d.target.clone();\n
                                if (d.dp > 1) {\n
                                    cp.find("div.rb-i>span").prepend("(" + d.dp + " " + i18n.xgcalendar.day_plural + ")&nbsp;");\n
                                }\n
                                var cpwrap = $("<div class=\'drag-event st-contents\' style=\'width:" + w1 + "px\'/>").append(cp).appendTo(document.body);\n
                                d.cpwrap = cpwrap;\n
                                d.lasso = $("<div style=\'z-index: 10; display: block\' class=\'drag-lasso-container\'/>");\n
                                $(document.body).append(d.lasso);\n
                                cp = cpwrap = null;\n
                            }\n
                            fixcppostion(d.cpwrap, e, d.xa, d.ya);\n
                            var ndi = getdi(d.xa, d.ya, x, e.pageY);\n
                            if (!d.cdi || d.cdi.di != ndi.di) {\n
                                addlasso(d.lasso, ndi, { x: ndi.x, y: ndi.y, di: ndi.di + d.dp - 1 }, d.xa, d.ya, d.h);\n
                            }\n
                            d.cdi = ndi;\n
                        }\n
                        break;\n
                }\n
            }\n
            return false;\n
        }\n
        function dragEnd(e) {\n
            if (_dragdata) {\n
                var d = _dragdata;\n
                switch (d.type) {\n
                    case 1: //day view\n
                        var wrapid = new Date().getTime();\n
                        tp = d.target.offset().top;\n
                        if (!d.cpwrap) {\n
                            var gh = gH(d.sy, d.sy + 42, tp);\n
                            var ny = gP(gh.sh, gh.sm);\n
                            var tempdata = buildtempdayevent(gh.sh, gh.sm, gh.eh, gh.em, gh.h);\n
                            d.cpwrap = $("<div class=\'ca-evpi drag-chip-wrapper\' style=\'top:" + ny + "px\'/>").html(tempdata);\n
                            $(d.target).find("div.tg-col-overlaywrapper").append(d.cpwrap);\n
                            d.cgh = gh;\n
                        }\n
                        var pos = d.cpwrap.offset();\n
                        pos.left = pos.left + 30;\n
                        d.cpwrap.attr("id", wrapid);\n
                        var start = strtodate(d.target.attr("abbr") + " " + d.cgh.sh + ":" + d.cgh.sm);\n
                        var end = strtodate(d.target.attr("abbr") + " " + d.cgh.eh + ":" + d.cgh.em);\n
                        _dragevent = function() { $("#" + wrapid).remove(); $("#bbit-cal-buddle").css("visibility", "hidden"); };\n
                        quickadd(start, end, false, pos);\n
                        break;\n
                    case 2: //week view\n
                    case 3: //month view          \n
                        var source = e.srcElement || e.target;                       \n
                        var lassoid = new Date().getTime();\n
                        if (!d.lasso) {\n
               if ($(source).hasClass("monthdayshow"))\n
              {\n
                weekormonthtoday.call($(source).parent()[0],e);\n
                break;\n
              }\n
                            d.fdi = d.sdi = getdi(d.xa, d.ya, d.sx, d.sy);\n
                            d.lasso = $("<div style=\'z-index: 10; display: block\' class=\'drag-lasso-container\'/>");\n
                            $(document.body).append(d.lasso);\n
                            addlasso(d.lasso, d.sdi, d.fdi, d.xa, d.ya, d.h);\n
                        }\n
                        d.lasso.attr("id", lassoid);\n
                        var si = Math.min(d.fdi.di, d.sdi.di);\n
                        var ei = Math.max(d.fdi.di, d.sdi.di);\n
                        var firstday = option.vstart;\n
                        var start = DateAdd("d", si, firstday);\n
                        var end = DateAdd("d", ei, firstday);\n
                        _dragevent = function() { $("#" + lassoid).remove(); };\n
                        quickadd(start, end, true, { left: e.pageX, top: e.pageY });\n
                        break;\n
                    case 4: // event moving\n
                        if (d.cpwrap) {\n
                            var start = DateAdd("d", d.cdi, option.vstart);\n
                            var end = DateAdd("d", d.cdi, option.vstart);\n
                            var gh = gW(d.ny, d.ny + d.h);\n
                            start.setHours(gh.sh, gh.sm);\n
                            end.setHours(gh.eh, gh.em);\n
                            if (start.getTime() == d.data[2].getTime() && end.getTime() == d.data[3].getTime()) {\n
                                d.cpwrap.remove();\n
                                d.target.show();\n
                            }\n
                            else {\n
                                dayupdate(d.data, start, end);\n
                            }\n
                        }\n
                        break;\n
                    case 5: //Resize\n
                        if (d.cpwrap) {\n
                            var start = new Date(d.data[2].toString());\n
                            var end = new Date(d.data[3].toString());\n
                            var gh = gW(d.top, d.top + nh);\n
                            start.setHours(gh.sh, gh.sm);\n
                            end.setHours(gh.eh, gh.em);\n
\n
                            if (start.getTime() == d.data[2].getTime() && end.getTime() == d.data[3].getTime()) {\n
                                d.cpwrap.remove();\n
                                d.target.show();\n
                            }\n
                            else {\n
                                dayupdate(d.data, start, end);\n
                            }\n
                        }\n
                        break;\n
                    case 6:\n
                    case 7:\n
                        if (d.lasso) {\n
                            d.cpwrap.remove();\n
                            d.lasso.remove();\n
                            var start = new Date(d.data[2].toString());\n
                            var end = new Date(d.data[3].toString());\n
                            var currrentdate = DateAdd("d", d.cdi.di, option.vstart);\n
                            var diff = DateDiff("d", start, currrentdate);\n
                            start = DateAdd("d", diff, start);\n
                            end = DateAdd("d", diff, end);\n
                            if (start.getTime() != d.data[2].getTime() || end.getTime() != d.data[3].getTime()) {\n
                                dayupdate(d.data, start, end);\n
                            }\n
                        }\n
                        break;\n
                }\n
                d = _dragdata = null;\n
                $(\'body\').noSelect(false);\n
                return false;\n
            }\n
        }\n
        function getdi(xa, ya, x, y) {\n
            var ty = 0;\n
            var tx = 0;\n
            var lx = 0;\n
            var ly = 0;\n
            if (xa && xa.length != 0) {\n
                lx = xa.length;\n
                if (x >= xa[lx - 1].e) {\n
                    tx = lx - 1;\n
                }\n
                else {\n
                    for (var i = 0; i < lx; i++) {\n
                        if (x > xa[i].s && x <= xa[i].e) {\n
                            tx = i;\n
                            break;\n
                        }\n
                    }\n
                }\n
            }\n
            if (ya && ya.length != 0) {\n
                ly = ya.length;\n
                if (y >= ya[ly - 1].e) {\n
                    ty = ly - 1;\n
                }\n
                else {\n
                    for (var j = 0; j < ly; j++) {\n
                        if (y > ya[j].s && y <= ya[j].e) {\n
                            ty = j;\n
                            break;\n
                        }\n
                    }\n
                }\n
            }\n
            return { x: tx, y: ty, di: ty * lx + tx };\n
        }\n
        function addlasso(lasso, sdi, edi, xa, ya, height) {\n
            var diff = sdi.di > edi.di ? sdi.di - edi.di : edi.di - sdi.di;\n
            diff++;\n
            var sp = sdi.di > edi.di ? edi : sdi;\n
            var ep = sdi.di > edi.di ? sdi : edi;\n
            var l = xa.length > 0 ? xa.length : 1;\n
            var h = ya.length > 0 ? ya.length : 1;\n
            var play = [];\n
            var width = xa[0].e - xa[0].s; \n
            var i = sp.x;\n
            var j = sp.y;\n
            var max = Math.min(document.documentElement.clientWidth, xa[l - 1].e) - 2;\n
\n
            while (j < h && diff > 0) {\n
                var left = xa[i].s;\n
                var d = i + diff > l ? l - i : diff;\n
                var wid = width * d;\n
                while (left + wid >= max) {\n
                    wid--;\n
                }\n
                play.push(Tp(__LASSOTEMP, { left: left, top: ya[j].s, height: height, width: wid }));\n
                i = 0;\n
                diff = diff - d;\n
                j++;\n
            }\n
            lasso.html(play.join(""));\n
        }\n
        function fixcppostion(cpwrap, e, xa, ya) {\n
            var x = e.pageX - 6;\n
            var y = e.pageY - 4;\n
            var w = cpwrap.width();\n
            var h = 21;\n
            var lmin = xa[0].s + 6;\n
            var tmin = ya[0].s + 4;\n
            var lmax = xa[xa.length - 1].e - w - 2;\n
            var tmax = ya[ya.length - 1].e - h - 2;\n
            if (x > lmax) {\n
                x = lmax;\n
            }\n
            if (x <= lmin) {\n
                x = lmin + 1;\n
            }\n
            if (y <= tmin) {\n
                y = tmin + 1;\n
            }\n
            if (y > tmax) {\n
                y = tmax;\n
            }\n
            cpwrap.css({ left: x, top: y });\n
        }\n
        $(document)\n
    .mousemove(dragMove)\n
    .mouseup(dragEnd);\n
        //.mouseout(dragEnd);\n
\n
        var c = {\n
            sv: function(view) { //switch view                \n
                if (view == option.view) {\n
                    return;\n
                }\n
                clearcontainer();\n
                option.view = view;\n
                render();\n
                dochange();\n
            },\n
            rf: function() {\n
                populate();\n
            },\n
            gt: function(d) {\n
                if (!d) {\n
                    d = new Date();\n
                }\n
                option.showday = d;\n
                render();\n
                dochange();\n
            },\n
\n
            pv: function() {\n
                switch (option.view) {\n
                    case "day":\n
                        option.showday = DateAdd("d", -1, option.showday);\n
                        break;\n
                    case "week":\n
                        option.showday = DateAdd("w", -1, option.showday);\n
                        break;\n
                    case "month":\n
                        option.showday = DateAdd("m", -1, option.showday);\n
                        break;\n
                }\n
                render();\n
                dochange();\n
            },\n
            nt: function() {        \n
                switch (option.view) {\n
                    case "day":\n
                        option.showday = DateAdd("d", 1, option.showday);\n
                        break;\n
                    case "week":\n
                        option.showday = DateAdd("w", 1, option.showday);\n
                        break;\n
                    case "month":\n
            var od = option.showday.getDate();\n
            option.showday = DateAdd("m", 1, option.showday);\n
            var nd = option.showday.getDate();\n
            if(od !=nd) //we go to the next month\n
            {\n
              option.showday= DateAdd("d", 0-nd, option.showday); //last day of last month\n
            }\n
                        break;\n
                }\n
                render();\n
                dochange();\n
            },\n
            go: function() {\n
                return option;\n
            },\n
            so: function(p) {\n
                option = $.extend(option, p);\n
            }\n
        };\n
        this[0].bcal = c;\n
        return this;\n
    };\n
    \n
    /**\n
     * @description {Method} swtichView To switch to another view.\n
     * @param {String} view View name, one of \'day\', \'week\', \'month\'. \n
     */\n
    $.fn.swtichView = function(view) {\n
        return this.each(function() {\n
            if (this.bcal) {\n
                this.bcal.sv(view);\n
            }\n
        })\n
    };\n
    \n
    /**\n
     * @description {Method} reload To reload event of current time range.\n
     */\n
    $.fn.reload = function() {\n
        return this.each(function() {\n
            if (this.bcal) {\n
                this.bcal.rf();\n
            }\n
        })\n
    };\n
    \n
    /**\n
     * @description {Method} gotoDate To go to a range containing date.\n
     * If view is week, it will go to a week containing date. \n
     * If view is month, it will got to a month containing date.          \n
     * @param {Date} date. Date to go. \n
     */\n
    $.fn.gotoDate = function(d) {\n
        return this.each(function() {\n
            if (this.bcal) {\n
                this.bcal.gt(d);\n
            }\n
        })\n
    };\n
    \n
    /**\n
     * @description {Method} previousRange To go to previous date range.\n
     * If view is week, it will go to previous week. \n
     * If view is month, it will got to previous month.          \n
     */\n
    $.fn.previousRange = function() {\n
        return this.each(function() {\n
            if (this.bcal) {\n
                this.bcal.pv();\n
            }\n
        })\n
    };\n
    \n
    /**\n
     * @description {Method} nextRange To go to next date range.\n
     * If view is week, it will go to next week. \n
     * If view is month, it will got to next month. \n
     */\n
    $.fn.nextRange = function() {\n
        return this.each(function() {\n
            if (this.bcal) {\n
                this.bcal.nt();\n
            }\n
        })\n
    };\n
    \n
    \n
    $.fn.BcalGetOp = function() {\n
        if (this[0].bcal) {\n
            return this[0].bcal.go();\n
        }\n
        return null;\n
    };\n
    \n
    \n
    $.fn.BcalSetOp = function(p) {\n
        if (this[0].bcal) {\n
            return this[0].bcal.so(p);\n
        }\n
    };\n
    \n
})(jQuery);\n


]]></string> </value>
        </item>
        <item>
            <key> <string>title</string> </key>
            <value> <string>jquery.calendar.js</string> </value>
        </item>
      </dictionary>
    </pickle>
  </record>
</ZopeData>