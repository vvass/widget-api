$(document).ready(function () {

  var widgetData = [];

  loadWidgets();

  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function (result) {
        var array = mapResults(result);

        for(var i = 0; i < array.length; i++) {

          if(array[i][6] == 0)
            array[i][6] = null;

          var getSize = fetchData('/getSizes', array[i][4]),
            getFinish = fetchData('/getFinishes',array[i][3]),
            getTypes = fetchData('/getTypes',array[i][5]);

          $.when(array, i, getSize, getFinish, getTypes)
            .then(function (array, i, size, finish, types) {

              widgetData.push({
                "id": array[i][0],
                "name": array[i][1],
                "inventory": array[i][2],
                "finish": JSON.parse(size[0]).success.replace(/\(+|,|\)|'/g,''),
                "size": JSON.parse(finish[0]).success.replace(/\(+|,|\)|'/g,''),
                "types": JSON.parse(types[0]).success.replace(/\(+|,|\)|'/g,''),
                "parentId": array[i][6]
              });

              if(widgetData.length-1 == i) {
                console.log("done", widgetData);
              }

            });
        }

        console.log(widgetData);

        var dataSource = new kendo.data.TreeListDataSource({
          data: widgetData,
          schema: {
            model: {
              id: "id",
              expanded: true
            }
          },
          error: function (e) {
            console.log("Error");
          },
          change: function (e) {
            console.log("Change");
          },
          requestStart: function (e) {
            console.log("Request Start");
          }
        });

        $("#treelist").kendoTreeList({
          dataSource: dataSource,
          height: 540,
          columns: [
            { field: "id",title: "Id",hidden: false },
            { field: "name",title: "Name" },
            { field: "inventory",title: "Inventory" },
            { field: "finish",title: "Finish" },
            { field: "size",title: "Size" },
            { field: "types",title: "Types" },
            { field: "parentId",title: "",hidden: true }
          ]
        });




      },
      error: function(error){
        console.log(error);
      }
    }).then(function (result) {

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

  var fetchData = function(dataUrls,id) {
    return $.ajax({
      type: 'GET',
      url: dataUrls + '/' + id,
      error: function(error){
        console.log(error);
      }
    });
  };



});



