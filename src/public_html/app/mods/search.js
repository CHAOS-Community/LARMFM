// Search Module
define(['knockout', 'factory/object' ], 
function (ko, objfac) {

    var pagesize = ko.observable(20);
    var pageindex = ko.observable(0);
    var freetext = ko.observable("");
    var items = ko.observableArray([]);
    var pagingitems = ko.observableArray([]);
    
    function searchReceived(response)
    {    
        console.log(response);
        items.removeAll();
        for(var i = 0; i < response.Body.Count; i++)
        {
            var r = response.Body.Results[i];
            var oi = new objfac.ObjectItem();
            oi.title = "Title : " + r.Title;
            if(r.Type == "Radio")
                oi.hash = '#!object/id='+r.Id;
            else
                oi.hash = r.Url;
            items.push(oi);
        }
        
        pagingitems.removeAll();
        
        var backcls = "";
        if(pageindex()==0)
            backcls = "disabled";
        
        pagingitems.push({text:"&laquo;", index:0, cssclass:backcls});
        pagingitems.push({text:"1", index:1, cssclass: "active"});
        pagingitems.push({text:"2", index:2, cssclass: ""});
        pagingitems.push({text:"3", index:3, cssclass: ""});
        pagingitems.push({text:"4", index:4, cssclass: ""});
        pagingitems.push({text:"&raquo;", index:5, cssclass: ""});
    }
    
    return {
        items: items,
        pagingitems: pagingitems,
        pageindex: pageindex,
        pagesize: pagesize,
        freetext: freetext,
        
        search: function(){
            CHAOS.Portal.Client.View.Get(Settings.Search.viewName,freetext(),"","",pageindex(),pagesize()).WithCallback(searchReceived);
        }
    };
});


