define(['knockout', 'mods/timeline', 'mods/format'], function (ko, timeline, format) {

    var MDAnnotationLine = function () {
        this.title = ko.observable("");
        this.starttime = ko.observable("");
        this.endtime = ko.observable("");
        this.collapsed = ko.observable(true);
        this.author = ko.observable("");
        this.date = ko.observable("");
    };

    MDAnnotationLine.prototype.init = function (compositionsettings, item) {

        compositionsettings.bindingContext.$data.data["self"] = item;
        var data = compositionsettings.bindingContext.$data.data;
        item.data = data;

        this.title(data.Title);

        var tla = timeline.getAnnotation(data.Id);
        this.starttime(format.getTimeStringFromDate(tla[0].v));
        this.endtime(format.getTimeStringFromDate(tla[1].v));

        this.author(data.EditingUser);
        this.date(new Date(data.DateModified).toLocaleString());

    };

    return {
        MDAnnotationLine: MDAnnotationLine
    };

});