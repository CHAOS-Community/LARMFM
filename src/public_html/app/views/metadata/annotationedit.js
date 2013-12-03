define(['durandal/app', 'knockout'],
        function (app, ko) {

            var annotationedit = function () {
                this.data = null;
                this.title = ko.observable("");
                this.starttime = ko.observable("");
            };


            annotationedit.prototype = (function () {

                var private_stuff = function () {
                    // Private code here
                };

                return {

                    compositionComplete: function (child, parent, settings) {
                        settings.bindingContext.$data.data["self"] = this;
                        // settings.bindingContext.$data represents an
                        // instance of MetadataEditor under factory.
                        //settings.bindingContext.$data.data
                        this.data = settings.bindingContext.$data.data;

                        this.title(this.data.Title);
                        this.starttime(this.data.StartTime);
                    },
                    btnsave: function (data) {
                        //var i = 0;
                        //parentcontext.$data.entereditmode(this);
                        //app.trigger('metadata:edit', this);
                        
                        //app.trigger('metadata:changedinview', this);
                    }

                };
            })();

            //editor2.prototype.compositionComplete = function (child, parent, settings) {
            //    // settings.bindingContext.$data represents an
            //    // instance of MetadataEditor under factory.
            //    this.data = settings.bindingContext.$data.data;
            //    this.title(this.data.title);
            //};

            return annotationedit;

        });
