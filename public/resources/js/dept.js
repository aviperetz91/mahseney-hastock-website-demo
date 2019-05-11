
// $('.dropdown-item').attr('href','dept.html');
// $('.dropdown-item').attr('target','_blank');

$(document).ready(function(){
    $('.jumbotron').waypoint(function(direction) {
        if(direction == "down"){
            $('nav').addClass('sticky');
        }
        else {
            $('nav').removeClass('sticky');
        } 
    }, {
        offset: '100px;'  
    });
});