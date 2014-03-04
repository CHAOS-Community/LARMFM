define(['durandal/app', 'knockout', 'mods/timeline', 'mods/format', 'bootstrap', 'mods/player'],
    function (app, ko, timeline, format, bootstrap, player) {

    var MDAnnotationLine = function (mainself, expandcallback) {
        this.mainself = mainself;
        this.expandcallback = expandcallback;
        mainself.data = null;
        mainself.id = ko.observable("");
        mainself.title = ko.observable("");
        mainself.starttime = ko.observable("");
        mainself.endtime = ko.observable("");
        mainself.collapsed = ko.observable(true);
        mainself.author = ko.observable("");
        mainself.date = ko.observable("");
        mainself.ismouseover = false;
        mainself.isPlayBtnVisible = ko.observable(false);
        mainself.isLoading = ko.observable(false);
        mainself.timeline = timeline;
        mainself.mdhtml = ko.observableArray();
        mainself.editable = ko.observable(false);
    };

    MDAnnotationLine.prototype.init = function (settings) {

        var mainself = this.mainself;

        settings.bindingContext.$data.data["self"] = mainself;
        var data = settings.bindingContext.$data.data;
        this.data = data;

        mainself.id(data.Id);
        mainself.title(data.Title);

        var tla = timeline.getAnnotation(data.Id);
        mainself.starttime(format.getTimeStringFromDate(tla[0].v));
        mainself.endtime(format.getTimeStringFromDate(tla[1].v));

        mainself.author(data.EditingUser);
        mainself.date(new Date(data.DateModified).toLocaleString());
    };

    MDAnnotationLine.prototype.togglePlayBtnVisibility = function () {
        if (this.mainself.collapsed() === false) {
            this.mainself.isPlayBtnVisible(true);
        }
        else {
            this.mainself.isPlayBtnVisible(this.mainself.ismouseover);
        }
    };

    MDAnnotationLine.prototype.mouseover = function (e, c) {
        this.ismouseover = (c.type === "mouseover");
        this.annotation.togglePlayBtnVisibility();
    };

    MDAnnotationLine.prototype.btnexpand = function () {
        var self = this;
        if (this.mainself)
            self = this.mainself;
        self.collapsed(!self.collapsed());
        if (self.collapsed() === false) {

            if (self.annotation.expandcallback != null) {
                self.isLoading(true);
                self.annotation.expandcallback();
            }

            var ele = $('#ID' + self.id());
            $('html,body').animate({ scrollTop: (ele.offset().top - 62) });

        } else {
            self.ismouseover = false;
        }
        self.annotation.togglePlayBtnVisibility();
    };

    MDAnnotationLine.prototype.expandDone = function () {
        this.mainself.isLoading(false);
    };

    MDAnnotationLine.prototype.optionclick = function (param, data, context) {
        if (param === "Edit") {
            this.collapsed(true);
            this.ismouseover = false;
            this.annotation.togglePlayBtnVisibility();
            this.timeline.editItem(data.annotation.data.Id);
            app.trigger('metadata:edit', this);
        }
    };

    MDAnnotationLine.prototype.play = function (ann, ele) {

        window.scrollTo(0, 0);
        var s = format.getSecondsFromString(ann.starttime());
        timeline.selectItemById(ann.annotation.data.Id);
        player.setProgramTimePos(s);
        player.play();

        //var e = format.getSecondsFromString(ann.endtime());
        //player.setProgramTimeLoop(s, e);
        //player.playLoop();
    };

    return {
        MDAnnotationLine: MDAnnotationLine
    };

});