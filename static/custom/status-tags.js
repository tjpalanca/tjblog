function initialize_status_tags() {

    function status_tag_color(status_tag) {
        let color = null;
        switch(status_tag.toLowerCase()) {
            default:
                color = "#1e87f0";
                break;
        }
        return color;
    }

    function status_tag_span(status_tag) {
        let tooltip = null;
        switch(status_tag.toLowerCase()) {
            default:
                break;
        }
        const tag_span =
            $('<span/>')
                .addClass("uk-label")
                .css('background-color', status_tag_color(status_tag))
                .css('margin-right', '5px')
                .html(status_tag);
        if (tooltip) {
            tag_span
                .attr('uk-tooltip', `
                    title: ${tooltip};
                    pos: top-left;
                    delay: 250;
                `);
        }
        return tag_span;
    }

    function status_tag_alert(status_tag) {
        let alert_text = null;
        let alert_type = null;
        let alert_close = false;
        switch(status_tag.toLowerCase()) {
            default:
                alert_type = null;
                break;
        }
        if (alert_type) {
            const alert = $('<div/>')
                .attr('uk-alert', '')
                .addClass(`uk-alert-${alert_type}`)
                .addClass("l-body-outset")
                .css("line-height", "1.2em")
                .css("margin-bottom", "1em")
                .css("margin-top", "0")
                .html(alert_text);
            if (alert_close) {
                alert
                    .append(
                        $('<a/>')
                            .attr("uk-close", "")
                            .addClass("uk-alert-close")
                    );
            }
            return alert;
        } else {
            return null;
        }
    }

    function add_categories_tags_posts_list() {

        // Add the category tags to the titles
        $('.post-metadata').map(function(idx, script) {
            const title_area =
                $(script)
                    .parent()
                    .find(".description");
            const metadata = $.parseJSON($(script).html());
            const status_tags =
                metadata
                    .categories
                    .map(c => c[1])
                    .reverse();
            const title_tags_area =
                $('<div/>')
                    .css('margin-bottom', '5px')
                    .css('line-height', '1.1em');
            title_area.prepend(title_tags_area);
            status_tags
                .map((status_tag) => {
                    const color = status_tag_color(status_tag);
                    title_tags_area
                        .prepend(
                            status_tag_span(status_tag)
                                .css('font-size', '11px')
                        );
                });

        });

    }

    function show_status_close() {
        if ($("span#status_close").length === 0) {
            $("h3#status_list_header")
                .append(
                    $("<span/>")
                    .attr("id", "status_close")
                    .attr("uk-icon", "close")
                    .css("cursor", "pointer")
                    .css("vertical-align", "bottom")
                );
            $("span#status_close").click(() => {
                window.location.hash = "";
                $("span#status_close").hide();
            });
        } else {
            $("span#status_close").show();
        }
    }

    if ($('.posts-list').length > 0) {
        $(document).ready(add_status_tags_posts_list);
    }

    function add_status_tags_post_title() {

        // Fetch Category Information
        const rmarkdown = $.parseJSON($("#radix-rmarkdown-metadata").html());
        const categories_index =
            rmarkdown.attributes.names.value.indexOf("categories");
        const categories_values =
            rmarkdown.value[categories_index].value;
        const status_tags =
            categories_values
                .filter(cv => cv.match("^Status ~ "))
                .map(st => st.replace("Status ~ ", ""));

        // Add the tags before the title
        $('.d-title')
            .prepend(
                $('<h1/>')
                    .attr("id", "title_tags")
                    .css("line-height", "0.6em")
                    .css("margin-bottom", "20px")
            );
        status_tags.map((status_tag) => {
            $('#title_tags')
                .append(status_tag_span(status_tag));
            $('.d-article')
                .prepend(status_tag_alert(status_tag));
        });

    }

    // Read metadata
    const metadata = $.parseJSON($("#radix-rmarkdown-metadata").html());

    // Add Categories if needed
    if (metadata.attributes.names.value.includes("categories")) {
        $(document).ready(add_status_tags_post_title);
    }

}
