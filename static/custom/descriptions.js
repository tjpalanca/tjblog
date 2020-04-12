$(document).ready(function() {

  if (window.location.pathname.match('/notes/.+$')) {
    $('.d-article')
      .prepend(
        $('<div/>')
          .attr('uk-alert', '')
          .addClass("uk-alert-primary")
          .css("font-size", "0.9em")
          .css("line-height", "1.2em")
          .html(`
            You are visiting the <strong>Field Notes</strong> section of my
            website, which contains unfiltered, unverified, and unorganized
            thoughts, ideas, and solutions that come up in my day-to-day work.
            The hope is that other people working in data may also encounter
            the same edge cases, gotchas, and other organizational or technical
            problems and that this resource is helpful to them. For my regular
            blog posts, please go <a href="https://www.tjpalanca.com/blog.html">
            here</a>.
          `)
      );
  }

  if (window.location.pathname.match('blog.html$')) {
    if ($('.posts-list-description').length === 0) {
      $('.posts-list-caption')
        .css('font-weight', 'bold')
        .html(String.fromCodePoint('0x2712') + " Blog Posts")
        .after(
          $('<div/>')
            .addClass('uk-text-meta')
            .addClass('posts-list-description')
            .css('max-width', '800px')
            .html(`
              Blog posts are the results of projects, deep analyses on topical or
              other issues, or commentary on a specific issue. My favorite
              topics involve the Philippines, economics, politics, and of
              course data science and analytics.
            `)
        );
    }
  }

  if (window.location.pathname.match('notes.html$')) {
    if ($('.posts-list-description').length === 0) {
      $('.posts-list-caption')
        .css('font-weight', 'bold')
        .html(String.fromCodePoint('0x1F4D3') + " Field Notes")
        .after(
          $('<div/>')
            .addClass('uk-text-meta')
            .addClass('posts-list-description')
            .css('max-width', '800px')
            .html(`
              Field notes are unfiltered, unverified, and unorganized
              thoughts, ideas, and solutions that come up in my day-to-day work.
              The hope is that other people working in data may also encounter
              the same edge cases, gotchas, and other organizational or technical
              problems and that this resource is helpful to them. For my regular
              blog posts, please go
              <a href="https://www.tjpalanca.com/blog.html">here</a>.
            `)
        );
    }
  }

});
