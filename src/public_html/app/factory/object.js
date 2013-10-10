define(['knockout'], function(ko) {

    var ObjectItem = function() {
        //this.eqCtl = document.getElementById(eq);
        this.title = ko.observable();
        this.hash = ko.observable();
        this.date = ko.observable();
        this.datepretty = ko.observable();
        this.type = ko.observable();
        this.isselected = ko.observable(false);
    };

    ObjectItem.prototype = function() {

        var titleclick = function(item) {
            window.open(item.hash());
        };
        
        var checkclick = function(item) {
            item.isselected(!item.isselected());
            item.isselected(!item.isselected());
        };

        var rowclick = function(item, event) {
            item.isselected(!item.isselected());
        };

        var rowdblclick = function(item, event) {

            if (window.getSelection)
                window.getSelection().removeAllRanges();
            else if (document.selection)
                document.selection.empty();

            event.cancelBubble = true;
            if (event.stopPropagation)
                event.stopPropagation();

            window.open(item.hash());
        };

        var tdclick = function(item, event){
//            event.bubbles = false;
//            event.originalEvent.cancelBubble = true;
        };

        return {
            rowclick: rowclick,
            rowdblclick: rowdblclick,
            titleclick: titleclick,
            checkclick: checkclick,
            tdclick: tdclick
        };

    }();

    return {
        ObjectItem: ObjectItem
    };

});

