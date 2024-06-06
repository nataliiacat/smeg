$(function () {
  $('.top-slider__inner').slick({
    dots: false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1000,
  })

  $('.news-slider').slick({
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    loop:false,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,

  });
})
