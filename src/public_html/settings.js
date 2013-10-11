var Settings = Settings || {};

Settings.brandName = "larm";
Settings.brandModule = "brand/larm";

//Settings.servicePath = "http://api.test.chaos-systems.com";
//Settings.servicePath = "http://api.chaos-systems.com";
Settings.servicePath = "http://api.larm.fm";
Settings.clientGUID = "3D652FD1-33FA-40F7-A440-A942A1317F99";

Settings.accessPointGuid = "00000000-0000-0000-0000-000007000000";

Settings.anonymousUsername = "thfl@dr.dk";
Settings.anonymousPassword = "1234";

Settings.username = "thfl@dr.dk";
Settings.password = "1234";

Settings.startPath = "!search";
Settings.publicPaths = ['AppLoader', 'Login'];

Settings.Search = {
    //filter: "(Type:Schedule OR Type:ScheduleNote)",
    filter: "",
    sortitems: [
        { title: "sorter...", id: "", value: "PubStartDate+asc" },
        { title: "Sendetidspunkt (ældst først)", id: "1", value: "PubStartDate+asc" },
        { title: "Sendetidspunkt (nyeste først)", id: "2", value: "PubStartDate+desc" },
        { title: "Titel (a til z)", id: "3", value: "Title+asc" },
        { title: "Title (z til a)", id: "4", value: "Title+desc" },
        { title: "Antal annotationer (flest først)", id: "5", value: "Annotation-Count+desc" },
        { title: "LARM OCR Parsing (mindst først)", id: "6", value: "OCR-Report_float+asc" },
        { title: "LARM OCR Parsing (højest først)", id: "7", value: "OCR-Report_float+desc" }
    ],
    objecttypefilter: [
        { fid: "0", title: "Alt", value: "" },
        { fid: "1", title: "Radio", value: "Radio" },
        { fid: "2", title: "Programoversigter", value: "Schedule" },
        { fid: "3", title: "Rettelser til programoversigter", value: "ScheduleNote" }
    ],        
            UIViews:
            {
                search: "viewmodels/search",
                //search: "viewmodels/search_sendeplan",
                //searchResult: searchresults
                searchResult: "quicksearchresults"
            },
    viewName: "Search",
    objectTypes: [
        {
            id: 0,
            metadataSchemaGuid: "00000000-0000-0000-0000-0000df820000"
        }
    ],

    indexes: [
        // key
        { key: "m00000000-0000-0000-0000-0000df820000_da_all" }
    ]
};
