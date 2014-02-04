define(['durandal/app', 'knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (app, ko, xmlman, metadataschema) {


    var larmprogram = function () {
        this.data = null;
        this.mdTitle = ko.observable("");
        this.mdAbstract = ko.observable("");
        this.mdDescription = ko.observable("");
        this.mdChannel = ko.observable("");
        this.mdStartDate = ko.observable("");
        this.mdEndDate = ko.observable("");

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

            var metadata = self.data.Metadatas;
            // LARM.Metadata: 17d59e41-13fb-469a-a138-bb691f13f2ba
            // Larm.Program: 00000000-0000-0000-0000-0000df820000
            for (var i = 0; i < metadata.length; i++) {
                if (metadata[i].MetadataSchemaGuid == '17d59e41-13fb-469a-a138-bb691f13f2ba') {
                    self.m0 = handlexml(metadata[i]);

                }
                else if (metadata[i].MetadataSchemaGuid == '00000000-0000-0000-0000-0000df820000') {
                    self.m1 = handlexml(metadata[i]);
                    
                    self.mdTitle(self.m1.Larm_Program.Title);
                    self.mdAbstract(self.m1.Larm_Program.Abstract);
                    self.mdDescription(self.m1.Larm_Program.Description);
                    self.mdChannel(self.m1.Larm_Program.PublicationChannel);
                    self.mdStartDate(self.m1.Larm_Program.PublicationDateTime);
                    self.mdEndDate(self.m1.Larm_Program.PublicationEndDateTime);
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

                init(this);
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



