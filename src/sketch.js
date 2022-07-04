$('.nav-item').click(function(event){
  $('.nav-item').removeClass('active');
  $(event.target).addClass("active"); 
})