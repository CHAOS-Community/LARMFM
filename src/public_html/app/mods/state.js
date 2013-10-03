define(function () {
    
    var userGuid;
    var userEmail;
    var userPermissions = 0;

    var hasSession = false;
    var isAuthenticated = false;

    var lastRedirectedFromURL;

    var searchMetadataSchemaGuids = [];

    return {
        userGuid: userGuid,
        userEmail: userEmail,
        userPermissions: userPermissions,
        hasSession: hasSession,
        isAuthenticated: isAuthenticated,
        searchMetadataSchemaGuids: searchMetadataSchemaGuids,
        lastRedirectedFromURL: lastRedirectedFromURL
        
    };
});
