define(['knockout'], function (ko) {

    var data = ko.observable();
    var dataCount = ko.observable();


    return {
        data: data,
        dataCount: dataCount,
        setAnnotationData: function (annData, annDataCount) {
            data(annData);
            dataCount(annDataCount);
        },
        // Addes annotation to data. It has to be present in the timeline before calling this.
        addAnnotationToData: function (guid, schemaGuid, title) {

        }


    };


});