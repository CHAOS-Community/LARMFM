define(['durandal/app','knockout'],function (app, ko) {

    // SchemaItem class ----------------
    var SchemaItem = function () {
        this.self = this;
        this.guid = "";
        this.title = ko.observable("");
        this.count = ko.observable(0);
        this.isactive = ko.observable(false);
        this.cssNo = 1;
        this.cssBtn = ko.observable("");
        this.cssBadge = ko.observable("");
        this.annotations = ko.observableArray([]);
    };
    SchemaItem.prototype.setCss = function (no) {
        this.cssNo = no;
        this.updateCss();
    };
    SchemaItem.prototype.updateCss = function () {
        if (this.isactive()) {
            this.cssBtn("btn btn-small btn-schema" + this.cssNo);
            this.cssBadge("badge pull-right wsobjecttypebatch btn-schema" + this.cssNo + "-badge");
        }
        else {
            this.cssBtn("btn btn-small");
            this.cssBadge("badge pull-right wsobjecttypebatch");
        }
    };
    SchemaItem.prototype.click = function () {
        this.isactive(!this.isactive());
        this.updateCss();
        app.trigger("schema:change", this);
    };
    SchemaItem.prototype.getContent = function (title) {
        //var content = '<div title="' + this.title() + '" style="background-color:rgba(128, 128, 255, 0.2)">&nbsp;' + this.title() + '</div>'
        return '<div title="' + title + '" class="btn-schema' + this.cssNo + '-event">&nbsp;' + title + '</div>'
    };
    // ---------------------------------

    var schemaItems = ko.observableArray([]);

    return {
        SchemaItem: SchemaItem,
        schemaItems: schemaItems,
        addSchemaItem: function (schemaguid,count) {
            var cnt = schemaItems().length;
            var item;
            // already present?
            for (var i = 0; i < schemaItems().length; i++)
                if (schemaItems()[i].guid == schemaguid) {
                    item = schemaItems()[i];
                    break;
                }

            if (item === undefined) {
                item = new SchemaItem();
                schemaItems.push(item);
            }

            item.guid = schemaguid;
            item.title(schemaguid);
            var ci = 0;
            if (item.title() == "d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e"){
                item.title("Comments");
                ci = 1;
            }
            else if (item.title() == "7bb8d425-6e60-9545-80f4-0765c5eb6be6"){
                item.title("Jingles");
                ci = 2;
            }
            else if (item.title() == "c446ad50-f1ea-f642-9361-3f6b56c5f320"){
                item.title("Lydkilde");
                ci = 3;
            }
            else {
                ci = 4;
            }

            item.count(count);
            item.isactive(false);
            item.setCss(ci);
            
        }
    };

});