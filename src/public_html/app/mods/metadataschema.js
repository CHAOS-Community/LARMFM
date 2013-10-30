define(['mods/xmlmanager'], function (xmlman) {
    
    function getschema(xsd){
        var x2js = new X2JS();
        var jsonschema = {};
        var schema = jsonschema["schema"] = {};

        // Convert string xsd to json
        var xsdjsondata = x2js.xml_str2json(xsd);
        var xs_schema = xsdjsondata['schema'];

        // Assume the next element af <xs:schema> is a <xs_element>
        parseElement(schema, xs_schema['element']);

        return jsonschema;
    }

    function parseElement(ptr, ele){

        // Bail out if the element does not exists.
        if (ele === undefined)
            return;
        
        // Is it a normal element or a complexType?
        if (ele._type !== undefined) {
            // Normal element
        }
        else {
            // ComplexType
            parsecomplexele(ptr, ele);
        }
    }

    function parsecomplexele(ptr,ele){
        var complexType = ele["complexType"];
        var sequence = complexType["sequence"];
        var element = sequence["element"];

        return;
        // bounds?
        var properties = {};
        ptr[getElementName(ele)] = {
            "type": "array", "items": {
                "type": "object",
                "title": getElementName(element),
                "properties": properties
            }
        };

        // Loop through all the elements in this sequence

        //parseElement(properties,)
    }

    function getElementName(ele)
    {
        var n = ele._name;
        return n.replace(".", "_");
    }

    return {
        getschema : getschema
    };
});


