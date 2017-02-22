$(function(){

  loadWidgets();


  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function(response){
        console.log(response);

        $('#widget-grid').accordion();




      },
      error: function(error){
        console.log(error);
      }
    });
  }

  function widgetAccordion() {

  }


});