define(function () {

    var callbacks = [];

    function metadataReceived(data) {
        var r = data.Body.Results[0];
        doCallback(r.Id, r);
    }

    function doCallback(guid, param) {
        var cb = callbacks[guid];
        if (cb !== undefined) {
            while (cb.length > 0) {
                cb.shift()(param);
            }

            if (cb.length == 0)
                delete callbacks[guid];
        }
    }

    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    function pushCallback(guid, callback) {
        if (callbacks[guid] === undefined) {
            callbacks[guid] = [];
        }

        callbacks[guid].push(callback);
    }

    // --- Public properties and methods ---
    return {
        //-------------------------------------------------
        generateGUID: generateGUID,
        //-------------------------------------------------
        getByGuid: function (guid, callback) {

            pushCallback(guid, callback);

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
        },
        //-------------------------------------------------
        createObject: function (callback) {
            var guid = generateGUID();
            pushGuid(guid, callback);

        }
        //-------------------------------------------------
    };
});