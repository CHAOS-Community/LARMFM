define([
    'durandal/app', 'knockout', 'mods/player', 'mods/timeline',
    'mods/format', 'factory/metadata', 'mods/objectmanager',
    'mods/xmlmanager', 'mods/metadataschema', 'mods/metadataviewbuilder'
],
        function (
            app, ko, player, timeline,
            format, metadatafac, objectmanager,
            xmlman, metadataschema, html
            ) {

            var anncomment = function () {
                this.data = null;
                this.title = ko.observable("");
                this.starttime = ko.observable("");
                this.endtime = ko.observable("");
                this.collapsed = ko.observable(true);
                this.player = player;
                this.timeline = timeline;

                this.mdhtml = ko.observableArray();
                this.isLoading = ko.observable(false);
            };

            anncomment.prototype = (function () {

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
                        this.collapsed(true);
                        var i = 0;
                        //parentcontext.$data.entereditmode(this);
                        this.timeline.editItem(data.data.Id);
                        app.trigger('metadata:edit', this);
                        //app.trigger('metadata:changedinview', this);
                    },
                    btnexpand: function () {
                        this.collapsed(!this.collapsed());

                        if (this.collapsed() === false) {

                            this.isLoading(true);
                            objectmanager.getByGuid(this.data.Id, this.metadataReceived, this);

                        }
                    },
                    metadataReceived: function (param, self) {
                        var i = 0;
                        for (var i = 0; i < param.Metadatas.length; i++) {
                            if (param.Metadatas[i].MetadataSchemaGuid == self.data.MetadataSchemaGUID) {

                                var d = param.Metadatas[i];
                                var xml = xmlman.parseXml(d.MetadataXml);
                                var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
                                var json = xmlman.toJson(schema.arraypaths, xml)

                                var p = self.mdhtml;
                                var d = json["LARM.Annotation.Comment"];

                                p.removeAll();
                                html.mdtext(p, "!md_title", d.Title);
                                html.mdtext(p, "!md_description", d.Description);

                                break;
                            }
                        }
                        self.isLoading(false);
                    }


                };
            })();

            //editor2.prototype.compositionComplete = function (child, parent, settings) {
            //    // settings.bindingContext.$data represents an
            //    // instance of MetadataEditor under factory.
            //    this.data = settings.bindingContext.$data.data;
            //    this.title(this.data.title);
            //};

            return anncomment;

        });
