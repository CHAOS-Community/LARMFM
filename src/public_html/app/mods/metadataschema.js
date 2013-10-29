define(['mods/xmlmanager'], function (xmlman) {
    
    function getschema(xsd){
        var x2js = new X2JS();
        var dat = {};
        var schema = dat["schema"] = {};
        var jd = x2js.xml_str2json(xsd);
        console.log("#####################");
        xs_schema = jd['schema'];
        parseele(schema,xs_schema['element']);
        console.log("#####################");
        return dat;
    }

    function parseele(ptr, ele){
        if(ele === undefined)
            return;
        
        if(ele["complexType"]!==undefined)
        {
            parsecomplexele(ptr,ele);
            return;
        }
        
        console.log("--- Element");
        console.log(ele);
    }

    function parsecomplexele(prt,ele){
        var complexType = ele["complexType"];
        var sequence = complexType["sequence"];
        console.log("--- Sequence");
        console.log(sequence);
    }

    return {
        getschema : getschema
    };
});


