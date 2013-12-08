define(['plugins/dialog', 'mods/portal', 'jquery'], function (dialog, portal, jquery) {
	var wayflogin = function () {
		
	};

	wayflogin.prototype.compositionComplete = function (child, parent, settings) {
		var that = this;
		CHAOS.Portal.Client.Wayf.Login(Settings.wayfPath, jquery(child).find(".LoginFrame")[0], function (success) { that.LoginCompleted(success); });
	};

	wayflogin.prototype.LoginCompleted = function(success) {
		dialog.close(this);
	};

	return wayflogin;
});