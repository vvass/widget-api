$(function(){


  var orderData = [];

  getData();

  var template = kendo.template($("#template").html());

  var dataSource = new kendo.data.DataSource({
    data: orderData,
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

      var result = JSON.parse(data).success;
      var name = result.replace(/\(+|,|\)|'/g,'');
      orderData.push({"id": array[0], "widgetId": array[1], "name": name, "amount": array[2]});

    }).then(function (res) {
      dataSource.read();
    });
  }



});