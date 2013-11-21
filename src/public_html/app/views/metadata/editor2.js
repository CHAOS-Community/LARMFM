define(['durandal/app', 'knockout'],
        function (app, ko) {

            var editor2 = function () {
                this.data = null;
                this.title = ko.observable("");
            };

            editor2.prototype.compositionComplete = function (child, parent, settings) {
                // settings.bindingContext.$data represents an
                // instance of MetadataEditor under factory.
                this.data = settings.bindingContext.$data.data;
                this.title(this.data.title);
            };

            return editor2;

        });
