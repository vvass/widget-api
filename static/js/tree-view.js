$(document).ready(function () {
  var dialog = $("#dialog").kendoDialog({
    width: "800px",
    height: "520px",
    visible: false,
    title: "Members",
    closable: true,
    modal: false,
    content: "<div id='treelist'></div>",
    actions: [
      { text: 'Cancel' },
      { text: 'OK', primary: true, action: actionOK }
    ],
    initOpen: initOpen
  });

  $("#pickEmployeesButton").kendoButton({
    click: openDialog
  });

  var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";

  var dataSource = new kendo.data.TreeListDataSource({
    transport: {
      read: {
        url: crudServiceBaseUrl + "/EmployeeDirectory/All",
        dataType: "jsonp"
      },
      update: {
        url: crudServiceBaseUrl + "/EmployeeDirectory/Update",
        dataType: "jsonp"
      },
      destroy: {
        url: crudServiceBaseUrl + "/EmployeeDirectory/Destroy",
        dataType: "jsonp"
      },
      create: {
        url: crudServiceBaseUrl + "/EmployeeDirectory/Create",
        dataType: "jsonp"
      },
      parameterMap: function (options, operation) {
        if (operation !== "read" && options.models) {
          return { models: kendo.stringify(options.models) };
        }
      }
    },
    batch: true,
    schema: {
      model: {
        id: "EmployeeId",
        parentId: "ReportsTo",
        fields: {
          EmployeeId: { type: "number", editable: false, nullable: false },
          ReportsTo: { nullable: true, type: "number" },
          FirstName: { validation: { required: true } },
          LastName: { validation: { required: true } },
          HireDate: { type: "date" },
          Phone: { type: "string" },
          HireDate: { type: "date" },
          BirthDate: { type: "date" },
          Extension: { type: "number", validation: { min: 0, required: true } },
          Position: { type: "string" }
        },
        expanded: true
      }
    }
  });

  $("#treelist").kendoTreeList({
    dataSource: dataSource,
    height: 380,
    filterable: true,
    sortable: true,
    toolbar: ["create"],
    columns: [
      {
        headerTemplate: "<input type='checkbox' onclick='toggleAll(event)' />",
        template: "<input type='checkbox' class='checkbox' data-bind='checked: checked' />",
        width: 40,
        filterable: false
      },
      {
        field: "FirstName", title: "First Name", width: 170,
        expandable: true
      },
      { field: "LastName", title: "Last Name", width: 110 },
      { field: "Position" },
      {
        title: "Edit", command: ["edit", "destroy"], width: 250,
        attributes: {
          style: "text-align: center;"
        }
      }
    ],
    dataBound: treeListDataBound
  });
});

function treeListDataBound(e) {
  $(".checkbox").bind("change", function (e) {
    var row = $(e.target).closest("tr");
    this.checked ? row.addClass("k-state-selected") : row.removeClass("k-state-selected");
  });
}

function toggleAll(e) {
  if (e.target.checked) {
    $("#treelist [role='row'] .checkbox").each(function () {
      this.checked = "checked";
    });
  }
  else {
    $("#treelist [role='row'] .checkbox").removeAttr("checked");
  }

  $("#treelist [role='row'] .checkbox").trigger("change");
}

function initOpen(e) {
  setTimeout(function () {
    $("#treelist").data("kendoTreeList").refresh();
  })
}

function openDialog(e) {
  $("#dialog").data("kendoDialog").open();
}

function actionOK(e) {
  var treelist = $("#treelist").data("kendoTreeList");
  var items = treelist.element.find(".k-state-selected");
  updateResult(items, treelist);
}

function updateResult(items, treelist) {
  if (items.length > 0) {
    var result = "";
    for (var i = 0; i < items.length; i++) {
      var dataItem = treelist.dataItem(items[i]);
      result += "<span class='selectedName'>" + dataItem.FirstName + " " + dataItem.LastName + "</span>";
    }
  } else {
    result = "No members selected.";
  }

  $("#result").html(result);
}

function updateSelectedCount(treeView) {
  $(".selected-count").html(getCheckedItems(treeView).length + " Employees selected");
}