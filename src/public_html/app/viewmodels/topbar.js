define(['plugins/router'], function (router) {

    return {
        router: router,
        loginbtnclick: function(){
            router.navigate('login');
        }
    };
});


