define(['durandal/app', 'plugins/router', 'knockout'], function (app, router, ko) {

    var displayName = ko.observable("Search");
    var searchtext = ko.observable("");
    var cansearch = ko.observable(true);

    return {
        displayName: displayName,
        cansearch: cansearch,
        searchtext: searchtext,
        search: function () {
            router.navigate('!search/s=' + searchtext() + '&date=now');
        }
    };

});
