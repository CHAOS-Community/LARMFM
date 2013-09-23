// Search View
define(['durandal/app', 'knockout', 'mods/search', 'mods/state'], 
function (app, ko, search, state) {
        
    var name = ko.observable();
        
    return {
        items: search.items,
        pagingitems: search.pagingitems,
        name: name,
        userEmail: "thfl@dr.dk",
        title: "Search Panel",
        activate: function (param) {
        
            if (param != undefined)
            {
                var s = state.getParamByName('s', param);
                search.freetext(s);
                search.search();
            }       
        },
         // http://durandaljs.com/documentation/Hooking-Lifecycle-Callbacks/       
        compositionComplete: function () {
            $("#SearchField").focus();
        },
        pagingclick: function(){

        }        
    };
});
