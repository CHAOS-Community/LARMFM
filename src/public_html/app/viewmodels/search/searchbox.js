define(['durandal/app', 'plugins/router', 'knockout', 'mods/search'],
        function(app, router, ko, searchmod) {

            var cansearch = ko.observable(true);

            return {
                cansearch: cansearch,
                searchtext: searchmod.freetext,
                search: function() {
                    //searchmod.freetext(searchtext());
                    searchmod.navigate();
                    //router.navigate('!search/s=' + searchtext() + '&date=now');
                },
                searchKeyboardCmd: function(data, event) {
                    if (event.keyCode == 13)
                        searchmod.navigate();
                    return true;
                }
            };
        });
