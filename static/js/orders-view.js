$(function(){

  var datas= [
    { "id": 1,  "name": "test", "inventory": 123 },
    { "id": 2,  "name": "test1", "inventory": 1234 },
    { "id": 3,  "name": "test2", "inventory": 1235 }
  ];

  var orderData = [];

  getData();

  var template = kendo.template($("#template").html());

  var dataSource = new kendo.data.DataSource({
    data: datas,
    change: function () {
      $("#datas tbody").html(kendo.render(template, this.view()));
    }
  });

  dataSource.read();


  function getData() {
    $.ajax({
      url: '/getOrders',
      type: 'GET',
      success: function(response){
        console.log("respnse" , response);

        var array = mapResults(response);
        for(var i=0; i < array.length; i++){

          aggData(array[i]).then(function(results){
            console.log({"id": row[0], "name": results, "inventory": row[2] });
          });
        }
      },
      error: function(error){
        console.log(error);
      }
    });
  }

  function mapResults(result) {
    var widgets = JSON.parse(result);
    var data = widgets.success
      .replace(/'/g,'')
      .replace(/, /g,',')
      .replace(/L,/g,',')
      .replace(/L\)/g,')')
      .replace(/\(\(/g,'(')
      .replace(/\)\)/g,')')
      .replace(/\),\(/g,")*(");

    var array = data.split('*');
    for(var i=0;i < array.length; i++){
      array[i] = array[i].replace(/\)|\(/g,'').split(',');
    }

    return array;
  }

  function aggData(row) {
    return getName(row[1]);

  }

  function getName(id){
    $.ajax({
      url: '/getWidgetName/' + id,
      type: 'GET',
      success: function(response){
        return mapResults(response)[0][0];
      },
      error: function(error){
        console.log(error);
      }
    });
  }

});