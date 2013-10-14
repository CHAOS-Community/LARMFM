define(['knockout'], function (ko) {
    
    var userGuid = ko.observable();
    var userEmail = ko.observable();
    var userPermissions = ko.observable(0);

    var hasSession = ko.observable(false);
    var isAuthenticated = ko.observable(false);

    var lastRedirectedFromURL = ko.observable();

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
