// Search Module
define(['knockout', 'factory/object', 'plugins/router', 'mods/state', 'mods/format', 'mods/searchcalendar', 'factory/filter', 'mods/objectselector', 'mods/localization'],
        function(ko, objfac, router, state, format, searchcalendar, filfac, objectselector, locale) {

            // Paging
            var pagesize = ko.observable(20);
            var pageindex = ko.observable(0);
            var pagingitems = ko.observableArray([]);   // UI paging items. Should probably be moved from here.
            var pageindexshown = ko.observable(4);
            var totalcount = 0;
            var noofpages = 0;

            // Search Fields
            var freetext = ko.observable("");
            var datebegin = ko.observable(null);
            var dateend = ko.observable(null);
            // ObjectType filter items
            var objtpfilteritems = ko.observableArray([]);

            var sortitems = ko.observableArray([]);
            var sortdic = [];
            var sortvalue = ko.observable("");

            // Search Result
            var items = ko.observableArray([]);
            var isSearching = ko.observable(false);
            var resulttext = ko.observable("");

            buildObjectTypeFilter();
            buildSortItems();

            // === ObjectType functionality ===
            function buildObjectTypeFilter() {
                objtpfilteritems.removeAll();
                for (var i = 0; i < Settings.Search.objecttypefilter.length; i++) {
                    var item = Settings.Search.objecttypefilter[i];
                    var fall = createObjectTypeFilterItem(item.fid, item.title, item.value);
                    fall.isactive(i == 0);
                }
            }
            function createObjectTypeFilterItem(fid, title, key) {
                var f1 = new filfac.FilterItem();
                f1.search = navigate;
                f1.reset = resetObjectTypeFilter;
                f1.fid(fid);
                f1.title(title);
                f1.isactive(false);
                f1.key(key);
                objtpfilteritems.push(f1);
                return f1;
            }

            function resetObjectTypeFilter() {
                for (var i = 0; i < objtpfilteritems().length; i++) {
                    objtpfilteritems()[i].isactive(i == 0);
                }
            }

            function createobjecttypefilter() {
                var filter = "";
                for (var i = 1; i < objtpfilteritems().length; i++) {
                    var item = objtpfilteritems()[i];
                    if (item.isactive()) {
                        if (filter != "")
                            filter += " OR "
                        filter += "Type:" + item.key();
                    }
                }

                if (filter != "")
                    return "(" + filter + ")";

                return "";
            }

            function getobjecttypecount() {
                var flter = Settings.Search.filter;
                var datefilter = createfilterfordates();
                if (datefilter != "") {
                    if (flter != "")
                        flter += " AND ";
                    flter += datefilter;
                }
                for (var i = 0; i < objtpfilteritems().length; i++) {
                    objtpfilteritems()[i].load(freetext(), flter);
                }
            }
            // =================================

            // === Sort functionality ===
            function buildSortItems() {
                sortitems.removeAll();
                sortdic = [];
                for (var i = 0; i < Settings.Search.sortitems.length; i++) {
                    var item = Settings.Search.sortitems[i]
                    sortitems.push({title: item.title, id: item.id, value: item.value});
                    sortdic[item.id] = item.value;
                }
            }

            function createsort() {
                if (sortvalue() == "")
                    return Settings.Search.sortitems[0].value;

                return sortdic[sortvalue()];
            }

            function sortchanged() {
                navigate();
            }
            // =========================

            // === Paging functionality ===
            function updatePaging() {
                pagingitems.removeAll();

                pagingitems.push({text: "&laquo;", index: -1, isactive: false, isdisabled: (pageindex() == 0)});

                var pirange = pageindexrange(pageindex());

                for (var i = pirange[0]; i < pirange[1]; i++) {
                    pagingitems.push({text: "" + (i + 1), index: i, isactive: (i == pageindex()), isdisabled: false});
                }

                pagingitems.push({text: "&raquo;", index: 9999, isactive: false, isdisabled: (pageindex() + 1 >= noofpages)});
            }

            function nextPage() {
                pageindex(pageindex() + 1);
            }

            function prevPage() {
                pageindex(pageindex() - 1);
            }

            function pageindexrange(index) {
                var b = Math.floor(Math.max(0, index) / pageindexshown()) * pageindexshown();
                var e = b + pageindexshown();
                if (e > noofpages)
                    e = noofpages;
                return[b, e];
            }
            // ===============================================            

            // === Calendar and date functionality ===
            function createfilterfordates() {
                var filter = "";

                //filter = "Type:Radio";

                if (datebegin() != null && dateend() == null) {
                    // [1995-12-31T23:59:59.999Z TO *]
                    //Substract 1 millisecond from date before converting to string.
                    filter += "PubStartDate:[" + format.getSolrDateStr(new Date(datebegin()), -1) + " TO *]";
                } else if (datebegin() == null && dateend() != null) {
                    // [* TO 2007-03-06T00:00:00Z]
                    //Add 1 millisecond from date before converting to string.
                    filter += "PubStartDate:[* TO " + format.getSolrDateStr(new Date(dateend()), 1) + "]";
                    //filter += "PubStartDate:[1900-01-01T00:00:00.000Z TO " + format.getSolrDateStr(new Date(dateend())) + "]";
                } else if (datebegin() != null && dateend() != null) {
                    // [1995-12-31T23:59:59.999Z TO 2007-03-06T00:00:00Z]
                    //Substract and add 1 millisecond from/to dates before converting to string.
                    filter += "PubStartDate:[" + format.getSolrDateStr(new Date(datebegin()), -1) + " TO " + format.getSolrDateStr(new Date(dateend()), 1) + "]";
                }

                return filter;
            }

            function updatecalendar() {
                searchcalendar.search = this;
                var flter = Settings.Search.filter;
                var objtypefilter = createobjecttypefilter();
                if (objtypefilter != "") {
                    if (flter != "")
                        flter += " AND ";
                    flter += objtypefilter;
                }
                searchcalendar.update(freetext(), flter, datebegin(), dateend(), navigatetodaterangestr);
            }

            function navigatetodaterangestr(datestr1, datestr2) {
                datebegin(format.getDateFromQueryDateStr(datestr1));
                dateend(format.getDateFromQueryDateStr(datestr2));
                navigate();
            }
            // ==================================================

            // === Navigate and search functionality ===
            function navigate() {
               
                var s = '!search/s=' + freetext();

                if (datebegin() != null) {
                    var d = datebegin();
                    s += '&d=' + format.getQueryDateStr(d);
                }
                if (dateend() != null) {
                    var de = dateend();
                    s += '&de=' + format.getQueryDateStr(de);
                }
                var otfilter = "";
                for (var i = 1; i < objtpfilteritems().length; i++) {
                    var item = objtpfilteritems()[i];
                    if (item.isactive()) {
                        if (otfilter != "")
                            otfilter += ","
                        otfilter += item.fid();
                    }
                }
                if (otfilter != "")
                    s += '&otf=' + otfilter;

                if (sortvalue() != "") {
                    s += '&o=' + sortvalue();
                }

                router.navigate(s);
            }

            function createfilter() {
                var flter = createfilterfordates();

                var flter_ot = createobjecttypefilter();
                if (flter != "" && flter_ot != "")
                    flter += " AND ";
                flter += flter_ot;

                if (Settings.Search.filter != "") {

                    if (flter == "")
                        return Settings.Search.filter;
                    else
                        return flter + " AND " + Settings.Search.filter;
                }

                return flter;
            }

            function dosearchcore(param) {
                
                if (param != undefined) {
                    // New search. Reset page index.
                    pageindex(0);
                    objectselector.clear();

                    var s = format.getParamByName('s', param);
                    //freetext(s.toLowerCase());
                    freetext(s);

                    var d = format.getParamByName('d', param);
                    datebegin(format.getDateFromQueryDateStr(d));

                    var de = format.getParamByName('de', param);
                    dateend(format.getDateFromQueryDateStr(de));

                    var otf = "," + format.getParamByName('otf', param) + ",";
                    var otfactive = false;
                    for (var i = 1; i < objtpfilteritems().length; i++) {
                        var item = objtpfilteritems()[i];
                        item.isactive(otf.indexOf("," + item.fid() + ",") > -1);
                        if (item.isactive()) {
                            otfactive = true;
                        }
                    }
                    objtpfilteritems()[0].isactive(!otfactive);

                    var order = format.getParamByName('o', param);
                    if (order != "") {
                        sortvalue(order);
                    }
                }

                if (pageindex() < 0)
                    pageindex(0);

                items.removeAll();
                isSearching(true);

                resulttext(locale.text('searching'));
                var flter = createfilter();
                
                if(format.getParamByName('fid', param) != ""){
                    flter ="(FolderID:" + format.getParamByName('fid', param) + ")";
                }
                
                CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext(), createsort(), flter, pageindex(), pagesize()).WithCallback(searchReceived);

                $('html, body').animate({
                    scrollTop: 0
                }, 100);
            }

            function dosearch(param){
                dosearchcore(param);
                updatecalendar();
                getobjecttypecount();
            }

            function dosearchpaging(){
                dosearchcore();                
            }

            function getValInt(val) {
                if (val == null)
                    return 0;
                return val;
            }

            function getValStr(val) {
                if (val == null)
                    return "";
                return "" + val;
            }

            function searchReceived(response)
            {
                isSearching(false);
                items.removeAll();

                if (freetext() == "video") {
                    var oi = new objfac.ObjectItem();
                    oi.id("1");
                    oi.title("Arbejdsløshedshæren");
                    oi.channel("Teater");
                    oi.annotationCount(25);
                    oi.hash('#!objectvideo/id=1');
                    oi.typetext("video");
                    oi.type("Video");
                    items.push(oi);
                }

                for (var i = 0; i < response.Body.Count; i++)
                {
                    var r = response.Body.Results[i];
                    var oi = new objfac.ObjectItem();
                    oi.id(r.Id);
                    oi.isselected(objectselector.contains(oi.id()));
                    oi.title(getValStr(r.Title));
                    oi.channel(getValStr(r.Channel));
                    oi.annotationCount(getValInt(r.AnnotationCount));

                    oi.type(r.Type);

                    if (r.Type == "Radio") {
                        //r.Id = "bf99b5b4-07e7-4acf-9726-0416e21f91df"; // TEST: objekt med annotationer. 1 fil.
                        //r.Id = "598e81b1-2d86-443c-92de-a9ffb83b2193"; // TEST: En japaner i Berlin. 2 filer.
                        oi.hash('#!object/id=' + r.Id);
                        oi.typetext("radio");
                    }
                    else {

                        if (r.Type == "Schedule")
                            oi.typetext("programoversigt");
                        else
                            oi.typetext("rettelse til programoversigt");

                        oi.hash(r.Url);
                    }

                    var d = r.PubStartDate;

                    if (d.length < 4 || d.substring(0, 4) == "1900" || d.substring(0, 4) == "0101") {
                        oi.datetimepretty("ukendt dato");
                    }
                    else {
                        if (d.length >= 4 && d.substring(0, 4) != "1900")
                            oi.date("" + d + "");

                        oi.datepretty(d.substring(8, 10) + "-" + d.substring(5, 7) + "-" + d.substring(0, 4))
                        oi.datetimepretty(oi.datepretty() + " kl. " + d.substring(11, 13) + ":" + d.substring(14, 16));

                        var d1 = format.getDateFromSolrDateString(r.PubStartDate);
                        var d2 = format.getDateFromSolrDateString(r.PubEndDate);
                        if (d1 != null && d2 != null)
                            oi.duration(Math.round((d2 - d1) / 1000 / 60) + " min.");
                    }

                    items.push(oi);
                }

                totalcount = response.Body.TotalCount;
                noofpages = Math.ceil(totalcount / pagesize());

                if (totalcount == 0)
                    resulttext(locale.text('results0'));
                else if (totalcount == 1)
                    resulttext(locale.text('results1'));
                else
                    resulttext(locale.text('resultsn', { 'count': totalcount }));

                updatePaging();
            }
            // =======================================================

            return {
                items: items,
                resulttext: resulttext,
                pagingitems: pagingitems,
                pageindex: pageindex,
                pagesize: pagesize,
                pageindexshown: pageindexshown,
                freetext: freetext,
                datebegin: datebegin,
                dateend: dateend,
                nextPage: nextPage,
                prevPage: prevPage,
                isSearching: isSearching,
                navigate: navigate,
                calendaritems: searchcalendar.items,
                breadcrumbitems: searchcalendar.breadcrumbitems,
                updatecalendar: updatecalendar,
                search: dosearch,
                searchpaging: dosearchpaging,
                objtpfilteritems: objtpfilteritems,
                sortitems: sortitems,
                sortvalue: sortvalue,
                sortchanged: sortchanged,
                objectsselectcount: objectselector.count
            };
        });


