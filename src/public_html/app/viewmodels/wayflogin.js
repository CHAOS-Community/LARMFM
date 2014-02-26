define(['plugins/dialog', 'mods/portal', 'jquery','mods/state'], function (dialog, portal, jquery, state) {
	var wayflogin = function () {
		this._wayfWindow = null;
		this.CanUseIframe = window && window.navigator && window.navigator.userAgent && (window.navigator.userAgent.indexOf("Chrome") != -1 || window.navigator.userAgent.indexOf("Firefox") != -1);
	};

	wayflogin.prototype.compositionComplete = function (child, parent, settings) {
		if (!this.CanUseIframe) return;

		var that = this;
		CHAOS.Portal.Client.Wayf.LogIn(Settings.wayfPath, jquery(child).find(".LoginFrame")[0], function (success) { that.LoginCompleted(success); });
	};

	wayflogin.prototype.OpenWindow = function() {
		var that = this;
		this._wayfWindow = window.open("", "WayfLogin", "width=800,height=800,menubar=no,status=no,toolbar=no,resizable=yes");
		var callbackUrl = window.location.protocol + "//" + window.location.host + "/WayfCallback.html";

		CHAOS.Portal.Client.Wayf.LogIn(Settings.wayfPath, this._wayfWindow, function (success) { that.LoginCompleted(success); }, callbackUrl);
	};

	wayflogin.prototype.LoginCompleted = function (success) {
		if (this._wayfWindow != null)
			this._wayfWindow.close();
		
		state.isAuthenticated(true);
		dialog.close(this);
	};

	return wayflogin;
});