$(function(){

  function loadWidgets() {
    $.ajax({
      url: '/getWidgets',
      type: 'GET',
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
  }


  $('body').ready(function(){
    loadWidgets();
  });

});