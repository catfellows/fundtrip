//   all ------------------
function initEasybook() {
  'use strict';
  //   loader ------------------
  $('.loader-wrap').fadeOut(300, function () {
    $('#main').animate({
      opacity: '1'
    }, 600);
  });
  //   Background image ------------------
  var a = $('.bg');
  a.each(function (a) {
    if ($(this).attr('data-bg')) $(this).css('background-image', 'url(' + $(this).data('bg') + ')');
  });
  //   perfectScrollbar------------------
  if ($('.scrollbar-inner').length > 0) {
    var aps = new PerfectScrollbar('.scrollbar-inner', {
      swipeEasing: true,
      minScrollbarLength: 20
    });
  }
  //   Isotope------------------
  function initIsotope() {
    if ($('.gallery-items').length) {
      var a = $('.gallery-items').isotope({
        singleMode: true,
        columnWidth: '.grid-sizer, .grid-sizer-second, .grid-sizer-three',
        itemSelector: '.gallery-item, .gallery-item-second, .gallery-item-three',
        transformsEnabled: true,
        transitionDuration: '700ms',
        resizable: true
      });
      a.imagesLoaded(function () {
        a.isotope('layout');
      });
    }
  }
  initIsotope();
  //   lightGallery------------------
  $('.image-popup').lightGallery({
    selector: 'this',
    cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    download: false,
    counter: false
  });
  var o = $('.lightgallery'),
    p = o.data('looped');
  o.lightGallery({
    selector: '.lightgallery a.popup-image',
    cssEasing: 'cubic-bezier(0.25, 0, 0.25, 1)',
    download: false,
    loop: false,
    counter: false
  });

  function initHiddenGal() {
    $('.dynamic-gal').on('click', function () {
      var dynamicgal = eval($(this).attr('data-dynamicPath'));

      $(this).lightGallery({
        dynamic: true,
        dynamicEl: dynamicgal,
        download: false,
        loop: false,
        counter: false
      });

    });

  }
  initHiddenGal();
  

  //   appear------------------
  $('.stats').appear(function () {
    $('.num').countTo();
  });






  //   mailchimp------------------
  $('#subscribe').ajaxChimp({
    language: 'eng',
    url: 'http://kwst.us18.list-manage.com/subscribe/post?u=42df802713d4826a4b137cd9e&id=815d11e811'
  });
  $.ajaxChimp.translations.eng = {
    submit: 'Submitting...',
    0: '<i class="fa fa-check"></i> We will be in touch soon!',
    1: '<i class="fa fa-warning"></i> You must enter a valid e-mail address.',
    2: '<i class="fa fa-warning"></i> E-mail address is not valid.',
    3: '<i class="fa fa-warning"></i> E-mail address is not valid.',
    4: '<i class="fa fa-warning"></i> E-mail address is not valid.',
    5: '<i class="fa fa-warning"></i> E-mail address is not valid.'
  };
  
  // scroll animation ------------------
  $(window).on('scroll', function (a) {
    if ($(this).scrollTop() > 150) {
      $('.to-top').fadeIn(500);
    } else {
      $('.to-top').fadeOut(500);
    }
  });
  //   scroll to------------------
  $('.custom-scroll-link').on('click', function () {
    var a = 150 + $('.scroll-nav-wrapper').height();
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
      var b = $(this.hash);
      b = b.length ? b : $('[name=' + this.hash.slice(1) + ']');
      if (b.length) {
        $('html,body').animate({
          scrollTop: b.offset().top - a
        }, {
          queue: false,
          duration: 1200,
          easing: 'easeInOutExpo'
        });
        return false;
      }
    }
  });
  $('.to-top').on('click', function (a) {
    a.preventDefault();
    $('html, body').animate({
      scrollTop: 0
    }, 800);
    return false;
  });
  // modal ------------------
  var modal = {};
  modal.hide = function () {
    $('.modal , .reg-overlay').fadeOut(200);
    $('html, body').removeClass('hid-body');
  };
  $('.modal-open').on('click', function (e) {
    e.preventDefault();
    $('.modal , .reg-overlay').fadeIn(200);
    $('html, body').addClass('hid-body');
  });
  $('.close-reg , .reg-overlay').on('click', function () {
    modal.hide();
  });
  
  // Forms ------------------
  $(document).on('change', '.leave-rating input', function () {
    var $radio = $(this);
    $('.leave-rating .selected').removeClass('selected');
    $radio.closest('label').addClass('selected');
  });
  $('.chosen-select').niceSelect();
  $('.range-slider').ionRangeSlider({
    type: 'double',
    keyboard: true
  });
  $('.rate-range').ionRangeSlider({
    type: 'single',
    hide_min_max: true,
  });
  $('form.book-form[name=bookFormCalc]').jAutoCalc('destroy');
  $('form.book-form[name=bookFormCalc]').jAutoCalc({
    initFire: true,
    decimalPlaces: 0,
    emptyAsZero: true
  });
  $('form[name=rangeCalc]').jAutoCalc('destroy');
  $('form[name=rangeCalc]').jAutoCalc({
    initFire: true,
    decimalPlaces: 1,
    emptyAsZero: false
  });

  $('input[name="header-search"]').daterangepicker({
    autoUpdateInput: false,
    parentEl: $('.date-parent'),
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('input[name="header-search"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('input[name="header-search"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('input[name="dates"]').daterangepicker({
    autoUpdateInput: false,
    parentEl: $('.date-container'),
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('input[name="dates"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('input[name="dates"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('input[name="bookdates"]').daterangepicker({
    autoUpdateInput: false,
    parentEl: $('.bookdate-container'),
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('input[name="bookdates"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('input[name="bookdates"]').on('apply.daterangepicker', function (ev, picker) {
    var start = moment(picker.startDate.format('MM/DD/YYYY')),
      end = moment(picker.endDate.format('MM/DD/YYYY')),
      c = 24 * 60 * 60 * 1000,
      diffDays = Math.round(Math.abs((start - end) / (c))),
      tdv = $('#totaldays').val(diffDays + 1).trigger('change');
    $('.bookdate-container-dayscounter strong').text($('#totaldays').val());
  });
  $('input[name="bookdates"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('input[name="main-input-search"]').daterangepicker({
    autoUpdateInput: false,
    parentEl: $('.main-date-parent'),
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('input[name="main-input-search"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('input[name="main-input-search"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('input[name="main-input-search_slider"]').daterangepicker({
    autoUpdateInput: false,
    drops: 'up',
    parentEl: $('.main-date-parent3'),
    locale: {
      cancelLabel: 'Clear'
    }
  });
  $('input[name="main-input-search_slider"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
  });
  $('input[name="main-input-search_slider"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
  });
  $('.show-hidden-map').on('click', function (e) {
    e.preventDefault();
    $('.show-hidden-map').find('span').text($('.show-hidden-map span').text() === 'Close' ? 'On The Map' : 'Close');
    $('.hidden-map-container').slideToggle(400);
  });

  function showColumnhiddenmap() {
    if ($(window).width() < 1064) {
      $('.hid-mob-map').animate({
        right: 0
      }, 500, 'easeInOutExpo').addClass('fixed-mobile');
    }
  }
  $('.map-item , .schm').on('click', function (e) {
    e.preventDefault();
    showColumnhiddenmap();
  });
  $('.map-close').on('click', function (e) {
    $('.hid-mob-map').animate({
      right: '-100%'
    }, 500, 'easeInOutExpo').removeClass('fixed-mobile');
  });
  $('.show-list-wrap-search').on('click', function (e) {
    $('.lws_mobile').slideToggle(400);

  });
  //   scrollToFixed------------------
  $('.fixed-scroll-column-item').scrollToFixed({
    minWidth: 1064,
    marginTop: 200,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.fixed-scroll-column-item').outerHeight() - 46;
      return a;
    }
  });
  $('.fix-map').scrollToFixed({
    minWidth: 1064,
    zIndex: 0,
    marginTop: 110,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.fix-map').outerHeight(true);
      return a;
    }
  });
  $('.scroll-nav-wrapper').scrollToFixed({
    minWidth: 768,
    zIndex: 1112,
    marginTop: 110,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.scroll-nav-wrapper').outerHeight(true) - 190;
      return a;
    }
  });
  $('.back-to-filters').scrollToFixed({
    minWidth: 1064,
    zIndex: 12,
    marginTop: 190,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.back-to-filters').outerHeight(true) - 30;
      return a;
    }
  });
  $('.dasboard-sidebar-content').scrollToFixed({
    minWidth: 1064,
    zIndex: 12,
    marginTop: 130,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.dasboard-sidebar-content').outerHeight(true) - 48;
      return a;
    }
  });
  $('.help-bar').scrollToFixed({
    minWidth: 1064,
    zIndex: 12,
    marginTop: 130,
    removeOffsets: true,
    limit: function () {
      var a = $('.limit-box').offset().top - $('.help-bar').outerHeight(true) + 10;
      return a;
    }
  });
  if ($('.fixed-bar').outerHeight(true) < $('.post-container').outerHeight(true)) {
    $('.fixed-bar').addClass('fixbar-action');
    $('.fixbar-action').scrollToFixed({
      minWidth: 1064,
      marginTop: function () {
        var a = $(window).height() - $('.fixed-bar').outerHeight(true) - 100;
        if (a >= 0) return 20;
        return a;
      },
      removeOffsets: true,
      limit: function () {
        var a = $('.limit-box').offset().top - $('.fixed-bar').outerHeight();
        return a;
      }
    });
  } else $('.fixed-bar').removeClass('fixbar-action');
  //   Slick------------------
  var sbp = $('.swiper-button-prev'),
    sbn = $('.swiper-button-next');
  $('.fw-carousel').slick({
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    centerMode: false,
    arrows: false,
    variableWidth: true
  });
  sbp.on('click', function () {
    $('.fw-carousel').slick('slickPrev');
  })

  sbn.on('click', function () {
    $('.fw-carousel').slick('slickNext');
  })
  $('.slideshow-container').slick({
    dots: true,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    fade: true,
    cssEase: 'ease-in',
    infinite: true,
    speed: 1000,
  });
  $('.single-slider').slick({
    infinite: true,
    slidesToShow: 1,
    dots: true,
    arrows: false,
    adaptiveHeight: true
  });
  sbp.on('click', function () {
    $(this).closest('.single-slider-wrapper').find('.single-slider').slick('slickPrev');
  });
  sbn.on('click', function () {
    $(this).closest('.single-slider-wrapper').find('.single-slider').slick('slickNext');
  });
  $('.slider-container').slick({
    infinite: true,
    slidesToShow: 1,
    dots: true,
    arrows: false,
    adaptiveHeight: true,
  });
  $('.slider-container').on('init', function (event, slick) {
    initAutocomplete();
  });
  sbp.on('click', function () {
    $(this).closest('.slider-container-wrap').find('.slider-container').slick('slickPrev');

  });
  sbn.on('click', function () {
    $(this).closest('.slider-container-wrap').find('.slider-container').slick('slickNext');
  });
  $('.single-carousel').slick({
    infinite: true,
    slidesToShow: 3,
    dots: true,
    arrows: false,
    centerMode: true,
    responsive: [{
        breakpoint: 1224,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        }
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '0',
        }
      }
    ]

  });
  sbp.on('click', function () {
    $(this).closest('.slider-carousel-wrap').find('.single-carousel').slick('slickPrev');
  });
  sbn.on('click', function () {
    $(this).closest('.slider-carousel-wrap').find('.single-carousel').slick('slickNext');
  });
  $('.inline-carousel').slick({
    infinite: true,
    slidesToShow: 3,
    dots: true,
    arrows: false,
    centerMode: false,
    responsive: [{
        breakpoint: 1224,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
        }
      }
    ]
  });
  $('.fc-cont-prev').on('click', function () {
    $(this).closest('.inline-carousel-wrap').find('.inline-carousel').slick('slickPrev');
  });
  $('.fc-cont-next').on('click', function () {
    $(this).closest('.inline-carousel-wrap').find('.inline-carousel').slick('slickNext');
  });
  $('.footer-carousel').slick({
    infinite: true,
    slidesToShow: 5,
    dots: false,
    arrows: false,
    centerMode: false,
    responsive: [{
        breakpoint: 1224,
        settings: {
          slidesToShow: 4,
          centerMode: false,
        }
      },

      {
        breakpoint: 568,
        settings: {
          slidesToShow: 3,
          centerMode: false,
        }
      }
    ]

  });
  $('.fc-cont-prev').on('click', function () {
    $(this).closest('.footer-carousel-wrap').find('.footer-carousel').slick('slickPrev');
  });
  $('.fc-cont-next').on('click', function () {
    $(this).closest('.footer-carousel-wrap').find('.footer-carousel').slick('slickNext');
  });
  $('.listing-carousel').slick({
    infinite: true,
    slidesToShow: 4,
    dots: true,
    arrows: false,
    centerMode: true,
    centerPadding: '60px',
    responsive: [{
        breakpoint: 1224,
        settings: {
          slidesToShow: 3,
        }
      },

      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,

        }
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          centerPadding: '0',
        }
      }
    ]

  });
  sbp.on('click', function () {
    $(this).closest('.list-carousel').find('.listing-carousel').slick('slickPrev');
  });
  sbn.on('click', function () {
    $(this).closest('.list-carousel').find('.listing-carousel').slick('slickNext');
  });
  $('.slider-for').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    dots: true,
    asNavFor: '.slider-nav'
  });
  $('.slider-nav').slick({
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: '.slider-for',
    dots: false,
    arrows: false,
    centerMode: true,
    focusOnSelect: true
  });
  sbp.on('click', function () {
    $(this).closest('.single-slider-wrapper').find('.slider-for').slick('slickPrev');
  });
  sbn.on('click', function () {
    $(this).closest('.single-slider-wrapper').find('.slider-for').slick('slickNext');
  });
  $('.light-carousel').slick({
    infinite: true,
    slidesToShow: 2,
    dots: false,
    arrows: false,
    centerMode: false,
    responsive: [{
        breakpoint: 1224,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '0',
        }
      }
    ]
  });
  $('.lc-prev').on('click', function () {
    $(this).closest('.light-carousel-wrap').find('.light-carousel').slick('slickPrev');
  });
  $('.lc-next').on('click', function () {
    $(this).closest('.light-carousel-wrap').find('.light-carousel').slick('slickNext');
  });
  // Styles ------------------
  if ($('footer.main-footer').hasClass('fixed-footer')) {
    $('<div class="height-emulator fl-wrap"></div>').appendTo('#main');
  }

  function csselem() {
    $('.height-emulator').css({
      height: $('.fixed-footer').outerHeight(true)
    });
    $('.slideshow-container .slideshow-item').css({
      height: $('.slideshow-container').outerHeight(true)
    });
    $('.slider-container .slider-item').css({
      height: $('.slider-container').outerHeight(true)
    });
    $('.map-container.column-map').css({
      height: $(window).outerHeight(true) - 110 + 'px'
    });
  }
  csselem();
  // Mob Menu------------------
  $('.nav-button-wrap').on('click', function () {
    $('.main-menu').toggleClass('vismobmenu');
  });

  function mobMenuInit() {
    var ww = $(window).width();
    if (ww < 1064) {
      $('.menusb').remove();
      $('.main-menu').removeClass('nav-holder');
      $('.main-menu nav').clone().addClass('menusb').appendTo('.main-menu');
      $('.menusb').menu();
      $('.map-container.fw-map.big_map.hid-mob-map').css({
        height: $(window).outerHeight(true) - 110 + 'px'
      });
    } else {
      $('.menusb').remove();
      $('.main-menu').addClass('nav-holder');
      $('.map-container.fw-map.big_map.hid-mob-map').css({
        height: 550 + 'px'
      });
    }
  }
  mobMenuInit();
  //   css ------------------
  var $window = $(window);
  $window.on('resize', function () {
    csselem();
    mobMenuInit();
    if ($(window).width() > 1064) {
      $('.lws_mobile , .dasboard-menu-wrap').addClass('vishidelem');
      $('.map-container.fw-map.big_map.hid-mob-map').css({
        'right': '0'
      });
      $('.map-container.column-map.hid-mob-map').css({
        'right': '0'
      });
    } else {
      $('.lws_mobile , .dasboard-menu-wrap').removeClass('vishidelem');
      $('.map-container.fw-map.big_map.hid-mob-map').css({
        'right': '-100%'
      });
      $('.map-container.column-map.hid-mob-map').css({
        'right': '-100%'
      });
    }
  });
  $('.box-cat').on({
    mouseenter: function () {
      var a = $(this).data('bgscr');
      $('.bg-ser').css('background-image', 'url(' + a + ')');
    }
  });
}
//   Parallax ------------------
function initparallax() {
  var a = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return a.Android() || a.BlackBerry() || a.iOS() || a.Opera() || a.Windows();
    }
  };
  trueMobile = a.any();
  if (null === trueMobile) {
    var b = new Scrollax();
    b.reload();
    b.init();
  }
  if (trueMobile) $('.bgvid , .background-vimeo , .background-youtube-wrapper ').remove();
}
//   Star Raiting ------------------
function cardRaining() {
  $.fn.duplicate = function (a, b) {
    var c = [];
    for (var d = 0; d < a; d++) $.merge(c, this.clone(b).get());
    return this.pushStack(c);
  };
  var cr = $('.card-popup-raining'),
    sts = $('.section-title-separator span');
  cr.each(function (cr) {
    var starcount = $(this).attr('data-starrating');
    $('<i class=\'fas fa-star\'></i>').duplicate(starcount).prependTo(this);
  });
  sts.each(function (sts) {
    $('<i class=\'fas fa-star\'></i>').duplicate(3).prependTo(this);
  })
}
cardRaining();
var cr2 = $('.card-popup-rainingvis');
cr2.each(function (cr) {
  var starcount2 = $(this).attr('data-starrating2');
  $('<i class=\'fa fa-star\'></i>').duplicate(starcount2).prependTo(this);
});


