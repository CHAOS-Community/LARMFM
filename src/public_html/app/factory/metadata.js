define(['knockout', 'mods/portal', 'mods/xmlmanager', 'mods/metadataschema'], function (ko, portal, xmlman, metadataschema) {

    var MetadataEditor = function () {
        this.editor = ko.observable();
        this.metadata = ko.observable();
        this.metadataSchemaGuid = ko.observable();
    };

    MetadataEditor.prototype = function () {

        var seteditor = function (name, metadataSchemaGuid, metadataxml) {

            this.metadataSchemaGuid(metadataSchemaGuid);
            this.metadata(metadataxml);

            if (name == "generic") {
                this.editor("viewmodels/editors/generic");
            }
            else {
                this.editor("editors/" + name + ".html");
            }
        }

        return {
            seteditor: seteditor
        };
    }();

    return {
        MetadataEditor: MetadataEditor
    };
});



