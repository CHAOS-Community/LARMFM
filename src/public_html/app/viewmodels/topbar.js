define(['plugins/router', 'durandal/app', 'viewmodels/wayflogin', 'viewmodels/wayfLogOut', 'mods/portal', 'knockout', 'mods/search'],
    function (router, app, wayflogin, wayfLogOut, portal, ko, searchmod) {

    var cansearch = ko.observable(true);

    return {
    	router: router,
    	isAuthenticated: portal.isAuthenticated,
        loginbtnclick: function(){
            router.navigate('login');
        },
        WayfLogin: function() {
        	app.showDialog(new wayflogin());
        },
        LogOut: function () {

        	if (portal.client.AuthenticationType() == CHAOS.Portal.Client.Wayf.AuthenticationType())
		        app.showDialog(new wayfLogOut());
	        else
	        {
        		CHAOS.Portal.Client.Session.Delete();
		        portal.LoggedOut();
	        }
        },
        cansearch: cansearch,
        searchtext: searchmod.freetext,
        search: function () {
            //searchmod.freetext(searchtext());
            searchmod.navigate();
            //router.navigate('!search/s=' + searchtext() + '&date=now');
        },
        searchKeyboardCmd: function (data, event) {
            if (event.keyCode == 13)
                searchmod.navigate();
            return true;
        }
    };
    });
