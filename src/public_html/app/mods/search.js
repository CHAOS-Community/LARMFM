// Search Module
define(['knockout', 'factory/object', 'plugins/router', 'mods/state', 'mods/format', 'mods/searchcalendar'],
        function(ko, objfac, router, state, format, searchcalendar) {

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

            // Search Result
            var items = ko.observableArray([]);
            var isSearching = ko.observable(false);

            function searchReceived(response)
            {
                isSearching(false);
                items.removeAll();
                for (var i = 0; i < response.Body.Count; i++)
                {
                    var r = response.Body.Results[i];
                    var oi = new objfac.ObjectItem();
                    oi.title = "Title : " + r.Title;
                    if (r.Type == "Radio")
                        oi.hash = '#!object/id=' + r.Id;
                    else
                        oi.hash = r.Url;
                    if (r.PubStartDate.length >= 4 && r.PubStartDate.substring(0, 4) != "1900")
                        oi.date = "(" + r.PubStartDate + ")";
                    items.push(oi);
                }

                totalcount = response.Body.TotalCount;
                noofpages = Math.ceil(totalcount / pagesize());

                updatePaging();
            }

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

                router.navigate(s);
            }

            function createfilter() {
                return createfilterfordates();
            }

            function createfilterfordates() {
                var filter = "";

                //filter = "Type:Radio";

                if (datebegin() != null && dateend() == null) {
                    // [1995-12-31T23:59:59.999Z TO *]
                    //Substract 1 millisecond from date before converting to string.
                    filter += "PubStartDate:[" + format.getSolrDateStr(new Date(datebegin() - 1)) + " TO *]";
                } else if (datebegin() == null && dateend() != null) {
                    // [* TO 2007-03-06T00:00:00Z]
                    //Add 1 millisecond from date before converting to string.
                    filter += "PubStartDate:[* TO " + format.getSolrDateStr(new Date(dateend() + 1)) + "]";
                    //filter += "PubStartDate:[1900-01-01T00:00:00.000Z TO " + format.getSolrDateStr(new Date(dateend())) + "]";
                } else if (datebegin() != null && dateend() != null) {
                    // [1995-12-31T23:59:59.999Z TO 2007-03-06T00:00:00Z]
                    //Substract and add 1 millisecond from/to dates before converting to string.
                    filter += "PubStartDate:[" + format.getSolrDateStr(new Date(datebegin() - 1)) + " TO " + format.getSolrDateStr(new Date(dateend() + 1)) + "]";
                }

                return filter;
            }

            function createsort() {

                return "PubStartDate+asc";
            }

            function updatecalendar() {
                searchcalendar.update(freetext(),"",datebegin(),dateend());
            }

            return {
                items: items,
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
                updatecalendar: updatecalendar,
                search: function(param) {

                    if (param != undefined) {
                        // New search. Reset page index.
                        pageindex(0);

                        var s = format.getParamByName('s', param);
                        freetext(s.toLowerCase());

                        var d = format.getParamByName('d', param);
                        datebegin(format.getDateFromQueryDateStr(d));

                        var de = format.getParamByName('de', param);
                        dateend(format.getDateFromQueryDateStr(de));

                    }

                    if (pageindex() < 0)
                        pageindex(0);

                    items.removeAll();
                    isSearching(true);
                    CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext(), createsort(), createfilter(), pageindex(), pagesize()).WithCallback(searchReceived);
                
                    updatecalendar();
                }
            };
        });


