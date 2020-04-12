$(document).ready(function() {
  $('.d-article img').on('click', function() {
    window.open($(this).attr('src'));
  });
});
