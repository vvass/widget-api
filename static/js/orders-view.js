$(function(){

  var datas= [
    { "id": 1,  "name": "test", "inventory": 123 },
    { "id": 2,  "name": "test1", "inventory": 1234 },
    { "id": 3,  "name": "test2", "inventory": 1235 }
  ];

  var orderData = [], names = [];

  getData();

  var template = kendo.template($("#template").html());

  var dataSource = new kendo.data.DataSource({
    data: datas,
    change: function () {
      $("#datas tbody").html(kendo.render(template, this.view()));
    }
  });



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

  function getData() {

    $.ajax({
      url: '/getOrders',
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function (response) {

      var array = mapResults(response);
      for(var i=0; i < array.length; i++){

        var id = array[i][1];
        getName(id, array[i]);

      }

    });
  }

  function getName(id, array){
    $.when(
        $.ajax({
        url: '/getWidgetName/' + id,
        type: 'GET',
        error: function(error){
        console.log(error);
      }
      })
    ).done(function (data,testStatus,jqXHR) {

      var name = mapResults(JSON.parse(data).success);


      console.log(name);
      orderData.push({"id": array[0], "name": name, "inventory": array[2]});

    }).then(function (res) {
      console.log(orderData);
    });
  }



});