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

    var annotationData = [
        {
            GUID: "db6c93f0-3864-6044-a99c-5b4ce5ef8d9d",
            MetadataSchemaGUID: "50ad46c4-eaf1-42f6-9361-3f6b56c5f320",
            EditingUserGUID: "7d2db0e4-8cfd-4ecf-92e8-3eba34914011",
            EditingUser: "Thomas Lynge",
            DateCreated: "05-04-2013 09:07:16",
            LanguageCode: "da",
            StartTime: "00:07:45.9780000",
            EndTime: "00:08:40.1880000",
            Title: "STEMMER"
        }
    ];
    

    return {
        MetadataView: MetadataView,
        annotationData: annotationData
    };
});



