define(['knockout'], function (ko) {

    var data = ko.observable();
    var dataCount = ko.observable();
    var annotationCount = ko.observableArray([]);

    function updateAnnotationCount() {
        annotationCount.removeAll();

        // "d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e" Comments
        // "7bb8d425-6e60-9545-80f4-0765c5eb6be6" Lydkilder
        annotationCount()["d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e"] = 0;
        annotationCount()["7bb8d425-6e60-9545-80f4-0765c5eb6be6"] = 0;

        var amds = data();
        for (var i = 0; i < amds.length; i++) {
            var amd = amds[i];
            var schguid = amd.MetadataSchemaGUID;
            if (schguid in annotationCount())
                annotationCount()[schguid] = annotationCount()[schguid] + 1;
            else
                annotationCount()[schguid] = 1;
        }
    }

    return {
        data: data,
        dataCount: dataCount,
        annotationCountPerSchema: annotationCount,
        setAnnotationData: function (annData, annDataCount) {
            data(annData);
            dataCount(annDataCount);
            updateAnnotationCount();
        },
        // Addes annotation to data. It has to be present in the timeline before calling this.
        addAnnotationToData: function (guid, schemaGuid, title) {

            // TODO: Add Annotation

            updateAnnotationCount();
        },
        updateAnnotationData: function (values) {
            for (var i = 0; i < data().length; i++) {
                if (data()[i].Id == values.guid) {
                    var d = data()[i];
                    d.EndTime = values.end;
                    d.StartTime = values.start;
                    d.Title = values.title;
                    return data()[i];
                }
            }
        }
    };
});