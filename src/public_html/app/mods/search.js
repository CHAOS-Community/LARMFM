define(['knockout', 'factory/object' ], 
function (ko, objfac) {

    var freetext = ko.observable("");
    var items = ko.observableArray([]);
    
    function searchReceived(response)
    {        
        items.removeAll();
        for(var i = 0; i < response.Body.Count; i++)
        {
            var r = response.Body.Results[i];
            var oi = new objfac.ObjectItem();
            oi.title = "Title : " + r.Title;
            oi.hash = '#!object/id='+r.Id;
            items.push(oi);
        }
    }
    
    return {
        items: items,
        freetext: freetext,
        search: function(){
            CHAOS.Portal.Client.View.Get(Settings.Search.viewName,freetext(),"","",0,20).WithCallback(searchReceived);
        }
    };
});


