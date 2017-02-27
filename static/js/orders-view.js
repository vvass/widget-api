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

  var fetchData = function(dataUrls,id) {
    return $.ajax({
      type: 'GET',
      url: dataUrls + '/' + id
    });
  };


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

      console.log(response);

      var array = mapResults(response);
      for(var i=0; i < array.length; i++){

        var id = array[i][1];
        // var name  = getName(id, array[i]);
        // var inventory = getInventory(array[1], array);



        // var getNames = fetchData('/getOrders', id);
        // var getInventory = fetchData('/getOrders', id);





      }

    });
  }

  function getName(id, array) {
    $.when(
        $.ajax({
        url: '/getWidgetName/' + id,
        type: 'GET',
        error: function(error){
        console.log(error);
      }
      })
    ).done(function (data) {

      var result = JSON.parse(data).success;
      var name = result.replace(/\(+|,|\)|'/g,'');

    });
  }

  function getInventory(id,name,array) {

      $.when(
        $.ajax({
          url: '/getInventory/' + id,
          type: 'GET',
          error: function(error){
            console.log(error);
          }
        })
      ).then(function (data) {

          var inventory = JSON.parse(data).success.replace(/\(+|,|\)|L|'/g,'')
          orderData.push({
            "id": array[0],
            "widgetId": array[1],
            "name": name,
            "amount": array[2],
            "inventory": inventory
          })
        )};
  }


});