// Search Module
define(['knockout', 'factory/object'],
        function(ko, objfac) {

            // Paging
            var pagesize = ko.observable(20);
            var pageindex = ko.observable(0);
            var pagingitems = ko.observableArray([]);   // UI paging items. Should probably be moved from here.
            var pageindexshown = ko.observable(4);
            var totalcount = 0;
            var noofpages = 0;
            var freetext = ko.observable("");
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
                    items.push(oi);
                }

                totalcount = response.Body.TotalCount;
                noofpages = Math.ceil(totalcount / pagesize());

                updatePaging();
            }

            function updatePaging() {
                pagingitems.removeAll();

                pagingitems.push({text: "&laquo;", index: -1, isactive: false, isdisabled: (pageindex()==0)});

                var pirange = pageindexrange(pageindex());

                for (var i = pirange[0]; i < pirange[1]; i++) {
                    pagingitems.push({text: "" + (i + 1), index: i, isactive: (i == pageindex()), isdisabled: false});
                }

                pagingitems.push({text: "&raquo;", index: 9999, isactive: false, isdisabled: (pageindex()+1>=noofpages)});
            }

            function nextPage() {
                pageindex(pageindex()+1);
            }

            function prevPage() {
                pageindex(pageindex()-1);
            }

            function pageindexrange(index) {
                var b = Math.floor(Math.max(0, index) / pageindexshown())*pageindexshown();
                var e = b + pageindexshown();
                if (e > noofpages)
                    e = noofpages;
                return[b, e];
            }

            return {
                items: items,
                pagingitems: pagingitems,
                pageindex: pageindex,
                pagesize: pagesize,
                pageindexshown: pageindexshown,
                freetext: freetext,
                nextPage: nextPage,
                prevPage: prevPage,
                isSearching: isSearching,
                search: function() {

                    if (pageindex() < 0)
                        pageindex(0);

                    items.removeAll();
                    isSearching(true);
                    CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext(), "", "", pageindex(), pagesize()).WithCallback(searchReceived);
                }
            };
        });


