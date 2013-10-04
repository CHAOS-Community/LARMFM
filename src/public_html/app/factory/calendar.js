define(['knockout','mods/format'], function(ko, format) {

    var CalendarItem = function() {

        this.title = ko.observable("Test");
        this.count = ko.observable("");
        this.seq = ko.observable(0);
        this.busy = ko.observable(false);
        this.datebegin = ko.observable("");
        this.dateend = ko.observable("");
        this.search = null;
        this.isactive = ko.observable(false);
    };

    CalendarItem.prototype = function() {

        var load = function(freetext, filter) {
            this.busy(true);
            CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext, "", createfilter(this, filter), 0, 0).WithCallback(received, this);
        };

        var createfilter = function(self, f) {
            
            var filter = format.getSolrFilterFromDateRangeStr("PubStartDate", self.datebegin(), self.dateend());
            
            if (f != "")
                return f + "&" + filter;

            return filter;
        };

        var received = function(r) {
            setTimeout($.proxy(function() {
                this.busy(false);
                this.count(r.Body.TotalCount + "");
            }, this), 0);
        };

        var click = function(context) {
            context.search(context);
        };

        return {
            load: load,
            click: click
        };

    }();

    return {
        CalendarItem: CalendarItem
    };

});

