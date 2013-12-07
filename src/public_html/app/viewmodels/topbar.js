define(['plugins/router', 'durandal/app', 'viewmodels/wayflogin', 'mods/portal'], function (router, app, wayflogin, portal) {
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
	        app.showMessage("Log out not implmented", "Log out");
        }
    };
});