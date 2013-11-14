define(['knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (ko, xmlman, metadataschema) {

    var data;
    function init() {

        var guid = data.guid;
        var xml = data.xml;

        metadataschema.loadxmlschemas();

        var schema = metadataschema.getMetadataSchemaByGuid(guid);
        if (schema == null)
            return;

        var jsonschema = schema.schemajson;
        jsonschema["value"] = null;
        jsonschema["onSubmit"] = null;

        jsonschema["value"] = xmlman.toJson(schema.arraypaths, xml);
        jsonschema["onSubmit"] = function (errors, values) {
            if (errors) {
                $('#res').html('<p>There is an error in the xml.</p>');
            }
            else {
                var metadata = {};

                // Fetch schema for the metadata
                var formTree = $('#form1').data('jsonform-tree');
                var schema = formTree.formDesc.schema.properties;

                for (var schemakey in schema) {
                    if (schema.hasOwnProperty(schemakey)) {
                        var props = schema[schemakey].properties;
                        var vals = values[schemakey];
                        metadata[schemakey] = {};
                        var md = metadata[schemakey];
                        for (var key in props) {
                            if (vals.hasOwnProperty(key)) {
                                md[key] = vals[key];
                            }
                            else {
                                if (props[key].type == "object") {
                                    md[key] = [];
                                }
                                else {
                                    md[key] = "";
                                }
                            }
                        }
                    }
                }

                var x2js = new X2JS();
                metadata = x2js.json2xml_str(metadata);
                metadata = metadata.replace(/([<]+[/a-zA-Z]*)(_)([/a-zA-Z]*[>]+)/gi, '$1.$3');
                $('#xmlres').val(metadata);
            }
        };

        $('#form1').jsonForm(jsonschema);

    }

    return {
        compositionComplete: function (child, parent, settings) {
            // settings.bindingContext.$data represents an
            // instance of MetadataEditor under factory.
            data = settings.bindingContext.$data.data;
            init();
        }
    };
});



