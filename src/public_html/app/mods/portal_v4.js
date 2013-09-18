define(function () {

    var onAppReadyList = [];

    var isAppReady = false;
    var client = new PortalClient(Settings.servicePath,Settings.clientGUID);
    
    var sessionguid = ''; //readCookie('SessionGUID');
    if(sessionguid == '') {
        client.SessionAcquired().Add(function (sender, data) {
            //TODO: Login with cookies?
            u = Settings.anonymousUsername;
            p = Settings.anonymousPassword;

            client.EmailPassword_Login(function(data)
            {
                if(data.EmailPassword().Results() != null)
                {
                    //data.EmailPassword().Results()[0].GUID;
                    writeCookie('SessionGUID',client.SessionGUID(),1);
                    isAppReady = true;
                    for (var i = 0; i < onAppReadyList.length; i++) {
                        onAppReadyList[i]();
                    }
                    onAppReadyList = [];
                }

            }, u, p);
        
        });
    }
    else
    {
          client.SetSessionGUID(sessionguid,true);  
    }

    function writeCookie(name,value,days) {
        var date, expires;
        if (days) {
            date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires=" + date.toGMTString();
                }else{
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var i, c, ca, nameEQ = name + "=";
        ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
            c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length,c.length);
            }
        }
        return '';
    }

    return {
        client: client,
        isAppReady: isAppReady,
        onAppReady: function (callback) {
            if (isAppReady)
                callback();
            else {
                onAppReadyList.push(callback);
            }
        }
    };
});
