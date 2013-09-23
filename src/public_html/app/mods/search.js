// Search Module
define(['knockout', 'factory/object' ], 
function (ko, objfac) {

    var freetext = ko.observable("");
    var items = ko.observableArray([]);
    var pagingitems = ko.observableArray([]);
    
    function searchReceived(response)
    {        
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
        pagingitems.push("0");
        pagingitems.push("1");
        pagingitems.push("2");
    }
    
    return {
        items: items,
        pagingitems: pagingitems,
        freetext: freetext,
        search: function(){
            CHAOS.Portal.Client.View.Get(Settings.Search.viewName,freetext(),"","",0,20).WithCallback(searchReceived);
        }
    };
});


