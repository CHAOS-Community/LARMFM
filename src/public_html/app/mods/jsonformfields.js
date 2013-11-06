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


