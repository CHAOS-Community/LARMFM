define(function () {

    var callbacks = [];

    function metadataReceived(data) {
        var r = data.Body.Results[0];

        var cb = callbacks[r.Id];
        if ( cb !== undefined) {
            while (cb.length > 0) {
                cb.shift()(r);
            }

            if(cb.length == 0)
                delete callbacks[r.Id];
        }
    }

    return {
        getByGuid: function (guid, callback) {

            if (callbacks[guid] === undefined) {
                callbacks[guid] = [];
            }

            callbacks[guid].push(callback);

            // Object.Get
            // ---------------------------------------------------------
            // objectGuids,accessPointGuid,
            // includeMetadata, includeFiles, includeObjectRelations, 
            // includeFolders, includeAccessPoints, pageSize, pageIndex, 
            // serviceCaller
            var guids = [];
            guids.push(guid);
            CHAOS.Portal.Client.Object.Get(
                guids, Settings.accessPointGuid,
                true, true, true,
                false, false, 1, 0,
                null).WithCallback(metadataReceived);
        }
    };
});