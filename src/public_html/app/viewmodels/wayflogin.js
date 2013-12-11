﻿define(['plugins/dialog', 'mods/portal', 'jquery'], function (dialog, portal, jquery) {
	var wayflogin = function () {
		this._wayfWindow = null;
		this.CanUseIframe = window && window.navigator && window.navigator.userAgent && (window.navigator.userAgent.indexOf("Chrome") != -1 || window.navigator.userAgent.indexOf("Firefox") != -1) && false;
	};

	wayflogin.prototype.compositionComplete = function (child, parent, settings) {
		if (!this.CanUseIframe) return;

		var frame = jquery(child).find(".LoginFrame")[0];

		var that = this;
		CHAOS.Portal.Client.Wayf.Login(Settings.wayfPath, jquery(child).find(".LoginFrame")[0], function (success) { that.LoginCompleted(success); });
	};

	wayflogin.prototype.OpenWindow = function() {
		var that = this;
		this._wayfWindow = window.open("", "WayfLogin", "width=800,height=800,menubar=no,status=no,toolbar=no,resizable=yes");

		CHAOS.Portal.Client.Wayf.Login(Settings.wayfPath, this._wayfWindow, function(success) { that.LoginCompleted(success); });
	};

	wayflogin.prototype.LoginCompleted = function (success) {
		if (this._wayfWindow != null)
			this._wayfWindow.close();
		
		dialog.close(this);
	};

	return wayflogin;
});