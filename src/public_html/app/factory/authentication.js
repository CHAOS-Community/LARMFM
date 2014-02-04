define(['mods/state'], function (state) {

    var Authenticate = function () {

        this.callback;
    };

    Authenticate.prototype.login = function (email, password, callback) {
        this.callback = callback;
        CHAOS.Portal.Client.EmailPassword.Login(email, password).WithCallbackAndToken(this.logincompleted, this);
    };

    Authenticate.prototype.logincompleted = function (response, context) {
        if (response.Error != null || response.Body.Count == 0) {
            alert("Login failure");
            return;
        }
        else {
            state.userGuid(response.Body.Results[0].Guid);
            state.userEmail(response.Body.Results[0].Email);
            state.userPermissions(response.Body.Results[0].SystemPermissions);
            state.isAuthenticated(true);
            context.callback();
        }
    };

    return {
        Authenticate: Authenticate
    };

});