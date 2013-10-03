define(['knockout', 'factory/calendar', 'mods/format'], function(ko, calfac, format) {

    var items = ko.observableArray([]);
    var freetext = "";
    var filterwithoutdates = "";
    var search = null;

    function update(pfreetext, pfilterwithoutdates, pdatebegin, pdateend, searchmethod) {
        freetext = pfreetext;
        filterwithoutdates = pfilterwithoutdates;
        search = searchmethod;

        if (pdatebegin == null || pdateend == null) {
            //Decades
            dodecades();
        }

    }

    function dodecades() {
        items.removeAll();

        var yearb = 1920;
        var yeare = (new Date().getFullYear()) / 10 * 10;

        for (var i = yearb; i < yeare; i += 10) {
            var item = new calfac.CalendarItem();
            item.search = search;
            item.title(i + "'erne");
            item.datebegin(i + "-01-01");
            item.dateend(i + "-12-31");
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    return {
        freetext: freetext,
        items: items,
        update: update,
        search: search
    };
});


