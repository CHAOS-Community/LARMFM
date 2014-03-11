define(['knockout','mods/state'], function (ko, state) {

    // Parameters:
    //
    // <div data-bind="visible: name && city, reshtml: { key: 'welcome', params: { name: name, city: city } }">			
    //
    // welcome: {
    //        sv: 'Hej <strong>#name</strong>! Du bor i #city.',
    //        en: 'Hello <strong>#name</strong>! You live in #city.'
    //}

    ko.bindingHandlers.restext = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var text = getLocalizedText(ko.utils.unwrapObservable(valueAccessor()));
            ko.bindingHandlers.text.update(
				element,
				function () { return text; },
				allBindingsAccessor,
				viewModel,
				context);
        }
    };

    ko.bindingHandlers.reshtml = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var text = getLocalizedText(ko.utils.unwrapObservable(valueAccessor()));
            ko.bindingHandlers.html.update(
				element,
				function () { return text; },
				allBindingsAccessor,
				viewModel,
				context);
        }
    };

    ko.bindingHandlers.reshref = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var text = getLocalizedText(ko.utils.unwrapObservable(valueAccessor()));
            ko.bindingHandlers.attr.update(
				element,
				function () { return { href: text }; },
				allBindingsAccessor,
				viewModel,
				context);
        }
    };

    ko.bindingHandlers.ressrc = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var text = getLocalizedText(ko.utils.unwrapObservable(valueAccessor()));
            ko.bindingHandlers.attr.update(
				element,
				function () { return { src: text }; },
				allBindingsAccessor,
				viewModel,
				context);
        }
    };

    ko.bindingHandlers.resattr = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) {
            var json = ko.utils.unwrapObservable(valueAccessor());
            for (var attr in json) {
                var text = getLocalizedText(json[attr]);
                ko.bindingHandlers.attr.update(
					element,
					function () { var x = {}; x[attr] = text; return x; },
					allBindingsAccessor,
					viewModel,
					context);
            }
        }
    };

    function getLocalizedText(binding) {
        if (typeof resources === "undefined") {
            throw "ko.localationbinding.getLocalizedText: resources object is not defined";
        }

        //if (typeof locale === "undefined") {
        //    throw "ko.localationbinding.getLocalizedText: locale object is not defined";
        //}

        var locale = state.locale();

        // Accept both restext: 'mytext' and restext: { key: 'mytext' }
        if (Object.prototype.toString.call(binding) === '[object String]') {
            binding = { key: binding };
        }

        var key = binding.key;
        var item = resources[key];
        if (!item) {
            return key;
            //throw "ko.localationbinding.getLocalizedText: Could not find key '" + key + "'.";
        }

        // Get text for locale, fallback to 'default' key or return an empty string if not text is present.
        var text = item[locale] || item['default'] || "";

        // Handle placeholders, where the localized text can be 'Hello #firstName!'. 
        // For parameterized text the binding will look like restext: { key: 'hello', params: { firstName: firstNameObservable } }
        if (binding.params) {
            for (var replaceKey in binding.params) {
                var replacement = binding.params[replaceKey];
                if (typeof replacement === "function") {
                    replacement = ko.utils.unwrapObservable(replacement());
                }
                text = text.replace("#" + replaceKey, replacement);
            }
        }

        return text;
    }
    ko.bindingHandlers.restext.getText = getLocalizedText;


    return {
        text: function (key, params) {

            if (params) {
                return getLocalizedText({ key: key, params: params });
            }

            return getLocalizedText({ key: key });
        }
    };
});