$(function(){

  var datas= [
    { "id": 1,  "name": "test", "inventory": 123 },
    { "id": 2,  "name": "test1", "inventory": 1234 },
    { "id": 3,  "name": "test2", "inventory": 1235 }
  ];

  $("#orders-grid").kendoGrid({
    dataSource: {
      type: "odata",
      data: datas,
      pageSize: 20
    },
    height: 550,
    groupable: false,
    sortable: false,
    pageable: {
      refresh: true,
      pageSizes: true,
      buttonCount: 5
    },
    columns: [{
      field: "id",
      title: "Id"
    }, {
      field: "name",
      title: "Name"
    }, {
      field: "inventory",
      title: "Inventory"
    }]
  });


});