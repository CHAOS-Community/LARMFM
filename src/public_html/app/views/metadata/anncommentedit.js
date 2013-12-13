define(['durandal/app', 'knockout', 'mods/timeline', 'mods/xmlmanager', 'mods/format', 'mods/player'],
        function (app, ko, timeline, xmlmanager, format, player) {

            var annotationedit = function () {
                this.data = null;
                this.json = null;
                this.title = ko.observable("");
                this.description = ko.observable("");
                this.starttime = ko.observable("");
                this.endtime = ko.observable("");
                this.s;
                this.e;
                this.c;
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
                        return;
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
                        this.s = tla[0].v;
                        this.e = tla[1].v;
                        this.c = tla[2].v

                        this.starttime(format.getTimeStringFromDate(this.s));
                        this.endtime(format.getTimeStringFromDate(this.e));

                        this.starttime.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });
                        this.endtime.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });
                        this.title.subscribe(function (v) { app.trigger('metadata:changed_editor', {}) });

                    },
                    btnsave: function (data) {
                        if(this.json["LARM.Annotation.Comment"].Title.__cdata === undefined)
                            this.json["LARM.Annotation.Comment"].Title = this.title();
                        else
                            this.json["LARM.Annotation.Comment"].Title.__cdata = this.title();

                        if (this.json["LARM.Annotation.Comment"].Description.__cdata === undefined)
                            this.json["LARM.Annotation.Comment"].Description = this.description();
                        else
                            this.json["LARM.Annotation.Comment"].Description.__cdata = this.description();
                        
                        var start_sec = player.getFileTimeFromProgramTime(format.getSecondsFromString(this.starttime()));
                        var end_sec = player.getFileTimeFromProgramTime(format.getSecondsFromString(this.endtime()));

                        start_str = format.getTimeStringFromDate(new Date(timeline.start() + start_sec*1000));
                        end_str = format.getTimeStringFromDate(new Date(timeline.start() + end_sec * 1000));

                        this.json["LARM.Annotation.Comment"]._StartTime = start_str;
                        this.json["LARM.Annotation.Comment"]._EndTime = end_str;

                        var xml = xmlmanager.toXmlDirect(this.json);

                        app.trigger("metadata:save", { guid: this.data.guid, schemaguid: 'd0edf6f9-caf0-ac41-b8b3-b0d950fdef4e', xml: xml });
                        // this.data.guid er det guid på annotation object?
                    },
                    btncancel: function (data) {
                        timeline.changeItem(this.s, this.e, this.c);
                        app.trigger("metadata:cancel", { guid: this.data.guid, schemaguid: 'd0edf6f9-caf0-ac41-b8b3-b0d950fdef4e' });
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
