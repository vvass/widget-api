$(document).ready(function () {

  var orderData = [];



  loadWidgets();

  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function (result) {
      var array = mapResults(result);
      console.log(array);

      for(var i = 0; i < array.length; i++){
        orderData.push({
          "id": array[i][0],
          "name": array[i][1],
          "inventory": array[i][2],
          "finish": array[i][3],
          "size": array[i][4],
          "types": array[i][5],
          "parentId": array[i][6]
        });
      }

      console.log(orderData);

      var dataSource = new kendo.data.TreeListDataSource({
        data: orderData,

        schema: {
          model: {
            id: "id",
            expanded: true
          }
        }
      });

      $("#treelist").kendoTreeList({
        dataSource: dataSource,
        height: 540,
        columns: [
          { field: "id",title: "Id" },
          { field: "name",title: "Name" },
          { field: "inventory",title: "Inventory" },
          { field: "finish",title: "Finish" },
          { field: "size",title: "Size" },
          { field: "types",title: "Types" },
          { field: "parentId",title: "" }
        ]
      });

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


});



