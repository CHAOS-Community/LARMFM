define(['knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (ko, xmlman, metadataschema) {

    var data;
    var m0;
    var m1;

    function handlexml(d) {
        var xml = xmlman.parseXml(d.MetadataXml);
        var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
        var json = xmlman.toJson(schema.arraypaths, xml)
        return json;
    }

    function init() {

        metadataschema.loadxmlschemas();

        // LARM.Metadata: 17d59e41-13fb-469a-a138-bb691f13f2ba
        // Larm.Program: 00000000-0000-0000-0000-0000df820000
        for (var i = 0; i < data.length; i++) {
            if (data[i].MetadataSchemaGuid == '17d59e41-13fb-469a-a138-bb691f13f2ba') {
                m0 = handlexml(data[i]);
            }
            else if (data[i].MetadataSchemaGuid == '00000000-0000-0000-0000-0000df820000') {
                m1 = handlexml(data[i]);
            }
        }
    }

    return {
        m0: m0,
        m1: m1,
        compositionComplete: function (child, parent, settings) {
            // settings.bindingContext.$data represents an
            // instance of MetadataEditor under factory.
            data = settings.bindingContext.$data.data;
            init();
        }
    };
});



