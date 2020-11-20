(function($) {

  'use strict';

  var $sections = $('.box');
  var $nav_videos = $('.box video.nav-video');

  if($('form#contact_form').length > 0) {
    $('form#contact_form').validate({
      messages: { },
      submitHandler: function(form) {
        $.ajax({
          type: 'POST',
          url: 'send.php',
          data: $(form).serialize(),
          success: function(data) {
            if(data.match(/success/)) {
              $(form).trigger('reset');
              $('#thanks').show().fadeOut(5000);
            }
          }
        });
        return false;
      }
    });
  }

  // https://jonsuh.com/blog/detect-the-end-of-css-animations-and-transitions-with-javascript/
  // Function from David Walsh: http://davidwalsh.name/css-animation-callback
  function whichTransitionEvent(){
    var t,
        el = document.createElement("fakeelement");

    var transitions = {
      "transition"      : "transitionend",
      "OTransition"     : "oTransitionEnd",
      "MozTransition"   : "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    }

    for (t in transitions){
      if (el.style[t] !== undefined){
        return transitions[t];
      }
    }
  }

  var transitionEvent = whichTransitionEvent();



  for (var i = 0; i < $sections.length; i++) {
    $($sections[i]).on('mouseenter', function() {
      $('body').addClass('hover-' + $(this).attr('id'));
    }).on('mouseleave', function() {
      $('body').removeClass('hover-' + $(this).attr('id'));
    });
  }

  for (var i = 0; i < $nav_videos.length; i++) {
    var video = $nav_videos[i];

    $($nav_videos[i]).closest('a').on('mouseenter', function() {
      try {
        $('video.nav-video', this)[0].play();
      } catch(e) {}
    }).on('mouseleave', function() {
      if ( $('video.nav-video', this).closest(".box.active").length == 1 ) {
        return;
      }

      try {
        $('video.nav-video', this)[0].pause();
      } catch(e) {}
    });

  }


  var sectionAnimation = function(slug, callback) {
    var delay = 500;

    switch(slug) {
      case 'about':
        $('#about.box').addClass('active');
        $('#works.box').addClass('inactive-w-0');
        $('#blog.box').addClass('inactive-h-0');
        $('#contact.box').addClass('inactive-h-w-0 ');
        break;
      case 'works':
        $('#about.box').addClass('inactive-w-0');
        $('#works.box').addClass('active');
        $('#blog.box').addClass('inactive-h-w-0 ');
        $('#contact.box').addClass('inactive-h-0');
        break;
      case 'blog':
        $('#about.box').addClass('inactive-h-0');
        $('#works.box').addClass('inactive-h-w-0');
        $('#blog.box').addClass('active');
        $('#contact.box').addClass('inactive-w-0');
        break;
      case 'contact':
        $('#about.box').addClass('inactive-h-w-0');
        $('#works.box').addClass('inactive-h-0');
        $('#blog.box').addClass('inactive-w-0');
        $('#contact.box').addClass('active');
        break;
    }

    // $(this).css('overflow-y', 'scroll');
    $(this).one(transitionEvent, function() { $(this).css('overflow-y', 'scroll') });

    switch(slug) {
      case "about":
        var left = "150%";
        var top = "150%";
        var backClass = "right-bottom";
        break;
      case "works":
        var left = "-50%";
        var top = "150%";
        var backClass = "left-bottom";
        break;
      case "blog":
        var left = "150%";
        var top = "-50%";
        var backClass = "right-top";
        break;
      case "contact":
        var left = "-50%";
        var top = "-50%";
        var backClass = "left-top";
        break;
    }

    $('#back').removeClass('right-bottom left-bottom right-top left-top').addClass(backClass).removeClass('hide');

    $(this).one(transitionEvent, function() { callback(this) });

  }


  for (var i = 0; i < $sections.length; i++) {
    $sections[i]

    if ($($sections[i]).hasClass('active')) { return; }

    var $decors = $('.circle-1, .circle-2, .circle-3, .circle-4, .triangle-1, .triangle-2');

    var load = function(box) {

      for (var i = 0; i < $decors.length; i++) {        
        $($decors[i]).appear().on('appear', function() {
          $(this).addClass('appear');
        }).on('disappear', function() {
          $(this).removeClass('appear');
        });
      }

      var $boxedTextSlider = $('.modBoxedTextSlider > .boxes', box);

      for (var i = 0; i < $boxedTextSlider.length; i++) {
        if ( $($boxedTextSlider[i]).hasClass('slick-initialized') ) continue;


        $($boxedTextSlider[i]).slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 5000,
          pauseOnHover: false,
          responsive: [
            {
              breakpoint: 2000,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1
              }
            },
            {
              breakpoint: 568,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });

      }

    }
  }


  $sections.on('click', function() {

    var box = this;

    if ($(this).hasClass('active')) { return; }

    sectionAnimation.apply($(this), [ $(this).attr('id'), load ]);

    // hack fix for the slick testimonials slider
    var slicks = $('.items');

    for(var i = 0; i < slicks.length; i++) {
      var slick = slicks[i];
      setTimeout(function() {
        slick.slick.setPosition();
      }, 500)
    }

    return false;

  });


  // bubble scroll event to window for jquery.appear
  $sections.scroll(function() { $(window).trigger('scroll'); });

  $('#back').on('click', function(e) {
    e.preventDefault();

    var delay = 500;
    var sections = $(".box");
    var current_active_section = $('.box.active');

    current_active_section.removeClass('active');
    // sections.not(current_active_section).removeClass('inactive-h-w-0 inactive-h-0 inactive-w-0');
    sections.removeClass('inactive-h-w-0 inactive-h-0 inactive-w-0');
    current_active_section.css('overflow', 'hidden');

    // window.location.hash = 'home';

    $('#logo img').show();
    $('#back').addClass('hide');
    $('#contact .contact-info').hide();
    $('#logo').animate({ left: "50%", top: "50%" }, delay);
    $('.box').each(function() {
      this.scrollTop = 0;
    });

    return false;
  });

  $(document).ready(function() {
    var colors = $('.red, .purple, .orange');

    for (var i = 0; i < colors.length; i++) {

      $(colors[i]).appear().on('appear', function() {
        $(this).addClass('appear');
      }).on('disappear', function() {
        $(this).removeClass('appear');
      });

    }
  });

  if ( window.ontouchstart == undefined ) {

    for (var i = 0; i < $nav_videos.length; i++) {
      $nav_videos[i].pause();
    }

  }

  switch(window.location.hash) {
    case "#blog-section":
      $('#blog').click();
      setTimeout(function() {
        $('body').removeClass('hide');
      }, 500);
      break;
    case "#work-section":
      $('#works').click();
      setTimeout(function() {
        $('body').removeClass('hide');
      }, 500);
      break;
    default:
      $('body').removeClass('hide');
  }


})(jQuery);


