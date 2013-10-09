define(['knockout'],function (ko) {

    var ObjectItem = function () {
        //this.eqCtl = document.getElementById(eq);
        this.title = ko.observable();
        this.hash = ko.observable();
        this.date = ko.observable();
        this.datepretty = ko.observable();
        this.type = ko.observable();
    };

    ObjectItem.prototype = function () {

        return {
        };

    }();

    return {
        ObjectItem: ObjectItem
    };

});

