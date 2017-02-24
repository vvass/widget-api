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

  var radioButoonValue = 1;

  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function(response){
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
      fillSizesCheckBoxes('/getSizes');
      fillFinishesCheckBoxes('/getFinishes');
      fillTypesCheckBoxes('/getTypes');
    });

  }

  function fillSizesCheckBoxes(path) {
    $.ajax({
      url: path,
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function(results) {
      setUpRadioButtonHTML(results);
    });
  }

  function fillFinishesCheckBoxes(path) {
    $.ajax({
      url: path,
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function(results) {
      setUpRadioButtonHTML(results);
    });
  }

  function fillTypesCheckBoxes(path) {
    $.ajax({
      url: path,
      type: 'GET',
      error: function(error){
        console.log(error);
      }
    }).then(function(results) {
      setUpRadioButtonHTML(results);
    });
  }

  function setUpRadioButtonHTML(results, category) {
    var mapping = mapResults(results);

    $("#checkbox-options")
      .append(
        '<fieldset>' +
          '<legend>Select a Size: </legend>' +
            '<label for="radio-'+radioButoonValue+'"> '+ mapping[0][1] +' </label>' +
            '<input type="radio" name="radio-1" id="radio-'+ (radioButoonValue) +'">' +
            '<label for="radio-'+ (radioButoonValue+1) +'"> '+ mapping[1][1] +' </label>' +
            '<input type="radio" name="radio-1" id="radio-'+ (radioButoonValue+1) +'">' +
            '<label for="radio-'+ (radioButoonValue+2) +'"> '+ mapping[2][1] +' </label>' +
            '<input type="radio" name="radio-1" id="radio-'+ (radioButoonValue+2) +'">' +
        '</fieldset>');

    radioButoonValue += 3;

    $("input").checkboxradio({
      icon: false
    });
  }



});