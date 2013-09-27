// Search View
define(['durandal/app', 'knockout', 'mods/search', 'mods/state'],
        function(app, ko, search, state) {

            var name = ko.observable();

            return {
                items: search.items,
                pagingitems: search.pagingitems,
                name: name,
                userEmail: "thfl@dr.dk",
                title: "Search Panel",
                search: search,
                activate: function(param) {

                    if (param != undefined)
                    {
                        var s = state.getParamByName('s', param);
                        search.pageindex(0);
                        search.freetext(s);
                        search.search();
                    }
                },
                // http://durandaljs.com/documentation/Hooking-Lifecycle-Callbacks/       
                compositionComplete: function() {
                    $("#SearchField").focus();
                },
                pagingclick: function(data) {

                    if (data.index == -1)
                        search.prevPageGroup();
                    else if (data.index == 9999)
                        search.nextPageGroup();
                    else
                        search.pageindex(data.index);

                    search.search();
                }


            };
        });
