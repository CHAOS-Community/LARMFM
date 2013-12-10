define(['durandal/app', 'knockout', 'mods/timeline', 'mods/xmlmanager', 'mods/format', 'mods/player'],
        function (app, ko, timeline, xmlmanager, format, player) {

            var annotationedit = function () {
                this.data = null;
                this.json = null;
                this.title = ko.observable("");
                this.description = ko.observable("");
                this.starttime = ko.observable("");
                this.endtime = ko.observable("");
            };


            annotationedit.prototype = (function () {

                var getField = function (field) {

                    if (typeof field === "string")
                        return field;

                    if (typeof field === "object" && field.__cdata !== "undefined")
                        return field.__cdata;

                    return "";

                };

                var setField = function (field, value) {

                    if (typeof field === "object" && field.__cdata !== "undefined") {
                        field.__cdata == value;
                    }

                    field = value;

                }

                return {
                    activate: function(){
                    },
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

                        this.starttime.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });
                        this.endtime.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });
                        this.title.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });

                    },
                    btnsave: function (data) {
                        setField(this.json["LARM.Annotation.Comment"].Title, this.title());
                        setField(this.json["LARM.Annotation.Comment"].Description, this.description());
                        
                        var start_sec = player.getFileTimeFromProgramTime(format.getSecondsFromString(this.starttime()));
                        var end_sec = player.getFileTimeFromProgramTime(format.getSecondsFromString(this.endtime()));

                        start_str = format.getTimeStringFromDate(new Date(timeline.start() + start_sec*1000));
                        end_str = format.getTimeStringFromDate(new Date(timeline.start() + end_sec * 1000));
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
