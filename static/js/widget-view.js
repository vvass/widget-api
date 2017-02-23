$(function(){

  loadWidgets();


  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function(response){
        console.log(response);

        $('#widget-grid').accordion();
        widgetAccordion(response);




      },
      error: function(error){
        console.log(error);
      }
    });
  }

  function widgetAccordion(result) {
    var widgets = JSON.parse(result);
    console.log(widgets);
  }


});