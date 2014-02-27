define(['plugins/dialog', 'mods/portal', 'jquery', 'mods/state'], function (dialog, portal, jquery, state) {
	var wayfLogOut = function () {
		this._wayfWindow = null;
		this.CanUseIframe = window && window.navigator && window.navigator.userAgent && (window.navigator.userAgent.indexOf("Chrome") != -1 || window.navigator.userAgent.indexOf("Firefox") != -1);
	};

	wayfLogOut.prototype.compositionComplete = function (child, parent, settings) {
		if (!this.CanUseIframe) return;

		var that = this;
		CHAOS.Portal.Client.Wayf.LogOut(Settings.wayfPath, jquery(child).find(".LoginFrame")[0], function (success) { that.LogOutCompleted(success); });
	};

	wayfLogOut.prototype.OpenWindow = function () {
		var that = this;
		this._wayfWindow = window.open("", "WayfLogOut", "width=800,height=800,menubar=no,status=no,toolbar=no,resizable=yes");
		var callbackUrl = window.location.protocol + "//" + window.location.host + "/WayfCallback.html";

		CHAOS.Portal.Client.Wayf.LogOut(Settings.wayfPath, this._wayfWindow, function (success) { that.LogOutCompleted(success); }, callbackUrl);
	};

	wayfLogOut.prototype.LogOutCompleted = function (success) {
		if (this._wayfWindow != null)
			this._wayfWindow.close();

		window.location.assign(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "") + window.location.pathname);

		state.isAuthenticated(false);
		dialog.close(this);
	};

	return wayfLogOut;
});