$('.dasboard-menu-btn').on('click', function () {
  $('.dasboard-menu-wrap').slideToggle(500);
});
$('.list-single-facts .inline-facts-wrap').matchHeight({});
$('.listing-item-container  .listing-item').matchHeight({});
$('.article-masonry').matchHeight({});
$('.grid-opt li span').on('click', function () {
  $('.listing-item').matchHeight({
    remove: true
  });
  setTimeout(function () {
    $('.listing-item').matchHeight();
  }, 50);
  $('.grid-opt li span').removeClass('act-grid-opt');
  $(this).addClass('act-grid-opt');
  if ($(this).hasClass('two-col-grid')) {
    $('.listing-item').removeClass('has_one_column');
    $('.listing-item').addClass('has_two_column');
  } else if ($(this).hasClass('one-col-grid')) {
    $('.listing-item').addClass('has_one_column');
  } else {
    $('.listing-item').removeClass('has_one_column').removeClass('has_two_column');
  }
});

//   Init All ------------------
$(document).ready(function () {
  initEasybook();
  initparallax();
});



$(document).ready(function () {
  $('#filtre').on('change', function () {
    var elems = this.value == 'all' ? $('.listing-item') : $('.listing-item[data-type="' + this.value + '"]');
    $('.listing-item').not(elems.show()).hide();
  });
});