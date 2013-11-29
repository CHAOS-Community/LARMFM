define(['durandal/app', 'knockout'],
        function (app, ko) {

            var annotation = function () {
                this.data = null;
                this.title = ko.observable("");
                this.starttime = ko.observable("");
            };


            annotation.prototype = (function () {

                var private_stuff = function () {
                    // Private code here
                };

                return {

                    compositionComplete: function (child, parent, settings) {
                        // settings.bindingContext.$data represents an
                        // instance of MetadataEditor under factory.
                        this.data = settings.bindingContext.$data.data;
                        this.title(this.data.Title);
                        this.starttime(this.data.StartTime);
                    },
                    btnedit: function (data) {
                        var i = 0;
                        //parentcontext.$data.entereditmode(this);
                        app.trigger('metadata:edit', this);
                    }

                };
            })();

            //editor2.prototype.compositionComplete = function (child, parent, settings) {
            //    // settings.bindingContext.$data represents an
            //    // instance of MetadataEditor under factory.
            //    this.data = settings.bindingContext.$data.data;
            //    this.title(this.data.title);
            //};

            return annotation;

        });
