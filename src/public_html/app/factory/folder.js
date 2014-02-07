define(['knockout', 'mods/portal'], function(ko, portal) {

    var FolderItem = function() {
        this.folderID = ko.observable();
        this.level = ko.observable();
        this.title = ko.observable();
        this.hash = ko.observable();
        this.style = ko.observable();
        this.isexpanded = ko.observable(false);
        this.children = ko.observableArray();
        this.isInEditMode = ko.observable(false);
    };

    FolderItem.prototype = function() {
        
        var childfolderReceived = function(response) {
            if (response.Error != null) {
                return;
            }

            //for (var i = 0; i < response.Result.Count; i++) {
            //    var data = response.Result.Results[i];
            //    var fi = new FolderItem();
            //    fi.init(data, this.level() + 1);
            //    this.children.push(fi);
            //}

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
        
        var loadSubFolders = function(){
            CHAOS.Portal.Client.Folder.Get(null, null, this.folderID()).WithCallback(childfolderReceived, this);
        }
        
        var addNewFolder = function(){
           
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
            addNewFolder:addNewFolder,
            mouseevent: mouseevent,
            loadSubFolders:loadSubFolders,
            saveFolderName:saveFolderName,
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



