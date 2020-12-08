function initialize_search_posts() {

  function make_post_visible(ref) {
    const post = $(`d-article a[href$="${ref}"]`);
    set_posts_visible(post, true);
    $('.posts-list').append(post);
  }

  function add_search_description(description) {
    if ($('p#search_description').length) {
      $('p#search_description')
        .show()
        .html(description);
    } else {
      $(`
        <p id="search_description" style="margin-top: 10px">
          ${description}
        </p>
      `)
        .insertAfter($('.posts-list-description'));
    }
  }

  function hide_search_description() {
    $('#search_description').hide();
  }

  function construct_author_list() {

      // Get the author list
      get_posts();
      const author_list = POSTS
        .map(post => post.author.map(a => a.name))
        .flat()
        .reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null));

      // Add the author scaffolding
      $(".sidebar-section.categories")
        .before(
          $("<div/>")
            .addClass("sidebar-section categories")
            .append($("<h3/>").html("Authors"))
            .append($("<ul/>").attr("id", "author_list"))
        );

      // Add each author
      for (let [author_name, num_posts] of Object.entries(author_list)) {
        $("ul#author_list")
          .append(
            $("<li/>")
              .append(
                $("<a/>")
                  .css("cursor", "pointer")
                  .click(() => search_author(author_name))
                  .html(author_name)
              )
              .append(
                $("<span/>")
                  .addClass("category-count")
                  .html(` (${num_posts})`)
              )
          );
      }

  }

  function search_author(author_name) {

    // clear active state
    $("span#author_close").hide();
    $('.categories .active').removeClass('active');

    // mark all posts invisible to start
    hide_all_posts();

    // Filter posts by the author
    get_posts();
    const author_posts = POSTS
      .filter(
        post => post.author
          .map(a => a.name)
          .includes(author_name)
      );

    // Make those author posts visible
    author_posts
      .map(r => r.path)
      .map(make_post_visible);

    // mark the hash active
    $(`.categories li>a:contains(${author_name})`).addClass('active');

    // Add an x beside the author filter
    if ($("span#author_close").length === 0) {
      $("h3:contains('Authors')")
        .append($("<span/>")
        .attr("id", "author_close")
        .attr("uk-icon", "close")
        .css("cursor", "pointer")
        .css("vertical-align", "bottom"));
      $("span#author_close").click(() => {
        show_all_posts();
        $("span#author_close").hide();
        hide_search_description();
      });
    } else {
      $("span#author_close").show();
    }

    // Add explainer line
    add_search_description(`Posts authored by: ${author_name}`);

  }

  function apply_hash_filter() {

    // clear active state
    $('.categories .active').removeClass('active');

    // mark all posts invisible to start
    hide_all_posts();

    // if we have a hash filter
    if (window.location.hash) {

      // mark posts that match the category visible
      var page_category = window.location.hash.replace("#", "");
      var posts = $('.post-metadata').map(function(idx, script) {
        var metadata = $.parseJSON($(script).html());
        var post = null;
        $.each(metadata.categories, function(idx, category) {
          category = category.replace(/ /g,"_");
          if (category == page_category) {
            post = $(script).parent().get();
            return false;
          }
        });
        return post;
      });
      set_posts_visible(posts, true);

      // mark the hash active
      $('.categories li>a[href="' + window.location.hash + '"]').addClass('active');

    } else {

      // no hash filter, make all posts visible (subject to max display)
      set_posts_visible($('.posts-list').children(), true);

    }
  }

  function apply_post_limits(apply) {
    if (apply) {
      $('.posts-container').addClass('posts-apply-limit');
      $('.posts-more a').removeClass('hidden');
    } else {
      $('.posts-container').removeClass('posts-apply-limit');
      $('.posts-more a').addClass('hidden');
    }
  }

  function load_image(img) {
    var src = $(img).attr('data-src');
    if (src) {
      $(img).attr('src', src);
      $(img).load(function() {
        img.removeAttribute('data-src');
      });
    }
  }

  function set_posts_visible(posts, visible) {
    if (visible) {

      // show bottom border by default
      $(posts).removeClass('post-preview-last');

      // apply limits if need be
      var max_posts = 25;
      var apply_limits = $('.posts-container').hasClass('posts-apply-limit');
      if (apply_limits && posts.length > max_posts) {
        posts = $(posts).slice(0, max_posts);
      } else {
        $('.posts-more a').addClass('hidden');
      }

      // apply last style
      $(posts.slice(-1)[0]).addClass('post-preview-last');

      $(posts).removeClass('hidden');
      $(posts).find('img[data-src]').each(function(i, img) {
        load_image(img);
      });
    } else {
      $(posts).addClass('hidden');
    }
  }

  function hide_all_posts() {
    set_posts_visible($('.posts-list').children('a'), false);
  }

  function show_all_posts() {
    // Resort all posts
    get_posts();
    POSTS.map(post => make_post_visible(post.path));
    // Reset
    apply_post_limits(true);
    apply_hash_filter();
  }

  $(document).ready(function() {
    if ($('.posts-list').length > 0) {
      construct_author_list();
      $(window).on('hashchange',function() {
        if (window.location.hash) {
          show_category_close();
          add_search_description(`Posts in category: ${window.location.hash}`);
        }
      });
      if (window.location.hash) {
        show_category_close();
        add_search_description(`Posts in category: ${window.location.hash}`);
      }
    }
  });

  function show_category_close() {
    if ($("span#category_close").length === 0) {
      $("h3:contains('Categories')")
        .append($("<span/>")
        .attr("id", "category_close")
        .attr("uk-icon", "close")
        .css("cursor", "pointer")
        .css("vertical-align", "bottom"));
      $("span#category_close").click(() => {
        window.location.hash = "";
        $("span#category_close").hide();
        hide_search_description();
      });
    } else {
      $("span#category_close").show();
    }
  }

}
