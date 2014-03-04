define(['knockout', 'mods/store', 'factory/authentication'], function (ko, store, authentication) {

	var onAppReadyList = [];
	var isAppReady = false;
	var isAuthenticatedObservable = ko.observable(false);

	var sessionGuid = store.cookie("sessionGuid");
	var client;
    if(sessionGuid == null)
	    client = CHAOS.Portal.Client.Initialize(Settings.servicePath);
    else {
        client = CHAOS.Portal.Client.Initialize(Settings.servicePath, null, false);
        client.UpdateSession({ Guid: sessionGuid });
        client.SetSessionAuthenticated("Preauthenticated");
        isAuthenticatedObservable(client.IsAuthenticated());
        triggerAppReady();
    }

    client.SessionAcquired().Add(function (session)
    {
        // Autologin
        var auth = new authentication.Authenticate();
        auth.login("thfl@dr.dk", "1234", triggerAppReadyAfterLogin);
		 //triggerAppReady();
    });
    client.SessionAuthenticated().Add(function () {
    	store.cookie("sessionGuid", client.GetCurrentSession().Guid, 0);
		isAuthenticatedObservable(true);
	});

	function triggerAppReadyAfterLogin() {
	    triggerAppReady();
	}

	function triggerAppReady(){
	    isAppReady = true;
	    for (var i = 0; i < onAppReadyList.length; i++) {
	        onAppReadyList[i]();
	    }
	    onAppReadyList = [];
	}

	function loggedOut()
	{
		store.cookieDelete("sessionGuid", null, 0);
		isAuthenticatedObservable(false);

		window.location.assign(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname);
	}

    return {
    	client: client,
    	isAuthenticated: isAuthenticatedObservable,
    	isAppReady: isAppReady,
    	LoggedOut: loggedOut,
        onAppReady: function (callback) {
            if (isAppReady)
                callback();
            else {
                onAppReadyList.push(callback);
            }
        }
    };
});
