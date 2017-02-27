$(function(){

  var vm = this;

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



    $.ajax({
      url: '/getOrders',
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function (response) {

      vm.array = mapResults(response);
      for(var i=0; i < vm.array.length; i++) {

        var id = vm.array[i][1];
        // var inventory = getInventory(array[1], array);


        var getName = fetchData('/getWidgetName', id),
          getInventory = fetchData('/getInventory',id);

        $.when(getName,getInventory).then(function (name,inventory) {

          var name = JSON.parse(name[0]).success.replace(/\(+|,|\)|'/g,''),
            inventory = JSON.parse(inventory[0]).success.replace(/\(+|,|\)|L|'/g, '');

          console.log(name, inventory);

          console.log(vm.array[i]);
          // orderData.push({
          //   "id": 1,
          //   "widgetId": array[i][1],
          //   "name": name,
          //   "amount": array[i][2],
          //   "inventory": inventory - array[i][2]
          // });

        });

      } // end of for loop

    }); // end of then

  } // end of getData


});