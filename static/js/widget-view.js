$(function(){

  alert("yo");

  $('body').ready(function(){
    console.log("You have body ready");

    $.ajax({
      url: '/getAvalQuantity/6',
      type: 'GET',
      success: function(response){
        console.log(response);
      },
      error: function(error){
        console.log(error);
      }
    });


  });

});