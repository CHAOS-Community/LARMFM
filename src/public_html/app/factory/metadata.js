define(['durandal/system', 'knockout', 'mods/portal', 'mods/xmlmanager', 'mods/metadataschema'], function (system, ko, portal, xmlman, metadataschema) {

    var MetadataEditor = function () {
        this.editor = ko.observable();
        this.data = null;
    };

    MetadataEditor.prototype = function () {

        var seteditor = function (editorname, data) {
            this.data = data;
            if (editorname.indexOf('.html', editorname.length - 5) !== -1) {
                this.editor("editors/" + editorname);
            } else {
                //ViewModel
                this.editor("views/editors/" + editorname);

                //this.editor("viewmodels/editors/" + editorname);
                //var self = this;
                //system.acquire("views/editors/" + editorname).done(function (modelCtor) {
                //    v = "editors/" + editorname + ".html";
                    //vm = new modelCtor();
                    //vm = modelCtor;
                    //self.editor({ view: v, model: vm });
                 //   self.editor({ view: v });
                //});
            }
        }

        return {
            seteditor: seteditor,
            clack: function (data) {
                var i = 0;

            }
        };
    }();

    return {
        MetadataEditor: MetadataEditor
    };
});



