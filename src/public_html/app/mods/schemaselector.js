define(['knockout'],function (ko) {

    // SchemaItem class ----------------
    var SchemaItem = function () {
        this.self = this;
        this.title = "";
        this.count = 0;
        this.isactive = false;
        this.cssNo = 1;
        this.cssBtn = ko.observable("");
        this.cssBadge = ko.observable("");
    };
    SchemaItem.prototype.setCss = function (no) {
        this.cssNo = no;
        this.updateCss();
    };
    SchemaItem.prototype.updateCss = function () {
        if (this.isactive) {
            this.cssBtn("btn btn-small btn-schema" + this.cssNo);
            this.cssBadge("badge pull-right wsobjecttypebatch btn-schema" + this.cssNo + "-badge");
        }
        else {
            this.cssBtn("btn btn-small");
            this.cssBadge("badge pull-right wsobjecttypebatch");
        }
    };
    SchemaItem.prototype.click = function () {
        this.isactive = !this.isactive;
        this.updateCss();
    };
    // ---------------------------------

    var schemaItems = ko.observableArray([]);

    return {
        SchemaItem: SchemaItem,
        schemaItems: schemaItems,
        addSchemaItem: function (schemaguid,count) {
            var cnt = schemaItems().length;
            var item = new SchemaItem();
            item.title = schemaguid;
            item.count = count;
            item.isactive = count > 0;
            item.setCss(cnt + 1);
            schemaItems.push(item);
        }
    };

});