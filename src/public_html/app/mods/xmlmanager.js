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
        }
    };
});
