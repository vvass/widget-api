$(function(){


  var orderData = [];

  getData();

  var template = kendo.template($("#template").html());

  var dataSource = new kendo.data.DataSource({
    data: orderData,
    pageSize: 7,
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

  function newGrid() {

    $("#grid").kendoGrid({
      dataSource: {
        type: "odata",
        pageSize: 10,
        transport:{
          read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Customers"
        }
      },
      height: 550,
      pageable: {
        refresh: true,
        pageSize: 5,
        buttonCount: 5
      },
      columns: [{
        template: "<div class='customer-photo'" +
        "style='background-image: url(../content/web/Customers/#:data.CustomerID#.jpg);'></div>" +
        "<div class='customer-name'>#: ContactName #</div>",
        field: "ContactName",
        title: "Contact Name",
        width: 240
      }, {
        field: "ContactTitle",
        title: "Contact Title"
      }, {
        field: "CompanyName",
        title: "Company Name"
      }, {
        field: "Country",
        width: 150
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
        // var inventory = getInventory(array[1], array);


        var getName = fetchData('/getWidgetName', id),
          getInventory = fetchData('/getInventory',id);

        $.when(array, i, getName,getInventory)
          .then(function (array, i,name,inventory) {
            console.log(array);

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


      var parentTR = $(this).parent().parent(),
        orderId = $(parentTR).find("td:first-child").text(),
        newInventory = $(parentTR).find("td:nth-child(4)").text();
      processOrder(orderId,newInventory);

    });

    $("span.ui-icon.ui-icon-circle-close").click(function () {
      alert("asdf");
    });
  }

  function processOrder(id,newInventory) {

    $.ajax({
      url: '/updateInventoryFromOrder/'+ id + '/' + newInventory,
      type: 'POST',
      error: function(error){
        console.log(error);
      }
    }).then(function () {
      $.ajax({
        url: '/deleteOrder/'+ id,
        type: 'POST',
        error: function(error){
          console.log(error);
        }
      }).then(function () {
      });
    }).done(function (response) {
      $("<div title='Basic dialog'>Order Sent. Thank you!</div>").dialog();
      dataSource.read();
    });



  }



});