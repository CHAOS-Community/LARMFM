define(['knockout', 'mods/store'], function (ko, store) {

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
        triggerAppReady();
    }

    client.SessionAcquired().Add(function (session)
    {
        var sessionGuid = session.Guid;
        store.cookie("sessionGuid", sessionGuid, 1);

        triggerAppReady();

    });
	client.SessionAuthenticated().Add(function() {
		isAuthenticatedObservable(true);
	});

	function triggerAppReady(){
	    isAppReady = true;
	    for (var i = 0; i < onAppReadyList.length; i++) {
	        onAppReadyList[i]();
	    }
	    onAppReadyList = [];
	}

    return {
    	client: client,
    	isAuthenticated: isAuthenticatedObservable,
        isAppReady: isAppReady,
        onAppReady: function (callback) {
            if (isAppReady)
                callback();
            else {
                onAppReadyList.push(callback);
            }
        }
    };
});
