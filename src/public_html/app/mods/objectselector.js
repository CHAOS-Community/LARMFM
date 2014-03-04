define(['knockout'], function(ko) {

    var items = ko.observableArray();
    var count = ko.observable(0);

    function clear() {
        items.removeAll();
        count(0);
    }
    function getItems(){
        return items;
    }
    function add(object) {
        var i = indexof(object);
        if (i == -1) {
            items.push(object);
            count(items().length);
        }
    }

    function remove(object) {
        var i = indexof(object);
        if (i > -1) {
            items.splice(i, 1);
            count(items().length);
        }
    }

    function indexof(object) {
        for (var i = 0; i < items().length; i++) {
            if (items()[i] == object)
                return i;
        }
        return -1;
    }
    
    function contains(object){
        return indexof(object) > -1;
    }

    return {
        items:items,
        getItems:getItems,
        clear: clear,
        add: add,
        remove: remove,
        indexof: indexof,
        contains: contains,
        count: count
    };
});


