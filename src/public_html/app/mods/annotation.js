define(['knockout'], function (ko) {

    var data = ko.observable();
    var dataCount = ko.observable();


    return {
        data: data,
        dataCount: dataCount,
        setAnnotations: function (annData, annDataCount) {
            data(annData);
            dataCount(annDataCount);
        }

    };


});