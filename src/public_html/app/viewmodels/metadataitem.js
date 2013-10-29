define(['plugins/router'], function(router) {

    var jsondata = {
        "schema": {
            "field": {
                "type": "string",
                "title": "A field"
            }
        },
        "form": [
            {
                "key": "field"
            },
            {
                "type": "submit",
                "title": "Submit"
            }
        ]
    };

    return {
        router: router,
        compositionComplete: function() {
            console.log("=========================== compositionComplete.");
            $('#form1').jsonForm({
        schema: {
          name: {
            type: 'string',
            title: 'Name',
            required: true
          },
          age: {
            type: 'number',
            title: 'Age'
          }
        },
        value: {
            name: "Thomas",
            age: "44"
                
        },
        onSubmit: function (errors, values) {
          if (errors) {
            $('#res').html('<p>I beg your pardon?</p>');
          }
          else {
            $('#res').html('<p>Hello ' + values.name + '.' +
              (values.age ? '<br/>You are ' + values.age + '.' : '') +
              '</p>');
          }
        }
      });
//            var values = jsondata; //.jsonFormValue();
//            console.log("----------------------------------");
//            console.log(values.greatform);
//            console.log("----------------------------------");
//            $('#result').html('');
//            $('#result').html('<form id="result-form" class="form-vertical"></form>');
//            $('#result-form').jsonForm(values);
        }
    };
});


