$(function(){

  loadWidgets();


  function loadWidgets() {
    $.ajax({
      url: '/getOrders',
      type: 'GET',
      success: function(response){
        console.log(response);


        widgetAccordion(response);

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
      console.log(item);

      var html = '<fieldset>' +
        '<h3>' + item[1] + '</h3>' +
        '<div>' +
        '<p>' +
          item[2] + ' ' + item[3] +
        '</p>' +
        '</div>' +
        '</fieldset>';


      $("#widget-grid").append(html);
      $('#widget-grid').accordion({
        collapsible: true
      });

    });

  }

});