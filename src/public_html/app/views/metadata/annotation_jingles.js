define([
    'mods/objectmanager', 'mods/xmlmanager', 'mods/metadataschema',
    'mods/metadataviewbuilder', 'mods/mdannotationline'
],
        function (
            objectmanager, xmlman, metadataschema,
            html, mdannotationline
            ) {

            var anncomment = function () {
                this.annotation = new mdannotationline.MDAnnotationLine(this, this.expanded);
            };

            anncomment.prototype = (function () {
                return {
                    annotation: this.annotation,
                    compositionComplete: function (child, parent, settings) {
                        this.annotation.init(settings);
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

                                var p = self.mdhtml;
                                var d = json["LARM.Annotation.WP5.8.2.Jingles"];

                                p.removeAll();
                                html.mdtext(p, "Title", d.Title);
                                html.mdtags(p, "Tags", d.Tags);
                                html.mdtags(p, "Classification", d.Classification);
                                html.mdtags(p, "JingleID", d.JingleID);

                                html.mdtext(p, "FromPeriod", d.FromPeriod);
                                html.mdtext(p, "ToPeriod", d.ToPeriod);

                                html.mdtags(p, "ComponistType", d.ComponistType);
                                html.mdtext(p, "ComponistName", d.ComponistName);

                                html.mdtags(p, "SourceType", d.SourceType);
                                html.mdtext(p, "SourceMusicTitle", d.SourceMusicTitle);

                                html.mdtext(p, "CreatorMusic", d.CreatorMusic);
                                html.mdtext(p, "DescriptionMusic", d.DescriptionMusic);
                                html.mdtext(p, "SpeakTranscribe", d.SpeakTranscribe);
                                html.mdtext(p, "SpeakDescription", d.SpeakDescription);

                                html.mdtags(p, "SoundType", d.SoundType);
                                html.mdtags(p, "SoundTags", d.SoundTags);
                                html.mdtags(p, "MusicStyleTags", d.MusicStyleTags);

                                html.mdtags(p, "ProgramGenre", d.ProgramGenre);
                                html.mdtext(p, "JingleVariant", d.JingleVariant);
                                html.mdtags(p, "MixTypeIn", d.MixTypeIn);
                                html.mdtags(p, "MixTypeOut", d.MixTypeOut);
                                html.mdtags(p, "MixTypeSoundLevel", d.MixTypeSoundLevel);

                                break;
                            }
                        }
                        self.annotation.expandDone();
                    }


                };
            })();

            return anncomment;

        });
