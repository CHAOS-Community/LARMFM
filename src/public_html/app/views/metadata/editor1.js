// Search View
define(['durandal/app', 'knockout'],
        function (app, ko) {

            var name = ko.observable("Thomas");

            return {
                name: name,
                compositionComplete: function (child, parent, settings) {
                    // settings.bindingContext.$data represents an
                    // instance of MetadataEditor under factory.
                    //data = settings.bindingContext.$data.data;
                    //settings.bindingContext.$data = this;
                    //if (data !== undefined)
                    //    init();
                    var i = 0;
                }
            };
        });
