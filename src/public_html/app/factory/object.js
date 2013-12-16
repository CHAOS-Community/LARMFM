define(['knockout', 'mods/objectselector'], function(ko, objectselector) {

    var ObjectItem = function() {
        this.id = ko.observable("");
        this.title = ko.observable();
        this.hash = ko.observable();
        this.date = ko.observable();
        this.datepretty = ko.observable();
        this.datetimepretty = ko.observable();
        this.duration = ko.observable();
        this.type = ko.observable();
        this.typetext = ko.observable();
        this.channel = ko.observable("");
        this.annotationCount = ko.observable(0);

        this.isselected = ko.observable(false);

        this.isselected.subscribe(function(val){
           if (this.id() != "") {
                if (val)
                    objectselector.add(this.id());
                else
                    objectselector.remove(this.id());
            } 
        }, this);
        
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

        var tdclick = function(item, event) {
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

