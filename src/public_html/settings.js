var Settings = Settings || {};

Settings.brandName = "larm";
Settings.brandModule = "brand/larm";

//Settings.servicePath = "http://api.test.chaos-systems.com";
Settings.servicePath = "http://api.chaos-systems.com";
Settings.clientGUID = "3D652FD1-33FA-40F7-A440-A942A1317F99";

Settings.anonymousUsername = "thfl@dr.dk";
Settings.anonymousPassword = "1234";

Settings.username = "thfl@dr.dk";
Settings.password = "1234";

Settings.startPath = "search";
Settings.publicPaths = ['AppLoader', 'Login'];

Settings.Search = {
    viewName: "glomexprogram",
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
