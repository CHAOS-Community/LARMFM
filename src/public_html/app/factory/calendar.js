define(['knockout'],function (ko) {

    var CalendarItem = function () {
        
        this.title = ko.observable("");
        this.count = ko.observable("");
        this.seq = ko.observable(0);
    };

    CalendarItem.prototype = function () {

        var load = function(){
            ;
        };

        return {
            load: load
        };

    }();

    return {
        CalendarItem: CalendarItem
    };

});

