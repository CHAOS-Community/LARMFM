// Search View
define(['durandal/app', 'knockout', 'mods/search', 'mods/state'],
        function(app, ko, search, state) {

            var name = ko.observable();

            return {
                items: search.items,
                pagingitems: search.pagingitems,
                resulttext: search.resulttext,
                name: name,
                title: "Calendar",
                search: search,
                activate: function(param) {
                    if (param != undefined) {
                        search.search(param);
                    }
                    else {
                        search.search("");
                    }
                },
                // http://durandaljs.com/documentation/Hooking-Lifecycle-Callbacks/       
                compositionComplete: function() {
                    $("#SearchField").focus();
                },
                pagingclick: function(data) {

                    if (data.isdisabled || data.isactive)
                        return;

                    if (data.index == -1)
                        search.prevPage();
                    else if (data.index == 9999)
                        search.nextPage();
                    else
                        search.pageindex(data.index);

                    search.search();
                },
                objtpfilteritems: search.objtpfilteritems,
                sortitems: search.sortitems,
                sortvalue: search.sortvalue,
                sortchanged: search.sortchanged
            };
        });
