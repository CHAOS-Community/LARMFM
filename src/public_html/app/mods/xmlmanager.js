define(function () {
    return {
        parseXml: function (xml)
        {
            if (!$.support.cors && window.ActiveXObject) {
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.loadXML(xml);
                xml = xmlDoc;
            }
            return xml;
        },
        //
        toJson: function(arraypaths,xml){
            // Replace . with _ inside tags (inside < and >).
            var xmldata = xml.replace(/([<]+[/a-zA-Z]*)(\.)([/a-zA-Z]*[>]+)/gi, '$1_$3');

            var x2js = new X2JS({ arrayAccessFormPaths: arraypaths });
            var jsdata = x2js.xml_str2json(xmldata);

            return jsdata;
        }
    };
});
