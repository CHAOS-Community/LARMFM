define(function () {

    var onAppReadyList = [];

    var isAppReady = false;
    var client = CHAOS.Portal.Client.Initialize(Settings.servicePath);
    client.SessionAcquired().Add(function (session)
    {
        isAppReady = true;
        for (var i = 0; i < onAppReadyList.length; i++) {
            onAppReadyList[i]();
        }
        onAppReadyList = [];

    });

    return {
        client: client,
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
