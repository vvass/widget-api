$(document).ready(function () {
  var tempSelectList = [];
  var dialog = $("#dialog").kendoDialog({
    width: "400px",
    height: "500px",
    visible: false,
    title: "Employees",
    closable: true,
    modal: false,
    content: "<div class='k-textbox k-space-right search-wrapper'><input id='employees-search' type='text'  placeholder='Search employees'/><span class='k-icon k-i-search'></span></div>" +
    "<div class='select-all-wrapper'><input data-role='checkbox' onchange='selectAll(this)' type='checkbox' class='k-checkbox' id='_selectAllEmployees'/><label class='k-checkbox-label' for='_selectAllEmployees'>Select all employees</label><span class='selected-count'></span></div>" +
    "<div id='treeview'></div>",
    actions: [
      { text: 'Cancel'},
      { text: 'OK', primary: true, action: actionOK }
    ],
    initOpen: initOpen,
    open: dialogOpen
  });

  $("#pickEmployeesButton").kendoButton({
    click: openDialog
  });

  var serviceRoot = "https://demos.telerik.com/kendo-ui/service";
  homogeneous = new kendo.data.HierarchicalDataSource({
    transport: {
      read: {
        url: serviceRoot + "/Employees",
        dataType: "jsonp"
      }
    },
    schema: {
      model: {
        id: "EmployeeId",
        hasChildren: "HasEmployees"
      }
    }
  });

  $("#treeview").kendoTreeView({
    dataSource: homogeneous,
    dataTextField: "FullName",
    checkboxes: true,
    loadOnDemand: false,
    expandAll: true,
    dataBound: treeViewDataBound,
    check: treeViewCheck
  });
});

function treeViewDataBound(e) {
  e.sender.expand(e.node);
}

function initOpen(e) {
  $("#employees-search").on("input", function () {
    var query = this.value.toLowerCase();
    var dataSource = $("#treeview").data("kendoTreeView").dataSource;
    filter(dataSource, query);
    matchColors(query);
  });
}

function dialogOpen(e) {
  var treeView = $("#treeview").data("kendoTreeView");
  tempSelectList = getCheckedItems(treeView);
  setTimeout(function () {
    $("#employees-search").focus().select();
  })
}
function openDialog(e) {
  $("#dialog").data("kendoDialog").open();
}

function actionOK(e) {
  var treeView = $("#treeview").data("kendoTreeView");
  var checkedNodes = getCheckedItems(treeView);
  updateResult(checkedNodes);
}

function updateResult(checkedNodes) {
  if (checkedNodes.length > 0) {
    var result = "";
    for (var i = 0; i < checkedNodes.length; i++) {
      result += "<span class='selectedName'>" + checkedNodes[i].FullName + "</span>";
    }
  } else {
    result = "No employees selected.";
  }

  $("#result").html(result);
}
function treeViewCheck(e) {
  setTimeout(function () {
    updateSelectedCount(e.sender);
  })
}

function selectAll(sender) {
  $("#treeview .k-checkbox").removeAttr("checked").prop("checked", sender.checked);
  $("#treeview .k-checkbox").trigger("change");
}

function updateSelectedCount(treeView) {
  $(".selected-count").html(getCheckedItems(treeView).length + " Employees selected");
}

function getCheckedItems(treeview) {
  var nodes = treeview.dataSource.view();
  return getCheckedNodes(nodes);
}

function getCheckedNodes(nodes) {
  var node, childCheckedNodes;
  var checkedNodes = [];

  for (var i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (node.checked) {
      checkedNodes.push(node);
    }

    if (node.hasChildren) {
      childCheckedNodes = getCheckedNodes(node.children.view());
      if (childCheckedNodes.length > 0) {
        checkedNodes = checkedNodes.concat(childCheckedNodes);
      }
    }

  }

  return checkedNodes;
}

function filter(dataSource, query) {
  var hasVisibleChildren = false;
  var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();

  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    var text = item.FullName.toLowerCase();
    var itemVisible =
      query === true // parent already matches
      || query === "" // query is empty
      || text.indexOf(query) >= 0; // item text matches query

    var anyVisibleChildren = filter(item.children, itemVisible || query); // pass true if parent matches

    hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;

    item.hidden = !itemVisible && !anyVisibleChildren;
  }

  if (data) {
    // re-apply filter on children
    dataSource.filter({ field: "hidden", operator: "neq", value: true });
  }

  return hasVisibleChildren;
}

function matchColors(query, element) {
  $("#treeview .k-in:containsIgnoreCase('" + query + "')").each(function () {
    var index = $(this).html().toLowerCase().indexOf(query.toLowerCase());
    var length = query.length;
    var original = $(this).html().substr(index, length);
    var newText = $(this).html().replace(original, "<span class='query-match'>" + original + "</span>");
    $(this).html(newText);
  });
}

$.expr[':'].containsIgnoreCase = function (n, i, m) {
  return jQuery(n).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
