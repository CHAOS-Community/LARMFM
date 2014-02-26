define([
    'mods/objectmanager', 'mods/xmlmanager', 'mods/metadataschema',
    'mods/metadataviewbuilder', 'mods/mdannotationline'
],
        function (
            objectmanager, xmlman, metadataschema,
            html, mdannotationline
            ) {

            var anncomment = function () {
                //this.data = null;
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
                                var d = json["LARM.Annotation.Comment"];

                                p.removeAll();
                                html.mdtext(p, "!md_title", d.Title);
                                html.mdtext(p, "!md_description", d.Description);

                                break;
                            }
                        }
                        self.annotation.expandDone();
                    }
                };
            })();

            return anncomment;

        });
