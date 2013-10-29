define(['mods/xmlmanager'], function (xmlman) {
    
    function getschema(xsd){
        var x2js = new X2JS();
        var dat = {};
        var schema = dat["schema"] = {};
        var jd = x2js.xml_str2json(xsd);
        console.log("#####################");
        xs_schema = jd['schema'];
        parseele(schema,xs_schema['elementt']);
        console.log("#####################");
        return dat;
    }

    function parseele(ptr, ele){
        if(ele === undefined)
            return;
        console.log(ele);
    }

    return {
        getschema : getschema
    };
});


