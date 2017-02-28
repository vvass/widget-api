$(function(){


  var orderData = [];

  getData();

  var fetchData = function(dataUrls,id) {
    return $.ajax({
      type: 'GET',
      url: dataUrls + '/' + id,
      error: function(error){
        console.log(error);
      }
    });
  };

  function newGrid() {

    $("#grid").kendoGrid({
      dataSource: {
        data: orderData,
        schema: {
          model: {
            id: "id",
            fields: {
              id: { type: "number", editable: false },
              widgetId: { type: "number", editable: false },
              name: { type: "string", editable: false },
              amount: { type: "number", editable: true },
              inventory: { type: "number", editable: false }
            }
          }
        }
      },
      pageable: {
        refresh: true,
        pageSize: 5,
        buttonCount: 5
      },
      editable: true,
      columns: [{
        field: "id",
        title: "Order Id"
      }, {
        field: "widgetId",
        title: "Widget Id"
      }, {
        field: "name",
        title: "Widget Name"
      }, {
        field: "amount",
        title: "Order Amount"
      }, {
        field: "inventory",
        title: "Inventory Left"
      },{
        command: {
          text: "Checkout", click: processOrder
        }
      }]
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
              "inventory": inventory - array[i][2]
            });

            if(orderData.length-1 == i) {
              newGrid();
              var grid = $("#grid").data("kendoGrid");

            }

          })
          .then(function () {
            addEventToButtons();
          }); // end of when

      } // end of for loop

    }); // end of then

  } // end of getData

  function processOrder(e) {

    e.preventDefault();

    var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

    $.ajax({
      url: '/updateInventoryFromOrder/'+ dataItem.widgetId + '/' + dataItem.inventory,
      type: 'POST',
      error: function(error){
        console.log(error);
      }
    }).then(function () {
      $.ajax({
        url: '/deleteOrder/'+ dataItem.id,
        type: 'POST',
        success: function (response) {
          var grid = $("#grid").data("kendoGrid");

        },
        error: function(error){
          console.log(error);
        }
      }).then(function () {
        var dataSource = $("#grid").data("kendoGrid").dataSource;
        dataSource.remove(dataItem);
        dataSource.sync();
      })
    });



  }



});