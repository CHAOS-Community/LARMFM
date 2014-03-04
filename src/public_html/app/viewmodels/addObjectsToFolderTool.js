define(['plugins/dialog', 'mods/portal', 'jquery','mods/state','mods/objectselector'], function (dialog, portal, jquery, state,objectSelector) {
	
        var addObjectsToFolderTool = function () {
            objectSelector.getItems();
        };

	addObjectsToFolderTool.prototype.compositionComplete = function (child, parent, settings) {
         
         
	};
        
        addObjectsToFolderTool.prototype.close = function(){
            dialog.close(this);
        }
	
	return addObjectsToFolderTool;
});