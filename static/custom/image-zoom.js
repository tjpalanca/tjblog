$(document).ready(function() {
  $('.d-article img').on('click', function() {
    window.open($(this).attr('src'));
  });
  $('.d-article .posts-list img').off('click');
});
