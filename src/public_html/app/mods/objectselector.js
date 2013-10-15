define(['knockout'], function (ko) {
    
    var items = [];

    function clear(){
        items = [];
    }

    function add(itemid){
        items[itemid] = 1;
    }
    
    function remove(itemid){
        if(contains(itemid)){
            var index = items.indexOf(itemid);
            if(index > -1){
                items.splice(index,1);
            }
        }
    }
    
    function contains(itemid){
        return itemid in items;
    }

    return {
        clear: clear,
        add: add,
        remove: remove,
        contains: contains
    };
});


