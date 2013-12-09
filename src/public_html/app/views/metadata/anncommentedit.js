define(['durandal/app', 'knockout', 'mods/timeline', 'mods/xmlmanager', 'mods/format'],
        function (app, ko, timeline, xmlmanager, format) {

            var annotationedit = function () {
                this.data = null;
                this.json = null;
                this.title = ko.observable("");
                this.description = ko.observable("");
                this.starttime = ko.observable("");
                this.endtime = ko.observable("");
            };


            annotationedit.prototype = (function () {

                var private_stuff = function () {
                    // Private code here
                };

                var getField = function (field) {

                    if (typeof field === "string")
                        return field;

                    if (typeof field === "object" && field.__cdata !== "undefined")
                        return field.__cdata;

                    return "";

                };

                return {

                    compositionComplete: function (child, parent, settings) {
                        settings.bindingContext.$data.data["self"] = this;
                        // settings.bindingContext.$data represents an
                        // instance of MetadataEditor under factory.
                        //settings.bindingContext.$data.data
                        this.data = settings.bindingContext.$data.data;
                        this.json = xmlmanager.toJsonDirect([], this.data.metadata.MetadataXml);
                        //this.json = this.json["LARM.Annotation.Comment"];

                        //var xml = xmlmanager.toXmlDirect(this.json);

                        this.title(getField(this.json["LARM.Annotation.Comment"].Title));
                        this.description(getField(this.json["LARM.Annotation.Comment"].Description));
                        var tla = timeline.getAnnotation(this.data.guid);
                        this.starttime(format.getTimeStringFromDate(tla[0].v));
                        this.endtime(format.getTimeStringFromDate(tla[1].v));
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
