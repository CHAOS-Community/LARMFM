define(['plugins/router','mods/portal','mods/state','knockout'], function (router, portal, state, ko) {

    var email = ko.observable("");
    var password = ko.observable("");
    var canEdit = ko.observable(true);
    var invalidCredentials = ko.observable(false);

    function sessionAuthenticated(response) {
        //alert("AUTH=" + response);
                
        if (response.Error != null || response.Body.Count == 0) {
            alert("Login failure");
            return;
        }
        else {
            state.userGuid(response.Body.Results[0].Guid);
            state.userEmail(response.Body.Results[0].Email);
            state.userPermissions(response.Body.Results[0].SystemPermissions);
            state.isAuthenticated(true);
            if (state.lastRedirectedFromURL() != null) {
                router.navigate(state.lastRedirectedFromURL());
            } else {
                router.navigate('' + Settings.startPath);
            }
        }
    }

    return {

        Email: email,
        Password: password,
        CanEdit: canEdit,
        InvalidCredentials: invalidCredentials,

        servicePath: Settings.ServicePath,

        Login: function(){
            canEdit = false;
            invalidCredentials = false;
            CHAOS.Portal.Client.EmailPassword.Login(email(), password()).WithCallback(sessionAuthenticated);
        },

        activate: function () {
            email(Settings.username);
            password(Settings.password);
            var len = router.routes.length, ele = null;
            for(var i = 0; i < len; i++)
            {
                ele = router.routes[i];

                if (ele.moduleId == 'viewmodels/test')
                {
                    ele.visible = true;
                    //router.activate(ele);
                    //router.configureRoute(ele);
                    //router.visibleRoutes.push(ele);
                }
            }
        },
        attached: function () {
            $("#Email").focus();
        }

    };

});
