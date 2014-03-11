define(['knockout', 'mods/portal','mods/objectselector'], function(ko, portal,objectselector) {

    var FolderItem = function() {
        this.folderID = ko.observable();
        this.level = ko.observable();
        this.title = ko.observable();
        this.hash = ko.observable();
        this.style = ko.observable();
        this.isexpanded = ko.observable(false);
        this.children = ko.observableArray();
        this.isBusy = ko.observable(false);
        this.isInEditMode = ko.observable(false);
        
    };

    FolderItem.prototype = function() {
        
        var childfolderReceived = function(response) {
            if (response.Error != null) {
                return;
            }
            this.isBusy(false);

            //for (var i = 0; i < response.Result.Count; i++) {
            //    var data = response.Result.Results[i];
            //    var fi = new FolderItem();
            //    fi.init(data, this.level() + 1);
            //    this.children.push(fi);
            //}
            this.children.removeAll();
            setTimeout($.proxy(function() {
                for (var i = 0; i < response.Body.Count; i++) {
                    var data = response.Body.Results[i];
                    var fi = new FolderItem();
                    fi.init(data, this.level() + 1);
                    this.children.push(fi);
                }
            }, this), 0);

        }

        var init = function(data, tlevel) {
            this.title(data.Name);
            this.hash = '#!search/fid=' + data.ID;
            this.level(tlevel);
            
            this.style("margin: 0px 0px 0px " + (20 * tlevel) + "px");
            this.folderID(data.ID);
            this.loadSubFolders();
            
        }
        
        var addSelectedObjectsToFolder = function(){
            alert("add " + objectselector.items() + " to " + this.folderID());
            for(var i=0; i<objectselector.items().length; i++){
                
                CHAOS.Portal.Client.Link.Create(objectselector.items()[i],this.folderID());
            }
           
            
        }
        
        
        var hasobjectsbeenselected = ko.computed(function(){
            return objectselector.items().length > 0;
        })
        
        var loadSubFolders = function(){
            this.isBusy(true);
            CHAOS.Portal.Client.Folder.Get(null, null, this.folderID()).WithCallback(childfolderReceived, this);
        }
        
        var addSubFolder = function(){
            this.isBusy(true);
            this.isexpanded(true);
            CHAOS.Portal.Client.Folder.Create(null,"New folder",this.folderID(),1).WithCallback(loadSubFolders, this);
        }
        
        var saveFolderName = function(){
           
            CHAOS.Portal.Client.Folder.Update(this.folderID(), this.title())
        }

        var mouseevent = function(data, event) {
            if (event.type == 'mouseover' || event.type == 'mouseout')
                $(event.currentTarget).toggleClass('folderitemover');
        }
        
        return {
            init: init,
            hasobjectsbeenselected:hasobjectsbeenselected,
            addSubFolder:addSubFolder,
            mouseevent: mouseevent,
            loadSubFolders:loadSubFolders,
            saveFolderName:saveFolderName,
            addSelectedObjectsToFolder:addSelectedObjectsToFolder,
            toggleexpand: function() {
                this.isexpanded(!this.isexpanded());
            },
            toggleeditmode: function() {
                this.isInEditMode(!this.isInEditMode());
            }
        };
    }();


    /*======================================================*/

    //var ctor = function () {
    //    this.title = ko.observable();
    //    this.hash = ko.observable();
    //    this.children = ko.observableArray();
    //}

    //ctor.prototype.childfolderReceived = function () {
    //    var childfolderReceived = function (response) {
    //        if (response.Error != null) {
    //            return;
    //        }

    //        for (var i = 0; i < response.Result.Count; i++) {
    //            var data = response.Result.Results[i];
    //            var fi = new FolderItem();
    //            fi.init(data);
    //            this.children.push(fi);
    //        }
    //    }
    //};

    //ctor.prototype.init = function (data) {
    //    this.title = data.Name;
    //    this.hash = '#/objectsview/fid=' + data.ID;

    //    CHAOS.Portal.Client.Folder.Get(null, null, data.ID).WithCallback(childfolderReceived, this);

    //};

    return {
        FolderItem: FolderItem
    };
});



