$(function(){

  loadWidgets();

  var ENUMFINISHES = new Object();
  ENUMFINISHES[1] = "Gold";
  ENUMFINISHES[2] = "Silver";
  ENUMFINISHES[3] = "Bronze";

  var ENUMSIZES = new Object();
  ENUMSIZES[1] = "Large";
  ENUMSIZES[2] = "Medium";
  ENUMSIZES[3] = "Small";

  var ENUMTYPES = new Object();
  ENUMTYPES[1] = "Wid Ext Edition";
  ENUMTYPES[2] = "Ext Ext Edition";
  ENUMTYPES[3] = "Gold Widget";

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
          '<span>' +
            '<p class="editable-inventory">Inventory: ' + item[2] + ' <span class="ui-icon ui-icon-pencil"></span><p>' +
            '<p>Finish ' + ENUMFINISHES[item[3]] + '<p/>' +
            '<p>Size ' + ENUMSIZES[item[4]] + '<p/>' +
            '<p>Type ' + ENUMTYPES[item[5]] + '<p/>' +
          '</span>' +
        '</div>';

      $("#widget-grid").append(html);

      clickToEditInventory(item);

    });

  }

  function buttonFilterContainer() {
    $("#filter-buttons").append('<h4>Filter by: </h4>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Finish</button>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Size</button>');
    $("#filter-buttons").append('<button type="button" class="btn btn-default">Types</button>');
  }

  // EDIT INV
  
  function clickToEditInventory(item) {
    $(".ui-icon-pencil").click(function () {
      console.log(this);

      $(this).prev().empty();
      $(this).html('Inventory: <input type="text"></p>');
      // $(this).html('<p>Inventory: ' + item[2] + ' <span class="ui-icon ui-icon-pencil"></span><p>');

    });
  }
  
  // POPUP
  
  function setupPop() {
    dialog = $("#dialog-form" ).dialog({
      autoOpen: false,
      hide: "explode",
      modal: true,
      buttons: {
        Ok: function() {

          saveWidget(getSelectedOptions());
          $("#checkbox-form").empty();
          $("#checkbox-options").empty();
          $( this ).dialog( "close" );
        },
        CLOSE: function() {
          $("#checkbox-form").empty();
          $("#checkbox-options").empty();
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
      createTextBoxsPopup();
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
      setUpRadioButtonHTML(results, 'Size');
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
      setUpRadioButtonHTML(results, 'Finish');
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
      setUpRadioButtonHTML(results, 'Type');
    });
  }

  function createTextBoxsPopup() {
    $("#checkbox-form")
      .append(
        '<fieldset>' +
          '<form>' +
            '<label for="name">Name</label><br/>' +
            '<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all">' +
            '<label for="name">Available Inventory</label><br/>' +
            '<input type="text" name="inv" id="inv" class="text ui-widget-content ui-corner-all">' +
           '</form>' +
        '</fieldset>'
      )
  }

  function setUpRadioButtonHTML(results, category) {
    var mapping = mapResults(results);

    $("#checkbox-options")
      .append(
        '<fieldset>' +
          '<legend>Select a '+category+': </legend>' +
            '<label for="radio-'+radioButoonValue+'">'+ mapping[0][1] +'</label>' +
            '<input class="checkbox-input" type="radio" name="radio-'+ (radioButoonValue) +'" id="radio-'+ (radioButoonValue) +'">' +
            '<label for="radio-'+ (radioButoonValue+1) +'">'+ mapping[1][1] +'</label>' +
            '<input class="checkbox-input" type="radio" name="radio-'+ (radioButoonValue) +'" id="radio-'+ (radioButoonValue+1) +'">' +
            '<label for="radio-'+ (radioButoonValue+2) +'">'+ mapping[2][1] +'</label>' +
            '<input class="checkbox-input" type="radio" name="radio-'+ (radioButoonValue) +'" id="radio-'+ (radioButoonValue+2) +'">' +
        '</fieldset>');

    //TODO more dynamic way of adding categories
    radioButoonValue += 3;

    $("input.checkbox-input").checkboxradio({
      icon: false
    });
  }

  function getSelectedOptions() {

    var selected = [];
    $("#checkbox-options").find("label").each(function() {
      if($(this).hasClass("ui-checkboxradio-checked"))
        selected.push($(this).text());
    });
    $("#checkbox-form").find("form").find("input").each(function() {
      if($(this).val())
        selected.push($(this).val());
    });


    //TODO make sure to check that we have proper selection and that everything is filled in
    //TODO inventory should be a number
    return selected;
  }

  function saveWidget(sel) {

    var sizeNum = findValueFromEnumObject(sel[0],ENUMSIZES),
        finishNum = findValueFromEnumObject(sel[1],ENUMFINISHES),
        typeNum = findValueFromEnumObject(sel[2],ENUMTYPES),
        inventory = sel[3],
        name = sel[4];


    $.ajax({
      url: '/saveWidget/'+sizeNum+'/'+finishNum+'/'+typeNum+'/'+name+'/'+inventory,
      type: 'POST',
      error: function(error){
        console.log(error);
      }
    }).then(function(results) {
      $("<div title='Basic dialog'>Test message</div>").dialog({
        close: function() {
          window.location.reload();
        }
      });
    });
  }

  function findValueFromEnumObject(arrayValue,ENUMOBJECT) {
    for(var key in ENUMOBJECT){
      if(ENUMOBJECT[key] == arrayValue){
        return key;
      }
    }

  }


});