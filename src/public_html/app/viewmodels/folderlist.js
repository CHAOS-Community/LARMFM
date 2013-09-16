define(['durandal/app', 'mods/portal', 'mods/state', 'factory/folder', 'knockout'],
    function (app, portal, state, ffac, ko) {

    var items = ko.observableArray();
    function folderReceived(response) {

        setTimeout($.proxy(function () {
        for (var i = 0; i < response.MCM().Results().length; i++)
        {
            var data = response.MCM().Results()[i];
            var fi = new ffac.FolderItem();
            fi.init(data,0);
            items.push(fi);
        }
        }, this), 0);
    }

    return {
        title: 'Folders',
        items: items,
        attached: function () {
            //Folder_Get: function(callback, id, folderTypeID, parentID)
            portal.client.Folder_Get(folderReceived,null,null,null);            
        }
    };
});

