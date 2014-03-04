define(['durandal/app', 'mods/portal', 'mods/state', 'factory/folder', 'knockout'],
    function (app, portal, state, ffac, ko) {

        var items = ko.observableArray();
        var authsub = null;

        if(state.isAuthenticated()){
            loadfolders();
        }
        else{
            authsub = state.isAuthenticated.subscribe(function(val){
                if(val===true){
                    loadfolders();
                    authsub.dispose();
                } 
            });
        }
        
        
        function loadfolders(){
            CHAOS.Portal.Client.Folder.Get().WithCallback(folderReceived);        
        }
    
        function folderReceived(response) {

            if (response.Error != null)
            {
                return;
            }

            setTimeout($.proxy(function () {
                for (var i = 0; i < response.Body.Count; i++)
                {
                    var data = response.Body.Results[i];
                    var fi = new ffac.FolderItem();
            
                    fi.init(data,0);
                    items.push(fi);
                }
            }, this), 0);
        }

        return {
            title: 'Folders',
            items: items,
            userEmail: state.userEmail,
            attached: function () {
            }
        };
    });

