define(['knockout'], function(ko) {

    var items = [];
    var count = ko.observable(0);

    function clear() {
        items = [];
        count(0);
    }

    function add(itemid) {
        var i = indexof(itemid);
        if (i == -1) {
            items.push(itemid);
            count(items.length);
        }
    }

    function remove(itemid) {
        var i = indexof(itemid);
        if (i > -1) {
            items.splice(i, 1);
            count(items.length);
        }
    }

    function indexof(itemid) {
        for (var i = 0; i < items.length; i++) {
            if (items[i] == itemid)
                return i;
        }
        return -1;
    }
    
    function contains(itemid){
        return indexof(itemid) > -1;
    }

    return {
        clear: clear,
        add: add,
        remove: remove,
        indexof: indexof,
        contains: contains,
        count: count
    };
});


