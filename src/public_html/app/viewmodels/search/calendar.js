define(['durandal/app', 'plugins/router', 'knockout', 'mods/search'],
        function(app, router, ko, searchmod) {
           
            return {
                items: searchmod.calendaritems
            };

        });


