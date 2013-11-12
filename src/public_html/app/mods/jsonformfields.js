define(function () {

    JSONForm.fieldTypes['wsstringline'] = {
        template: '<input type="text" style="width:90%;" ' +
          '<%= (fieldHtmlClass ? "class=\'" + fieldHtmlClass + "\' " : "") %>' +
          'name="<%= node.name %>" value="<%= escape(value) %>" id="<%= id %>"' +
            '/>',
        fieldtemplate: true,
        inputfield: true,
        onBeforeRender: function (data, node) {
        },
        onInsert: function (evt, node) {
        }
    };

    JSONForm.fieldTypes['wsstring'] = {
        'template': '<textarea id="<%= id %>" name="<%= node.name %>" ' +
          'style="height:<%= elt.height || "28px" %>;width:<%= elt.width || "100%" %>;"' +
          '<%= (node.disabled? " disabled" : "")%>' +
          '<%= (node.readOnly ? " readonly=\'readonly\'" : "") %>' +
          '<%= (node.schemaElement && node.schemaElement.maxLength ? " maxlength=\'" + node.schemaElement.maxLength + "\'" : "") %>' +
          '<%= (node.schemaElement && node.schemaElement.required ? " required=\'required\'" : "") %>' +
          '<%= (node.placeholder? "placeholder=" + \'"\' + escape(node.placeholder) + \'"\' : "")%>' +
          '><%= value %></textarea>',
        'fieldtemplate': true,
        'inputfield': true,
        onInsert: function (evt, node) {
            var selector = "#" + node.id.replace(/\./g, "\\.");

            var $element = $(selector).get(0);
            if ($element !== undefined) {
                $element.addEventListener('keyup', function () {
                    this.style.overflow = 'hidden';
                    var hgt = this.clientHeight;
                    if (hgt < this.scrollHeight) {
                        this.style.height = (this.scrollHeight + 32) + 'px';
                    }
                }, false);
            }
        }
    };

    JSONForm.fieldTypes['wsstring2'] = {
        template: '<textarea style="width:90%;height:28px;" ' +
  '<%= (fieldHtmlClass ? "class=\'" + fieldHtmlClass + "\' " : "") %>' +
  'name="<%= node.name %>" value="<%= escape(value) %>" id="<%= id %>"' +
    '></textarea>',
        fieldtemplate: true,
        inputfield: true,
        onInsert: function (evt, node) {
            var selector = "#" + node.id.replace(/\./g, "\\.");

            var $element = $(selector).get(0);
            if ($element !== undefined) {
                $element.addEventListener('keyup', function () {
                    this.style.overflow = 'hidden';
                    var hgt = this.clientHeight;
                    if (hgt < this.scrollHeight) {
                        this.style.height = (this.scrollHeight + 32) + 'px';
                    }
                }, false);
            }
        }
    };

    JSONForm.fieldTypes['wsdatetime'] = {
        template: '<input type="text" ' +
          '<%= (fieldHtmlClass ? "class=\'" + fieldHtmlClass + "\' " : "") %>' +
          'name="<%= node.name %>" value="<%= escape(value) %>" id="<%= id %>"' +
            '/>',
        fieldtemplate: true,
        inputfield: true,
        onBeforeRender: function (data, node) {
        },
        onInsert: function (evt, node) {
            //2007-11-21T23:08:00
            var selector = "#" + node.id.replace(/\./g, "\\.");
            $(selector).mask("9999-99-99T99:99:99");
        }
    };

    return {
    };
});


