define(['durandal/app', 'knockout', 'mods/timeline', 'mods/format', 'bootstrap'], function (app, ko, timeline, format, bootstrap) {

    var MDAnnotationLine = function () {
        this.mainself = null;
        this.title = ko.observable("");
        this.starttime = ko.observable("");
        this.endtime = ko.observable("");
        this.collapsed = ko.observable(true);
        this.author = ko.observable("");
        this.date = ko.observable("");
        this.ismouseover = false;
        this.isPlayBtnVisible = ko.observable(false);
        this.expandcallback = null;
        this.isLoading = ko.observable(false);
        this.timeline = timeline;
        this.mdhtml = ko.observableArray();
    };

    MDAnnotationLine.prototype.init = function (compositionsettings, mainself, expandcallback) {
        this.mainself = mainself;
        compositionsettings.bindingContext.$data.data["self"] = mainself;
        var data = compositionsettings.bindingContext.$data.data;
        mainself.data = data;

        this.title(data.Title);

        var tla = timeline.getAnnotation(data.Id);
        this.starttime(format.getTimeStringFromDate(tla[0].v));
        this.endtime(format.getTimeStringFromDate(tla[1].v));

        this.author(data.EditingUser);
        this.date(new Date(data.DateModified).toLocaleString());

        this.expandcallback = expandcallback;
    };

    MDAnnotationLine.prototype.togglePlayBtnVisibility = function () {
        if (this.collapsed() === false) {
            this.isPlayBtnVisible(true);
        }
        else {
            this.isPlayBtnVisible(this.ismouseover);
        }
    };

    MDAnnotationLine.prototype.mouseover = function (e, c) {
        this.annotation.ismouseover = (c.type === "mouseover");
        this.annotation.togglePlayBtnVisibility();
    };

    MDAnnotationLine.prototype.btnexpand = function () {
        this.annotation.collapsed(!this.annotation.collapsed());
        if (this.annotation.collapsed() === false) {

            if (this.annotation.expandcallback != null) {
                this.annotation.isLoading(true);
                this.annotation.expandcallback();
            }
        }
        this.annotation.togglePlayBtnVisibility();
    };

    MDAnnotationLine.prototype.expandDone = function () {
        this.isLoading(false);
    };

    MDAnnotationLine.prototype.optionclick = function (param, data, context) {
        if (param === "Edit") {
            this.annotation.collapsed(true);
            this.annotation.timeline.editItem(data.data.Id);
            app.trigger('metadata:edit', this);
        }
    };

    return {
        MDAnnotationLine: MDAnnotationLine
    };

});