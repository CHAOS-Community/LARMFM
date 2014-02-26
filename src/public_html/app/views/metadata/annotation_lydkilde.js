define([
    'mods/objectmanager', 'mods/xmlmanager', 'mods/metadataschema',
    'mods/metadataviewbuilder', 'mods/mdannotationline'
],
        function (
            objectmanager, xmlman, metadataschema,
            html, mdannotationline
            ) {

            var anncomment = function () {
                this.annotation = new mdannotationline.MDAnnotationLine();
            };

            anncomment.prototype = (function () {
                return {
                    annotation: this.annotation,
                    compositionComplete: function (child, parent, settings) {
                        this.annotation.init(settings, this, this.expanded);
                    },
                    expanded: function () {
                        objectmanager.getByGuid(this.data.Id, this.mainself.metadataReceived, this.mainself);
                    },
                    metadataReceived: function (param, self) {
                        var i = 0;
                        for (var i = 0; i < param.Metadatas.length; i++) {
                            if (param.Metadatas[i].MetadataSchemaGuid == self.annotation.data.MetadataSchemaGUID) {

                                var d = param.Metadatas[i];
                                var xml = xmlman.parseXml(d.MetadataXml);
                                var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
                                var json = xmlman.toJson(schema.arraypaths, xml)

                                var p = self.annotation.mdhtml;
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
                        self.annotation.expandDone();
                    }
                };
            })();

            return anncomment;

        });
