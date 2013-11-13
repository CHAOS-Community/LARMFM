define(['knockout', 'mods/portal', 'mods/xmlmanager', 'mods/metadataschema'], function (ko, portal, xmlman, metadataschema) {

    var MetadataEditor = function () {
        this.editor = ko.observable();
        this.metadataSchemaGuid = ko.observable();
        this.metadata = ko.observable();
        this.schema = ko.observable();
        this.metadatas = [];
        this.editorname = "";
    };

    MetadataEditor.prototype = function () {

        var seteditor = function (name) {

            this.editorname = name;
        }

        var setmetadata = function (metadataSchemaGuid, metadataxml) {

            metadataschema.loadxmlschemas();

            var lschema = metadataschema.getMetadataSchemaByGuid(metadataSchemaGuid);
            if (lschema == null)
                return;

            var jsonschema = lschema.schemajson;
            var arraypaths = lschema.arraypaths;
            jsonschema["value"] = null;
            jsonschema["onSubmit"] = null;

            var xmldata = metadataxml;
            // Replace . with _ inside tags (inside < and >).
            xmldata = xmldata.replace(/([<]+[/a-zA-Z]*)(\.)([/a-zA-Z]*[>]+)/gi, '$1_$3');

            var x2js = new X2JS({ arrayAccessFormPaths: arraypaths });
            var jsdata = x2js.xml_str2json(xmldata);

            if (this.metadata() === undefined) {
                this.metadataSchemaGuid(metadataSchemaGuid);
                this.metadata(jsdata);
                this.schema(lschema.schemajson);
            }

            this.metadatas.push({ schema: lschema.schemajson, schemaguid: metadataSchemaGuid, data: jsdata });
        }

        var show = function () {
            if (this.editorname == "generic") {
                this.editor("viewmodels/editors/generic");
            }
            else {
                this.editor("editors/" + this.editorname + ".html");
            }
        }

        return {
            seteditor: seteditor,
            setmetadata: setmetadata,
            show: show
        };
    }();

    return {
        MetadataEditor: MetadataEditor
    };
});



