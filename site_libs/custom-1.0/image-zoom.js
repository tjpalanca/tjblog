$(window).on("load", function() {
  $('d-article .figure img').on('click', function() {
    window.open($(this).attr('src'));
  });
});
