define(['plugins/router', 'durandal/app', 'viewmodels/wayflogin', 'viewmodels/wayfLogOut', 'mods/portal'], function (router, app, wayflogin, wayfLogOut, portal) {
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

        	if (portal.AuthenticationType() == CHAOS.Portal.Client.Wayf.AuthenticationType())
		        app.showDialog(new wayfLogOut());
	        else
	        {
        		CHAOS.Portal.Client.Session.Delete();
        		window.location.assign(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname);
	        }
        }
    };
});