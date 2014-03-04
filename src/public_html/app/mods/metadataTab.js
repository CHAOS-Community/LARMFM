define(["durandal/app","knockout"], function (app, ko) {

    var Tab = function () {
        this.title = "";
        this.id = "";
        this.schemaGuid = "";
        this.isActive = ko.observable(false);
    }
    Tab.prototype.click = function () {
        app.trigger("metadataTab:change", this);
    }

    app.on('metadataTab:change').then(function (tab) {
        for (var i = 0; i < tabs().length; i++) {
            if (tabs()[i] == tab)
                selectTab(tabs()[i]);
            else
                deselectTab(tabs()[i]);
        }
        app.trigger('metadataTab:changed', tab);
    });

    var selectTab = function (tab) {
        activeTab(tab);
        tab.isActive(true);
    }

    var deselectTab = function (tab) {
        if (activeTab() == tab)
            activeTab(null);
        tab.isActive(false);
    }

    var tabs = ko.observableArray();
    var activeTab = ko.observable(null);

    return {
        tabs: tabs,
        activeTab: activeTab,
        add: function (title, id, schemaGuid) {
            var t = new Tab();
            t.title = title;
            t.id = id;
            t.schemaGuid = schemaGuid;
            tabs.push(t);
            if (tabs().length == 1)
                app.trigger("metadataTab:change", t);
        },
        activateTabByGuid: function (schemaGuid) {
            for (var i = 0; i < tabs().length; i++) {
                if (tabs()[i].schemaGuid === schemaGuid) {
                    if (tabs()[i]!==activeTab())
                        app.trigger('metadataTab:change', tabs()[i]);
                }
            }
        }

    }
});