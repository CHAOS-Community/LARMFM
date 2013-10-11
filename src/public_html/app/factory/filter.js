define(['knockout','mods/format'], function(ko, format) {

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

        var click = function(item) {
            item.isactive(!item.isactive());
            
            if(item.key() == "" && item.isactive()) {
                item.reset();
            }
            
            item.search();
        };

        return {
            click: click
        };

    }();

    return {
        FilterItem: FilterItem
    };

});

