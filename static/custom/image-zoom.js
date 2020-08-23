$(document).ready(function() {
  $('.d-article :not(.posts-list) img').on('click', function() {
    window.open($(this).attr('src'));
  });
});
