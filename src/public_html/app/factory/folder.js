define(['knockout', 'mods/portal'], function(ko, portal) {

    var FolderItem = function() {
        this.level = ko.observable();
        this.title = ko.observable();
        this.hash = ko.observable();
        this.style = ko.observable();
        this.isexpanded = ko.observable(false);
        this.children = ko.observableArray();
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
            this.title = data.Name;
            this.hash = '#!search/fid=' + data.ID;
            this.level(tlevel);

            this.style("margin: 0px 0px 0px " + (20 * tlevel) + "px");

            CHAOS.Portal.Client.Folder.Get(null, null, data.ID).WithCallback(childfolderReceived, this);
        }

        var mouseevent = function(data, event) {
            if (event.type == 'mouseover' || event.type == 'mouseout')
                $(event.currentTarget).toggleClass('folderitemover');
        }


        return {
            init: init,
            mouseevent: mouseevent,
            toggleexpand: function() {
                this.isexpanded(!this.isexpanded());
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



