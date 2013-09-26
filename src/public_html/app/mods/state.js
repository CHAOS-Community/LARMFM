define(function () {
    
    var userGuid;
    var userEmail;
    var userPermissions = 0;

    var hasSession = false;
    var isAuthenticated = false;

    var lastRedirectedFromURL;

    var searchMetadataSchemaGuids = [];

    function getParamByName(name, str) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec("?"+str);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    return {
        userGuid: userGuid,
        userEmail: userEmail,
        userPermissions: userPermissions,
        hasSession: hasSession,
        isAuthenticated: isAuthenticated,
        searchMetadataSchemaGuids: searchMetadataSchemaGuids,
        lastRedirectedFromURL: lastRedirectedFromURL,
        
        getParamByName: getParamByName

        
    };
});
