define(['knockout', 'mods/format'], function(ko, format) {

    var FilterItem = function() {
        this.fid = ko.observable("");
        this.title = ko.observable("");
        this.count = ko.observable("");
        this.isactive = ko.observable(false);
        this.key = ko.observable("");
        this.search = null;
        this.reset = null;
    };

    FilterItem.prototype = function() {

        var load = function(freetext, filter) {
            var flter = createfilter(this, filter);
            CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext, "", flter, 0, 0).WithCallback(received, this);
        };

        var createfilter = function(self, f) {

            if(self.key()=="")
                return f;

            if (f != "")
                return f + " AND Type:" + self.key()+"";

            return "Type:" + self.key();
        };

        var received = function(r) {
            setTimeout($.proxy(function() {
                this.count(r.Body.TotalCount + "");
            }, this), 0);
        };

        var click = function(item) {
            item.isactive(!item.isactive());

            if (item.key() == "" && item.isactive()) {
                item.reset();
            }

            item.search();
        };

        return {
            click: click,
            load: load
        };

    }();

    return {
        FilterItem: FilterItem
    };

});

