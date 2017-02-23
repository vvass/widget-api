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
    var data = JSON.parse(
      widgets.success
        .replace(/'/g,'"')
        .replace(/L,/g,',')
        .replace(/L\)/g,')')
        .replace(/(\d+)/g,"\"$1\"")
    );





    console.log(data);
  }


});