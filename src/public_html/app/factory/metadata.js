define(['durandal/system', 'knockout', 'mods/portal', 'mods/xmlmanager', 'mods/metadataschema'], function (system, ko, portal, xmlman, metadataschema) {

    var MetadataView = function () {
        this.view = ko.observable();
        this.data = null;
    };

    MetadataView.prototype = function () {

        var setview = function (viewname, data) {
            this.data = data;
            if (viewname.indexOf('.html', viewname.length - 5) !== -1) {
                this.view("metadata/" + viewname);
            } else {
                //ViewModel
                this.view("views/metadata/" + viewname);

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
            setview: setview
        };
    }();

    return {
        MetadataView: MetadataView
    };
});



