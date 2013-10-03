define(['knockout','factory/calendar'], function(ko, calfac) {

    var items = ko.observableArray([]);
    var freetext = "";
    var filter = "";
    
    function update(pfreetext, pfilter, pdatebegin, pdateend) {
        freetext = pfreetext;
        filter = pfilter;
        
        if(pdatebegin==null||pdateend==null){
            //Decades
            dodecades();
        }
        
    }

    function dodecades(){
        items.removeAll();
        
        var item = new calfac.CalendarItem();
        item.title = "1980'erne";
        item.count = 11;
        item.seq = 1;
        items.push(item);
        item.load();
        
        var item2 = new calfac.CalendarItem();
        item2.title = "1990'erne";
        item2.count = 22;
        item2.seq = 2;
        items.push(item2);
        item2.load();
        
    }

    function createfilter() {
        return filter;
    }

    function call() {
        CHAOS.Portal.Client.View.Get(Settings.Search.viewName, freetext, "", createfilter(), 0, 0).WithCallback(received);
    }
    function received(r)
    {
        items.removeAll();
        //for (var i = 0; i < r.Body.Count; i++)
    }

    return {
        freetext: freetext,
        items: items,
        update: update
    };
});


