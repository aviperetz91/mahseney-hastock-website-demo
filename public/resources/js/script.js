
$('.nav-link').on('click',function() {
  $('.navbar-collapse').collapse('hide');
});

$('.owl-carousel').owlCarousel({
    loop:true,
    margin:6,
    responsiveClass:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:2,
            nav:false
        },
        1000:{
            items:3,
            nav:true,
            loop:true
        }
    }
})

$('.section-about').waypoint(function(direction) {
    if(direction == "down"){
        $('nav').addClass('sticky');
        $('#logo-nav').css("display", "block");
        $('.dropdown-toggle').css("display", "block");
        $('#nav-favorits').css("display", "block");

    }
    else {
        $('nav').removeClass('sticky');
        $('#logo-nav').css("display", "none");
        $('.dropdown-toggle').css("display", "none");
        $('#nav-favorits').css("display", "none");            
    } 
}, {
    offset: '100px;'  
});


$('a[href*="#"]')
.not('[href="#"]')
.not('[href="#0"]')
.click(function(event) {
    if (
        location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
        && 
        location.hostname == this.hostname
    ) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: target.offset().top
        }, 1000, function() {
            
            var $target = $(target);
            $target.focus();
            if ($target.is(":focus")) { 
            return false;
            } else {
            $target.attr('tabindex','-1'); 
            $target.focus(); 
            };
        });
        }
    }
});

// new GMaps({
    //     div: '#map',
    //     lat: -12.043333,
    //     lng: -77.028333
    // });




