$(function(){

  loadWidgets();

  var finishes = new Object();
  finishes[1] = "GOLD";
  finishes[2] = "SILVER";
  finishes[3] = "BRONZE";

  var sizes = new Object();
  sizes[1] = "Large";
  sizes[2] = "Medium";
  sizes[3] = "Small";

  var types = new Object();
  types[1] = "Wid Ext Edition";
  types[2] = "Ext Ext Edition";
  types[3] = "Gold Widget";


  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function(response){
        console.log(response);
        widgetAccordion(response);

        setupPop();
        buttonFilterContainer();

        $('#widget-grid').accordion({
          collapsible: true,
          heightStyle: "content"
        });

      },
      error: function(error){
        console.log(error);
      }
    });
  }

  function widgetAccordion(result) {

    var mapping = mapResults(result);

    var innerHTML = createWidgetHTML(mapping)

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

  function createWidgetHTML(mapping) {

    mapping.map(function(item) {

      var html ='<h3 class="header-hover">' + item[1] + '</h3>' +
        '<div>' +
          '<p>' +
            'Inventory: ' + item[2] + "<br/>" +
            'Finish ' + finishes[item[3]] + "<br/>" +
            'Size ' + sizes[item[4]] + "<br/>" +
            'Type ' + types[item[5]] + "<br/>" +
          '</p>' +
        '</div>';


      $("#widget-grid").append(html);

    });

  }

  function buttonFilterContainer() {
    $("#filter-buttons").append('<h4>Filter by: </h4>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Finish</button>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Size</button>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Types</button>');
  }

  function setupPop() {
    dialog = $("#dialog-form" ).dialog({
      autoOpen: false,
      hide: "explode",
      position: "top",
      modal: true,
      buttons: {
        Ok: function() {
          $( this ).dialog( "close" );
        }
      }
    });

    $("#new-widget-button").append('<button type="button" class="btn btn-default create-new-widget">Create New Widget</button>');
    $("#new-widget-button" ).button().on( "click", function() {
      dialog.dialog( "open" );
    });
    $(".create-new-widget").click(function () {
      console.log(fillSize());
    });

  }

  function setupCheckBoxOptions() {

    $("#checkbox-widget-options")




  }

  function fillSize() {
    $.ajax({
      url: '/getSizes',
      type: 'GET',
      success: function(response){
        console.log(response);

        var mapping = mapResults(response);
        console.log(mapping);

      },
      error: function(error){
        console.log(error);
      }
    });
  }



});