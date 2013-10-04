define(['knockout', 'factory/calendar', 'mods/format'], function(ko, calfac, format) {

    var items = ko.observableArray([]);
    var breadcrumbitems = ko.observableArray([]);
    var freetext = "";
    var filterwithoutdates = "";
    var search = null;

    function update(pfreetext, pfilterwithoutdates, pdatebegin, pdateend, searchmethod) {
        freetext = pfreetext;
        filterwithoutdates = pfilterwithoutdates;
        search = searchmethod;

        var any = false;

        if (pdatebegin != null && pdateend != null) {

            var d1 = pdatebegin;
            var d2 = pdateend;
            var d1yyyy = "" + d1.getFullYear();
            var d2yyyy = "" + d2.getFullYear();

            if (
                    d1yyyy.substring(0, 3) == d2yyyy.substring(0, 3) &&
                    d1yyyy.slice(-1) == "0" && d2yyyy.slice(-1) == "9"
                    ) {

                any = true;
                doyears(d1.getFullYear());
            }
            else if (d1yyyy == d2yyyy && d1.getMonth() != d2.getMonth()) {
                any = true;
                domonths(d1.getFullYear());
            }
            else if (d1yyyy == d2yyyy && d1.getMonth() == d2.getMonth()) {
                any = true;
                dodays(d1.getFullYear(), d1.getMonth());
            }
        }

        if (!any) {
            dodecades();
        }
    }

    function dodecades() {
        items.removeAll();
        breadcrumbitems.removeAll();
        addBreadcrumbDecades(true);

        var yearb = 1920;
        var yeare = (new Date().getFullYear()) / 10 * 10;

        for (var i = yearb; i < yeare; i += 10) {
            var item = new calfac.CalendarItem();
            item.search = itemclick;
            item.title(i + "'erne");
            item.datebegin(i + "-01-01");
            item.dateend(i + 9 + "-12-31");
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function doyears(year) {
        items.removeAll();
        
        var yearb = year;
        var yeare = year + 9;

        for (var i = yearb; i < yeare; i++) {
            var item = new calfac.CalendarItem();
            item.search = itemclick;
            item.title(i);
            item.datebegin(i + "-01-01");
            item.dateend(i + "-12-31");
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function domonths(y) {

        items.removeAll();

        for (var m = 1; m < 13; m++) {
            var item = new calfac.CalendarItem();
            item.search = itemclick;
            item.title(format.getDigit2(m) + "-" + y);
            item.datebegin(y + "-" + format.getDigit2(m) + "-01");
            var lastDay = new Date(y, m, 0);
            item.dateend(y + "-" + format.getDigit2(m) + "-" + format.getDigit2(lastDay.getDate()));
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function dodays(y,m) {

        items.removeAll();
        
        var lastDay = new Date(y, m+1, 0);
        
        for (var d = 1; d < lastDay.getDate(); d++) {
            var item = new calfac.CalendarItem();
            item.search = itemclick;
            item.title(format.getDigit2(d) + "-" + format.getDigit2(m+1) + "-" + y);
            item.datebegin(y + "-" + format.getDigit2(m+1) + "-" + format.getDigit2(d));
            item.dateend(y + "-" + format.getDigit2(m+1) + "-" + format.getDigit2(d));
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function addBreadcrumbDecades(active){
        breadcrumbitems.push(getCalItem("Årtier",null,null,active));
    }

    function addBreadcrumbDecade(title,db,de,active){
        breadcrumbitems.push(getCalItem(title,db,de,active));
    }


    function getCalItem(title,db,de,active){
        var item = new calfac.CalendarItem();
        item.search = itemclick;
        item.title(title);
        item.datebegin(db);
        item.dateend(de);
        item.isactive(active);
        return item;
    }

    function itemclick(item){
        
        var idx = -1;
        // Set all items to isactive false and find item index.
        for(var i = 0; i < breadcrumbitems().length; i++){
            breadcrumbitems()[i].isactive(false);
            if(breadcrumbitems()[i]===item)
                idx = i;
        }
        
        /// Remove item and above items from list.
        if(idx > -1){
            var il = breadcrumbitems().length - idx;
            for(var i = 0; i < il ; i++){
                breadcrumbitems.pop();
            }
        }
        
        /// Stop breadcrumb at day
        if(breadcrumbitems().length === 4)
            breadcrumbitems.pop();
        
        breadcrumbitems.push(getCalItem(item.title(),item.datebegin(),item.dateend(),true));
        
        search(item.datebegin(),item.dateend());
    }

    return {
        freetext: freetext,
        items: items,
        breadcrumbitems: breadcrumbitems,
        update: update,
        search: search
    };
});


