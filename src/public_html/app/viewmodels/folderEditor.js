define(['plugins/dialog', 'mods/portal', 'jquery','mods/state'], function (dialog, portal, jquery, state) {
	var folderEditor = function () {
	
        };

	folderEditor.prototype.compositionComplete = function (child, parent, settings) {
         
         
	};
        
        folderEditor.prototype.close = function(){
            dialog.close(this);
        }
	
	return folderEditor;
});