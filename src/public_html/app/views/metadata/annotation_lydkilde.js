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
                                var d = json["LARM.Annotation.WP5.8.1.LydkildeBeskrivelse"];

                                p.removeAll();
                                html.mdtext(p, "SoundSourceName", d.SoundSourceName);
                                html.mdtags(p, "Tags", d.Tags);
                                html.mdtags(p, "MixTypeIn", d.MixTypeIn);
                                html.mdtags(p, "MixTypeOut", d.MixTypeOut);
                                html.mdtags(p, "MixTypeSoundLevel", d.MixTypeSoundLevel);
                                html.mdtags(p, "SoundType", d.SoundType);
                                html.mdtags(p, "Anchorage", d.Anchorage);
                                html.mdtext(p, "Description", d.Description);

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
