function resizeIframe(iframe) {
  iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
}

$(document).ready(function() {
  $('.d-article > div > iframe').on('load', function() {
    resizeIframe($(this)[0]);
  });
});

$(window).resize(function() {
  $('.d-article > div > iframe').each(function() {
    $(this).trigger('load');
  });
});
