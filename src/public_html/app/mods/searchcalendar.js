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

            generateBreadcrumb(format.getQueryDateStr(pdatebegin), format.getQueryDateStr(pdateend));
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
            var item = getCalItem_decade(i);
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function getCalItem_decade(decade) {
        var item = new calfac.CalendarItem();
        item.search = itemclick;
        item.title(decade + "'erne");
        item.datebegin(decade + "-01-01");
        item.dateend(decade + 9 + "-12-31");
        return item;
    }

    function doyears(year) {
        items.removeAll();

        var yearb = year;
        var yeare = year + 9;

        var yearnow = new Date().getFullYear();
        if (yeare > yearnow)
            yeare = yearnow;

        for (var i = yearb; i <= yeare; i++) {
            var item = getCalItem_year(i);
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function getCalItem_year(year) {
        var item = new calfac.CalendarItem();
        item.search = itemclick;
        item.title(year);
        item.datebegin(year + "-01-01");
        item.dateend(year + "-12-31");
        return item;
    }

    var monthnames = ["", "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];

    function domonths(y) {

        items.removeAll();

        for (var m = 1; m < 13; m++) {
            var item = getCalItem_month(m, y);
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function getCalItem_month(month, year) {
        var item = new calfac.CalendarItem();
        item.search = itemclick;
        item.title(monthnames[month]);
        item.datebegin(year + "-" + format.getDigit2(month) + "-01");
        var lastDay = new Date(year, month, 0);
        item.dateend(year + "-" + format.getDigit2(month) + "-" + format.getDigit2(lastDay.getDate()));
        return item;
    }

    function dodays(y, m) {

        items.removeAll();

        var lastDay = new Date(y, m + 1, 0);

        for (var d = 1; d <= lastDay.getDate(); d++) {
            var item = new calfac.CalendarItem();
            item.search = itemclick;
            item.issmall(true);
            item.title(d + ".");
            item.datebegin(y + "-" + format.getDigit2(m + 1) + "-" + format.getDigit2(d));
            item.dateend(y + "-" + format.getDigit2(m + 1) + "-" + format.getDigit2(d));
            items.push(item);
            item.load(freetext, filterwithoutdates);
        }
    }

    function addBreadcrumbDecades(active) {
        breadcrumbitems.push(getCalItem("Årtier", null, null, active));
    }

    function addBreadcrumbDecade(title, db, de, active) {
        breadcrumbitems.push(getCalItem(title, db, de, active));
    }


    function getCalItem(title, db, de, active) {
        var item = new calfac.CalendarItem();
        item.search = itemclick;
        item.title(title);
        item.datebegin(db);
        item.dateend(de);
        item.isactive(active);
        return item;
    }

    function itemclick(item) {

        /*
         var idx = -1;
         // Set all items to isactive false and find item index.
         for (var i = 0; i < breadcrumbitems().length; i++) {
         breadcrumbitems()[i].isactive(false);
         if (breadcrumbitems()[i] === item)
         idx = i;
         }
         
         /// Remove item and above items from list.
         if (idx > -1) {
         var il = breadcrumbitems().length - idx;
         for (var i = 0; i < il; i++) {
         breadcrumbitems.pop();
         }
         }
         
         /// Stop breadcrumb at day
         if (breadcrumbitems().length === 5)
         breadcrumbitems.pop();
         
         if (breadcrumbitems().length < 4)
         breadcrumbitems.push(getCalItem(item.title(), item.datebegin(), item.dateend(), true));
         */

        generateBreadcrumb(item.datebegin(), item.dateend());
        search(item.datebegin(), item.dateend());
    }

    function generateBreadcrumb(ds1, ds2) {
        breadcrumbitems.removeAll();
        addBreadcrumbDecades(true);

        if (ds1 == null || ds1 == "" || ds2 == null || ds2 == "")
            return;

        var y1 = ds1.substring(0, 4);
        var y2 = ds2.substring(0, 4);

        var yyy1 = y1.substring(0, 3);
        var yyy2 = y2.substring(0, 3);

        if (yyy1 == yyy2) {
            var decadeitem = getCalItem_decade(yyy1 + "0");
            breadcrumbitems.push(decadeitem);
            if (y1 == y2) {
                var m1 = ds1.substring(5, 7);
                var m2 = ds2.substring(5, 7);

                var yearitem = getCalItem_year(parseInt(y1));
                breadcrumbitems.push(yearitem);

                if (m1 == m2) {
                    var d1 = ds1.substring(8, 10);
                    var d2 = ds2.substring(8, 10);
                    var monthitem = getCalItem_month(parseInt(m1),parseInt(y1));
                    breadcrumbitems.push(monthitem);
                }
            }
        }

        var bclen = breadcrumbitems().length;
        for (var i = 0; i < bclen; i++) {
            breadcrumbitems()[i].isactive((i + 1 == bclen));
        }
    }

    return {
        freetext: freetext,
        items: items,
        breadcrumbitems: breadcrumbitems,
        update: update,
        search: search
    };
});


