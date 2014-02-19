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
