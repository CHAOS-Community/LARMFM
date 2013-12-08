define(['knockout'], function (ko) {

	var onAppReadyList = [];
	var isAppReady = false;
	var isAuthenticatedObservable = ko.observable(false);
    var client = CHAOS.Portal.Client.Initialize(Settings.servicePath);
	
    client.SessionAcquired().Add(function (session)
    {
        isAppReady = true;
        for (var i = 0; i < onAppReadyList.length; i++) {
            onAppReadyList[i]();
        }
        onAppReadyList = [];

    });
	client.SessionAuthenticated().Add(function() {
		isAuthenticatedObservable(true);
	});

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
