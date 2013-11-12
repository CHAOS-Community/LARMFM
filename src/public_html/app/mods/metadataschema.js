define(['mods/xmlmanager'], function (xmlman) {
    
    function loadxmlschemas() {
        setupMetadataSchemas();
        CHAOS.Portal.Client.MetadataSchema.Get().WithCallback(xmlSchemasReceived);
    }

    function xmlSchemasReceived(response) {
        for (var i = 0; i < response.Body.Count; i++) {
            var r = response.Body.Results[i];
        }
    }

    // ========================================================================

    function setupMetadataSchemas() {
        var ms = Settings.MetadataSchemas;
        for (var i = 0; i < ms.length; i++) {
            if (ms[i].schemajson === null) {
                ms[i].schemajson = xmlschematojsonschema(ms[i].schemaxml, ms[i].arraypaths);
            }
        }
    }

    // ========================================================================

    function getMetadataSchemaByGuid(guid) {
        var ms = Settings.MetadataSchemas;
        for (var i = 0; i < ms.length; i++) {
            if (ms[i].guid == guid) {
                return ms[i];
            }
        }
        return null;
    }

    // ========================================================================

    // ========================================================================

    function xmlschematojsonschema(xsd, arraypaths) {
        var x2js = new X2JS();
        var jsonschema = {};
        var schema = jsonschema["schema"] = {};

        // Convert string xsd to json
        var xsdjsondata = x2js.xml_str2json(xsd);
        var xs_schema = xsdjsondata['schema'];

        // Assume the next element af <xs:schema> is a <xs_element>
        parseElement(schema, xs_schema['element'], arraypaths, null);

        return jsonschema;
    }

    function parseElement(ptr, ele, arraypaths, parent) {

        // Bail out if the element does not exists.
        if (ele === undefined)
            return;
        
        // Is it a normal element or a complexType?
        if (ele._type !== undefined) {
            // Normal element
            if (ele._maxOccurs !== undefined) {
                var itemsptr = itemsptr = createArray(ptr, ele, arraypaths, parent);
                itemsptr["title"] = ele._name;
                itemsptr["type"] = getElementType(ele);
            }
            else
                ptr[getElementName(ele)] = { title: ele._name, type: getElementType(ele) };
        }
        else {
            // ComplexType (object)
            parsecomplexele(ptr, ele, arraypaths, parent);
        }
    }

    function parsecomplexele(ptr, ele, arraypaths, parent) {

        var itemsptr = {};
        // Is it an array or object?
        if (ele._maxOccurs !== undefined) {
            // Array
            itemsptr = createArray(ptr, ele, arraypaths, parent);
            itemsptr["title"] = ele._name;
            itemsptr["type"] = "object";
            var props = {};
            itemsptr["properties"] = props;
            itemsptr = props;
            parent = null;
        }
        else {
            // Create object
            parent = getElementName(ele);
            ptr[parent] = {
                title: ele._name, type: "object", properties: itemsptr
            };
        }

        // Only one element or array of elements?
        var seqelm = null;
        if (ele.complexType.sequence !== undefined)
            seqelm = ele.complexType.sequence.element;
        else if (ele.complexType.complexContent.extension.sequence !== undefined)
            seqelm = ele.complexType.complexContent.extension.sequence.element;
        else
            return;

        if (seqelm.length === undefined) {
            parseElement(itemsptr, seqelm, arraypaths, parent);
        }
        else {
            var els = seqelm;
            for(var i = 0; i < els.length; i++)
                parseElement(itemsptr, els[i], arraypaths, parent);
        }
    }

    function getElementName(ele)
    {
        var n = ele._name.replace(/\./gi, "_");
        return n;
    }

    function getElementType(ele) {
        var pf = ele.__prefix + ":";

        if (ele._type == pf + "dateTime")
            return "wsdatetime";

        return "wsstring";
    }

    function createArray(ptr, ele, arraypaths, parent) {
        var itemsptr = {};
        var p = ptr[getElementName(ele)] = { type: "array", items: itemsptr };

        arraypaths.push(new RegExp(parent,"gi"));

        // fx _maxOccurs = "unbounded", _minOccurs = "0"
        if (ele._minOccurs !== undefined)
            p["minItems"] = parseInt(ele._minOccurs,10);
        if (ele._maxOccurs !== undefined) {
            if (ele._maxOccurs != "unbounded") {
                p["maxItems"] = parseInt(ele._maxOccurs,10);
            }
        }

        return itemsptr;
    }

    return {
        loadxmlschemas: loadxmlschemas,
        setupMetadataSchemas: setupMetadataSchemas,
        getMetadataSchemaByGuid: getMetadataSchemaByGuid,
        xmlschematojsonschema: xmlschematojsonschema
    };
});


