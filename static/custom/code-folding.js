function initialize_code_folding() {

    function toggle_code() {
        const $this = $(this);
        const $code_block = $this.parent();
        if ($code_block.hasClass("code-hide")) {
            // If hidden, then show
            $code_block
                .css('height', '')
                .css('overflow-y', '')
                .css('overflow-x', '')
                .removeClass('code-hide');
            $this.html("HIDE CODE");
        } else {
            // Otherwise, hide
            $code_block
                .css('height', '1rem')
                .css('overflow-y', 'hidden')
                .css('overflow-x', 'hidden')
                .addClass('code-hide');
            $this.html("SHOW CODE");
        }
    }

    function show_all_code() {
        const $code_blocks = $('.code-block');
        $code_blocks
            .css('height', '')
            .css('overflow-y', '')
            .css('overflow-x', '')
            .removeClass('code-hide')
            .find('.code-folder')
            .html('HIDE CODE');
    }

    function hide_all_code() {
        const $code_blocks = $('.code-block');
        $code_blocks
            .css('height', '1rem')
            .css('overflow-y', 'hidden')
            .css('overflow-x', 'hidden')
            .addClass('code-hide')
            .find('.code-folder')
            .html('SHOW CODE');
    }

    function initialize_page() {
        // Check if the code_folding option is set to hide
        const rmarkdown = $.parseJSON($("#radix-rmarkdown-metadata").html());
        if (rmarkdown.attributes.names.value.includes("code_folding")) {
            const code_folding_index =
                rmarkdown.attributes.names.value.indexOf("code_folding");
            const code_folding_value =
                rmarkdown.value[code_folding_index].value[0];
            if (code_folding_value === "hide") {
                hide_all_code();
            }
        }
    }

    $(window).on('load', function() {
        // Add show/hide buttons to code blocks
        const code_blocks =
            $('d-code')
                .wrap(
                    $('<div/>')
                        .css('position', 'relative')
                        .addClass('code-block-wrapper')
                )
                .parent()
                .addClass('code-block')
                .append(
                    $('<button/>')
                        .html('HIDE CODE')
                        .css('float', 'right')
                        .css('position', 'absolute')
                        .css('top', '0px')
                        .css('right', '0px')
                        .css('line-height', '1rem')
                        .css('font-size', '0.6rem')
                        .addClass('uk-button uk-button-small code-folder')
                        .click(toggle_code)
            );
        // Add a hide all code button if there are code blocks
        if (code_blocks.length > 0) {
            $('d-article')
                .prepend(
                    $('<div/>')
                        .addClass('uk-button-group')
                        .append(
                            $('<button/>')
                                .html('SHOW ALL CODE')
                                .addClass('uk-button uk-button-small')
                                .css('margin-bottom', '10px')
                                .css('margin-right', '10px')
                                .css('width', 'fit-content')
                                .click(show_all_code)
                        )
                        .append(
                            $('<button/>')
                                .html('HIDE ALL CODE')
                                .addClass('uk-button uk-button-small')
                                .css('margin-bottom', '10px')
                                .css('width', 'fit-content')
                                .click(hide_all_code)
                        )
                );
        }
        // Initialize the page
        initialize_page();
    });

}
