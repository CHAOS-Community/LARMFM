define(['durandal/app', 'knockout', 'mods/player', 'mods/timeline', 'mods/format'],
        function (app, ko, player, timeline, format) {

            var annotation = function () {
                this.data = null;
                this.title = ko.observable("");
                this.starttime = ko.observable("");
                this.endtime = ko.observable("");
                this.collapsed = ko.observable(true);
                this.player = player;
                this.timeline = timeline;
            };


            annotation.prototype = (function () {

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
                        var tla = timeline.getAnnotation(this.data.Id);
                        this.starttime(format.getTimeStringFromDate(tla[0].v));
                        this.endtime(format.getTimeStringFromDate(tla[1].v));

                    },
                    btnedit: function (data) {
                        var i = 0;
                        //parentcontext.$data.entereditmode(this);
                        //app.trigger('metadata:edit', this);
                        
                        app.trigger('metadata:changedinview', this);
                    },
                    btnexpand: function () {
                        this.collapsed(!this.collapsed());
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
