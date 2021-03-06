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
                "finish": JSON.parse(finish[0]).success.replace(/\(+|,|\)|'/g,''),
                "size": JSON.parse(size[0]).success.replace(/\(+|,|\)|'/g,''),
                "types": JSON.parse(types[0]).success.replace(/\(+|,|\)|'/g,''),
                "parentId": array[i][6]
              });

              if(widgetData.length-1 == array.length-1) {

                var dataSource = new kendo.data.TreeListDataSource({
                  data: widgetData,
                  schema: {
                    model: {
                      id: "id",
                      expanded: true,
                      fields: {
                        inventory: { type: "number", editable: false },
                        finish: { type: "string" },
                        types: { type: "string" },
                        size: { type: "string" },
                        name: { type: "string", editable: false },
                        parentId: { type: "string", editable: false }
                      }
                    }
                  },
                  error: function (e) {
                    console.log("Error");
                  },
                  change: function (e) {
                    console.log("Change");

                    // var dataItem = this.dataItem($(e.currentTarget).closest("td"));
                    // var dataRow = this.dataItem($(e.currentTarget).closest("tr"));
                    // console.log(dataItem, dataRow);

                  },
                  requestStart: function (e) {
                    console.log("Request Start");
                  }
                });

                $("#treelist").kendoTreeList({
                  dataSource: dataSource,
                  height: 500,
                  width: 800,
                  editable: "popup",
                  filterable: true,
                  columnMenu: true,
                  sortable: true,
                  columns: [
                    { field: "id",title: "Id",hidden: true },
                    { field: "name",title: "Name" },
                    { field: "inventory",title: "Inventory" },
                    { field: "finish",title: "Finish" },
                    { field: "size",title: "Size" },
                    { field: "types",title: "Type" },
                    { field: "parentId",title: "",hidden: true },
                    { title: "Edit", command: [ "edit", "destroy" ], width: 160 }
                  ]
                });

                function categoryDropDownEditor(container, options) {

                  var categoryData = [];


                  var path = "";
                  switch (options.field) {
                    case 'finish':
                      path = '/getFinishes';
                      break;
                    case 'types':
                      path = '/getTypes';
                      break;
                    case 'size':
                      path = '/getSizes';
                      break;
                    default:
                      break;
                  };

                  $.ajax({
                    url: path,
                    type: 'GET',
                    success: function (result) {

                      var array = mapResults(result);

                      for(var i = 0; i < array.length; i++) {
                        categoryData.push({
                          "id": array[i][0],
                          "value": array[i][1]
                        });
                      }

                      console.log(categoryData);

                      $('<input required name="' + options.field + '"/>')
                        .appendTo(container)
                        .kendoDropDownList({
                          autoBind: false,
                          dataValueField: "id",
                          dataTextField: "value",
                          dataSource: categoryData
                        });
                    },
                    error: function(error) {
                      console.log(error);
                    }
                  });

                }


              }

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



