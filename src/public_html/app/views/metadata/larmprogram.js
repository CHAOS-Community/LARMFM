define(['durandal/app', 'knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (app, ko, xmlman, metadataschema) {

    var data = ko.observable();
    var mdtitle = ko.observable("");

    var metadata;
    var parentcontext;
    var m0;
    var m1;
    var test2 = ko.observable("");
    //var id = ko.observable("");

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
        for (var i = 0; i < metadata.length; i++) {
            if (metadata[i].MetadataSchemaGuid == '17d59e41-13fb-469a-a138-bb691f13f2ba') {
                m0 = handlexml(metadata[i]);
                
            }
            else if (metadata[i].MetadataSchemaGuid == '00000000-0000-0000-0000-0000df820000') {
                m1 = handlexml(metadata[i]);
                mdtitle(m1.Larm_Program.Title + " : " + data().id);
            }
        }
    }

    // return function instead to avoid singleton.

    return {
        data: data,
        mdtitle: mdtitle,
        m0: m0,
        m1: m1,
        test: "",
        test2: test2,
        activate: function (d){
            var i = 0;
        },
        attached: function (d) {
            var i = 0;
        },
        compositionComplete: function (child, parent, settings) {

            data(settings.bindingContext.$data.data);

            if(data() === undefined)
                return;

            // settings.bindingContext.$data represents an
            // instance of MetadataEditor under factory.
            metadata = data().metadata;
            //id(settings.bindingContext.$data.data.id);
            //var p = settings.bindingContext.$data.data.parent;
            //parentcontext = settings.bindingContext.$parentContext;
            //settings.bindingContext.$data = this;
            if (metadata !== undefined){
                init();
            }
        },
        clack: function (data) {
            var i = 0;
            //parentcontext.$data.entereditmode(this);
            app.trigger('metadata:edit', this);
        }
    };
});



