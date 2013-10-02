define(['durandal/app', 'plugins/router', 'knockout', 'mods/search'],
        function(app, router, ko, searchmod) {

            var searchtext = ko.observable("");
            var cansearch = ko.observable(true);

            return {
                cansearch: cansearch,
                searchtext: searchtext,
                search: function() {
                    router.navigate('!search/s=' + searchtext() + '&date=now');
                },
                daterangeclick1: function() {
                    // yyyy,mm,dd : mm = 0-11
                    searchmod.datebegin(new Date(1930, 0, 1));
                    searchmod.dateend(null);
                    searchmod.navigate();
                },
                daterangeclick2: function() {
                    // yyyy,mm,dd : mm = 0-11
                    searchmod.datebegin(null);
                    searchmod.dateend(new Date(1930, 0, 1));
                    searchmod.navigate();
                },
                daterangeclick3: function() {
                    // yyyy,mm,dd : mm = 0-11
                    searchmod.datebegin(new Date(1930, 1, 1));
                    searchmod.dateend(new Date(1930, 7, 1));
                    searchmod.navigate();
                }
            };

        });


