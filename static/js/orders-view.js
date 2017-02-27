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
      url: dataUrls + '/' + id,
      error: function(error){
        console.log(error);
      }
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

    var vm =

    $.ajax({
      url: '/getOrders',
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function (response) {

      array = mapResults(response);
      for(var i=0; i < array.length; i++) {

        var id = array[i][1];
        // var inventory = getInventory(array[1], array);


        var getName = fetchData('/getWidgetName', id),
          getInventory = fetchData('/getInventory',id);

        $.when(array, i, getName,getInventory)
          .then(function (array, i,name,inventory) {

            var name = JSON.parse(name[0]).success.replace(/\(+|,|\)|'/g,''),
              inventory = JSON.parse(inventory[0]).success.replace(/\(+|,|\)|L|'/g, '');

            orderData.push({
              "id": array[i][0],
              "widgetId": array[i][1],
              "name": name,
              "amount": array[i][2],
              "inventory": inventory - array[i][2],
              "options": createOptionButtons(array[i][0])
            });

            if(orderData.length-1 == i) {
              dataSource.read();
            }

          })
          .then(function () {
            addEventToButtons();
          }); // end of when

      } // end of for loop

    }); // end of then

  } // end of getData

  function createOptionButtons(orderId) {

    var html =  '<span class="ui-icon order-' + orderId + ' ui-icon-circle-plus"></span>' +
      '<span class="ui-icon order-' + orderId + ' ui-icon-circle-close"></span>';

    return html;

  }

  function addEventToButtons() {


    $("span.ui-icon.ui-icon-circle-plus").click(function () {


      var parent = $(this).parent().parent();
      console.log(parent.find("td").text());
      // console.log(parent.first().text());
      // processOrder(id,newInventory);

    });

    $("span.ui-icon.ui-icon-circle-close").click(function () {
      alert("asdf");
    });
  }

  function processOrder(id,newInventory) {

    $.ajax({
      url: '/updateInventoryFromOrder/'+ id + '/' + newInventory,
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function (response) {
      $("<div title='Basic dialog'>Order Sent. Thank you!</div>").dialog();
    });


  }



});