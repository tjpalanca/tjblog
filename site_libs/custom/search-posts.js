function initialize_search_posts() {

  function get_posts() {
    if (typeof(POSTS) == "undefined") {
      // Fetch the posts from posts/posts.json
      POSTS = $.parseJSON(
        $.ajax({
          type     : 'GET',
          url      : 'posts/posts.json',
          dataType : 'json',
          async    : false
        }).responseText
      );
    }
  }

  function build_search_index() {
    if (typeof(SEARCH_INDEX) == "undefined") {
      // Fetch Posts list
      get_posts();
      // Build the Lunr.JS Index
      SEARCH_INDEX = lunr(function () {
        // Define fields
        this.ref('path');
        this.field('title');
        this.field('description');
        this.field('author_names');
        this.field('categories');
        // Build the index
        POSTS.map(function(post) {
          post.author_names = post.author.map((a) => a.name).join(", ");
          post.categories =post.categories .join(", ");
          return post;
        }).forEach(function (post) {
          this.add(post);
        }, this);
      });
    }
  }

  function make_post_visible(ref) {
    const post = $(`a[href$="${ref}"]`);
    set_posts_visible(post, true);
    $('.posts-list').append(post);
  }

  function search_posts() {
    // Fetch the search string
    const search_string = $('input#search_string').val();
    // If search string is not blank perform search
    if (search_string !== "") {
      // Build the search index
      build_search_index();
      // Perform the search
      const search_results = SEARCH_INDEX.search(search_string);
      // If there are search results
      if (search_results.length) {
        $('#search_string').removeClass('uk-form-danger');
        // Hide all articles first
        hide_all_posts();
        // Show only the matching posts
        search_results
          .map(r => r.ref)
          .map(make_post_visible);
        // Add explainer line
        if ($('p#search_description').length) {
          $('p#search_description')
            .show()
            .html(`Search results for: ${search_string}`);
        } else {
          $(`<p id="search_description">Search results for: ${search_string}</p>`)
            .insertAfter($('.posts-list-caption'));
        }

      } else {
        $('#search_string').addClass('uk-form-danger');
      }
      // clear active state
      $('.categories .active').removeClass('active');
      // Show the reset button
      $('button#search_button').hide();
      $('button#reset_button').show();
    } else {
      $('#search_string').addClass('uk-form-danger');
    }
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
            .append($("<h3/>").html("AUTHORS"))
            .append($("<ul/>").attr("id", "author_list"))
        );

      // Add each atuhort
      for (let [author_name, num_posts] of Object.entries(author_list)) {
        $("ul#author_list")
          .append(
            $("<li/>")
              .append(
                $("<a/>")
                  .attr("href", "#")
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

  }

  function apply_hash_filter() {

    // clear active state
    $('.categories .active').removeClass('active');

    // mark all posts invisible to start
    hide_all_posts()

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

  function reset_search_posts() {
    // Resort all posts
    get_posts();
    POSTS.map(post => make_post_visible(post.path));
    // Reset
    apply_post_limits(true);
    apply_hash_filter();
    // Switch Buttons
    $('button#search_button').show();
    $('button#reset_button').hide();
    $('#search_description').hide();
    $('#search_string').removeClass('uk-form-danger');
  }

  $(document).ready(function() {
    if ($('.posts-list').length > 0) {
      $('div#search_widget').show();
      $('input#search_string')
        .on("keyup", function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            $("#search_button").click();
          }
        });
      $('button#search_button').click(function() {
        search_posts();
      });
      $('button#reset_button').click(function() {
        reset_search_posts();
      });
      construct_author_list();
    }
  });

}
