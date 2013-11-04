define(function () {

    JSONForm.fieldTypes['wsstring'] = {
        template: '<%=node.value%>',
        fieldtemplate: true,
        inputfield: true
    };

    JSONForm.fieldTypes['wsdatetime'] = {
        'template': '<input type="range" ' +
          '<%= (fieldHtmlClass ? "class=\'" + fieldHtmlClass + "\' " : "") %>' +
          'name="<%= node.name %>" value="<%= escape(value) %>" id="<%= id %>"' +
          '<%= (node.disabled? " disabled" : "")%>' +
          ' min=<%= range.min %>' +
          ' max=<%= range.max %>' +
          ' step=<%= range.step %>' +
          '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' +
          ' />',
        'fieldtemplate': true,
        'inputfield': true,
        'onBeforeRender': function (data, node) {
            data.range = {
                min: 1,
                max: 100,
                step: 1
            };
            if (!node || !node.schemaElement) return;
            if (node.formElement && node.formElement.step) {
                data.range.step = node.formElement.step;
            }
            if (typeof node.schemaElement.minimum !== 'undefined') {
                if (node.schemaElement.exclusiveMinimum) {
                    data.range.min = node.schemaElement.minimum + data.range.step;
                }
                else {
                    data.range.min = node.schemaElement.minimum;
                }
            }
            if (typeof node.schemaElement.maximum !== 'undefined') {
                if (node.schemaElement.exclusiveMaximum) {
                    data.range.max = node.schemaElement.maximum + data.range.step;
                }
                else {
                    data.range.max = node.schemaElement.maximum;
                }
            }
        }
    };


    return {
    };
});


