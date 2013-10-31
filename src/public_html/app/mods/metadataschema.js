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
            if (ele._maxOccurs !== undefined) {
                var itemsptr = itemsptr = createArray(ptr, ele);
                itemsptr["title"] = ele._name;
                itemsptr["type"] = getElementType(ele);
            }
            else
                ptr[getElementName(ele)] = { title: ele._name, type: getElementType(ele) };
        }
        else {
            // ComplexType (object)
            parsecomplexele(ptr, ele);
        }
    }

    function parsecomplexele(ptr,ele){
        var complexType = ele["complexType"];
        var sequence = complexType["sequence"];
        var element = sequence["element"];

        var itemsptr = {};
        // Is it an array or object?
        if (ele._maxOccurs !== undefined) {
            // Array
            itemsptr = createArray(ptr, ele);
            itemsptr["title"] = ele._name;
            itemsptr["type"] = "object";
            var props = {};
            itemsptr["properties"] = props;
            itemsptr = props;
        }
        else {
            // Create object
            ptr[getElementName(ele)] = {
                title: ele._name, type: "object", properties: itemsptr
            };
        }

        // Only one element or array of elements?
        if (ele.complexType.sequence.element.length === undefined) {
            parseElement(itemsptr, ele.complexType.sequence.element);
        }
        else {
            var els = ele.complexType.sequence.element;
            for(var i = 0; i < els.length; i++)
                parseElement(itemsptr, els[i]);
        }
    }

    function getElementName(ele)
    {
        var n = ele._name;
        return n.replace(".", "_");
    }

    function getElementType(ele) {
        return "string";
    }

    function createArray(ptr, ele) {
        var itemsptr = {};
        var p = ptr[getElementName(ele)] = { type: "array", items: itemsptr };

        // fx _maxOccurs = "unbounded", _minOccurs = "0"
        if (ele._minOccurs !== undefined)
            p["minItems"] = parseInt(ele._minOccurs);
        if (ele._maxOccurs !== undefined) {
            if (ele._maxOccurs != "unbounded") {
                p["maxItems"] = parseInt(ele._maxOccurs);
            }
        }

        return itemsptr;
    }

    return {
        getschema : getschema
    };
});


