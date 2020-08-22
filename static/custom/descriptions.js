function initialize_descriptions() {
  $(document).ready(function() {

    // Read R Markdown Metadata
    const metadata = $.parseJSON($("#radix-rmarkdown-metadata").html());

    // Append Title Tags Area
    $('.d-title')
      .prepend(
          $('<h1/>')
              .attr("id", "title_tags")
              .css("line-height", "0.6em")
              .css("margin-bottom", "20px")
      );

    // If there is/are manually specified type(s)
    if (metadata.attributes.names.value.includes("type")) {
      const type_index  = metadata.attributes.names.value.indexOf("type");
      const type_values = metadata.value[type_index].value;
      type_values.map((type_value) => {
          let color = null;
          let bgclr = null;
          let blurb = null;
          switch(type_value.toLowerCase()) {
            case "newsletter":
              color = "#faa05a";
              bgclr = "#fff6f0";
              blurb = `
                I'm writing a short, quick-fire newsletter that focuses on
                day-to-day issues faced by data people in their work. As such,
                a lot of the content here will be based on my opinions and
                experience.
              `;
              break;
            default:
              color = "#008080";
              break;
          }
          $('#title_tags')
            .append(
              $('<span/>')
                .addClass("uk-label")
                .css('background-color', color)
                .css('margin-right', '5px')
                .html(type_value)
            );
          if (blurb) {
            $('.d-article')
              .prepend(
                $('<div/>')
                  .attr('uk-alert', '')
                  .css("background-color", bgclr)
                  .css("color", color)
                  .css("font-size", "0.9em")
                  .css("line-height", "1.2em")
                  .addClass("l-body-outset")
                  .html(blurb)
                  .append(
                    $('<a/>')
                      .attr("uk-close", "")
                      .addClass("uk-alert-close")
                  )
              );
          }
      });
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
}

