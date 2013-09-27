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

//var backcls = "";
//if(pageindex()==0)
//  backcls = "disabled";        
//pagingitems.push({text:"&laquo;", index:-1, cssclass:backcls});

                if (pageindex() >= pageindexshown())
                    pagingitems.push({text: "&laquo;", index: -1, cssclass: ""});

                var pirange = pageindexrange(pageindex());

                for (var i = pirange[0]; i < pirange[1]; i++) {
                    pagingitems.push({text: "" + (i + 1), index: i, cssclass: (i == pageindex() ? "active" : "")});
                }

                var nextpagegroup =   pageindexrange(pageindex() + pageindexshown() + 1);
                if(nextpagegroup[0] < nextpagegroup[1])
                    pagingitems.push({text: "&raquo;", index: 9999, cssclass: ""});

            }

            function nextPageGroup() {
                pageindex(pageindexrange(pageindex() + pageindexshown() + 1)[0]);
            }

            function prevPageGroup() {
                pageindex(pageindexrange(pageindex() - pageindexshown())[0]);
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
                nextPageGroup: nextPageGroup,
                prevPageGroup: prevPageGroup,
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


