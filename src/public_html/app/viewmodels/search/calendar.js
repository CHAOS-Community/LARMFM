define(['durandal/app', 'plugins/router', 'knockout', 'mods/search'], 
function (app, router, ko, searchmod) {

    var searchtext = ko.observable("");
    var cansearch = ko.observable(true);

    return {
        cansearch: cansearch,
        searchtext: searchtext,
        search: function () {
            router.navigate('!search/s=' + searchtext() + '&date=now');
        },
                clickit: function(){
            searchmod.freetext("thomas");
                }
    };

});


