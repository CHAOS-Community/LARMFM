requirejs.config({
    paths: {
        'text': '../lib/require/text',
        'durandal': '../lib/durandal/js',
        'plugins': '../lib/durandal/js/plugins',
        'transitions': '../lib/durandal/js/transitions',
        'knockout': '../lib/knockout/knockout-2.3.0',
        'bootstrap': '../lib/bootstrap/js/bootstrap',
        'jquery': '../lib/jquery/jquery-1.9.1',
        'mods': 'mods/'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
        }
    }
});

define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'mods/portal', 'mods/state', 'knockout', 'mods/localization'],
        function(system, app, viewLocator, portal, state, ko, localization) {
            //>>excludeStart("build", true);
            system.debug(true);
            //>>excludeEnd("build");
            window.locale = 'sv';

            app.title = 'LARM.fm';

            //specify which plugins to install and their configuration
            app.configurePlugins({
                router: true,
                dialog: true,
                widget: {
                    kinds: ['expander']
                }
            });

            // Knockout
            //ko.bindingHandlers.wstext = {
            //    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //        var i = 0;
            //    },
            //    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //        var i = 0;
            //    }
            //};

            // TODO: Setup the chaos portal client and login with anonymous before
            // proceeding.
            portal.onAppReady(onAppReady);

            function onAppReady() {

                for (var i = 0; i < Settings.Search.objectTypes.length; i++)
                {
                    var ot = Settings.Search.objectTypes[i];
                    state.searchMetadataSchemaGuids[ot.id] = ot.metadataSchemaGuid;
                }

//    ko.bindingHandlers.loc = {
//    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//        // This will be called when the binding is first applied to an element
//        // Set up any initial state, event handlers, etc. here
//        alert("Test");
//    },
//    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//        // This will be called once when the binding is first applied to an element,
//        // and again whenever the associated observable changes value.
//        // Update the DOM element based on the supplied values here.
//        alert("Test2");
//    }
//    };

                app.start().then(function() {
                    //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
                    //Look for partial views in a 'views' folder in the root.
                    viewLocator.useConvention();

//          var option = {
//              lng: 'en-US',
//              fallbackLang: 'en',
//              ns: { namespaces: ['app'], defaultNs: 'app' },
//              resGetPath: 'locales/__lng__/__ns__.json'
//          };
//
//          i18n.init(option, function () {
//        //Show the app by setting the root view model for our application.
//                  app.setRoot('shell');
//          });

                    app.setRoot('shell');

                });
            }

        });