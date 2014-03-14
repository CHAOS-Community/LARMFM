define(['plugins/dialog', 'mods/portal', 'jquery','mods/state','mods/objectselector','knockout'], function (dialog, portal, jquery, state,objectSelector,ko) {
	
    var addObjectsToFolderTool = function (folderViewModel) {
        this.folderViewModel = folderViewModel;           
    };
        
    addObjectsToFolderTool.prototype.users = ko.observableArray();
    addObjectsToFolderTool.prototype.users.push({
        "name":"Thomas Lynge"
    });
    addObjectsToFolderTool.prototype.users.push({
        "name":"Peter Overgaard"
    });
    addObjectsToFolderTool.prototype.users.push({
        "name":"Martin Luckmann"
    });
        
    addObjectsToFolderTool.prototype.compositionComplete = function (child, parent, settings) {
         
         
    };
        
    addObjectsToFolderTool.prototype.close = function(){
        dialog.close(this);
    }
	
    return addObjectsToFolderTool;
});