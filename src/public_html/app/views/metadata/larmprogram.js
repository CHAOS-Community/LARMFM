define(['durandal/app', 'knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (app, ko, xmlman, metadataschema) {


    var larmprogram = function () {
        this.data = null;
        this.mdtitle = ko.observable("");
        this.m0 = null;
        this.m1 = null;
    };

    larmprogram.prototype = (function () {

        function handlexml(d) {
            var xml = xmlman.parseXml(d.MetadataXml);
            var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
            var json = xmlman.toJson(schema.arraypaths, xml)
            return json;
        }

        function init(self) {

            metadataschema.loadxmlschemas();

            var metadata = self.data.metadata;
            // LARM.Metadata: 17d59e41-13fb-469a-a138-bb691f13f2ba
            // Larm.Program: 00000000-0000-0000-0000-0000df820000
            for (var i = 0; i < metadata.length; i++) {
                if (metadata[i].MetadataSchemaGuid == '17d59e41-13fb-469a-a138-bb691f13f2ba') {
                    self.m0 = handlexml(metadata[i]);

                }
                else if (metadata[i].MetadataSchemaGuid == '00000000-0000-0000-0000-0000df820000') {
                    self.m1 = handlexml(metadata[i]);
                    self.mdtitle(self.m1.Larm_Program.Title + " : " + self.data.id);
                }
            }
        }

        return {

            compositionComplete: function (child, parent, settings) {
                // settings.bindingContext.$data represents an
                // instance of MetadataEditor under factory.
                this.data = settings.bindingContext.$data.data;
                if (this.data === undefined)
                    return;

                if (this.data.metadata !== undefined) {
                    init(this);
                }
            },
            btnedit: function (data) {
                var i = 0;
                //parentcontext.$data.entereditmode(this);
                app.trigger('metadata:edit', this);
            }

        };
    })();

    return larmprogram;

});



