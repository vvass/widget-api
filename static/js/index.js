$(function(){
  $('#btnCreateWidget').click(function(){

    $.ajax({
      url: '/widgetCreate',
      data: $('form').serialize(),
      type: 'POST',
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });
  });
});