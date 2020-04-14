function initialize_code_folding() {

    function toggle_code() {
        const $this = $(this);
        const $code_block = $this.parent().parent();
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
        const $code_blocks = $('.code-block-wrapper');
        $code_blocks
            .css('height', '')
            .css('overflow-y', '')
            .css('overflow-x', '')
            .removeClass('code-hide')
            .find('.code-folder')
            .html('HIDE CODE');
    }

    function hide_all_code() {
        const $code_blocks = $('.code-block-wrapper');
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

    function copy_code() {
        // Remove all other buttonface
        $('button.code-copier').css('background-color', 'buttonface');
        // Create hidden input
        const $textarea = $('<textarea/>');
        $('body').append($textarea);
        // Grab the text to be copied
        const code = $(this)
            .css('background-color', '#32d296')
            .parent().parent()
            .find('d-code').text();
        // Put text into input and select it
        $textarea.val(code).select();
        // Execute the copy
        document.execCommand("Copy");
        // Remove the temporary element
        $textarea.remove();
    }

    $(window).on('load', function() {
        // Add show/hide buttons to code blocks
        const code_blocks =
            $('d-code')
                .addClass('code-block')
                .wrap(
                    $('<div/>')
                        .css('position', 'relative')
                        .addClass('code-block-wrapper')
                )
                .wrap(
                    $('<div/>')
                        .css('position', 'relative')
                        .addClass('code-block-inner')
                        .css('overflow-x', 'scroll')
                )
                .parent()
                .parent()
                .append(
                    $('<div/>')
                    .css('position', 'absolute')
                    .css('top', '-5px')
                    .css('right', '0px')
                    .append(
                        $('<button/>')
                        .html('COPY CODE')
                        .css('line-height', '1rem')
                        .css('font-size', '0.6rem')
                        .css('margin-right', '5px')
                        .addClass('uk-button uk-button-small code-copier')
                        .click(copy_code)
                    )
                    .append(
                        $('<button/>')
                        .html('HIDE CODE')
                        .css('line-height', '1rem')
                        .css('font-size', '0.6rem')
                        .addClass('uk-button uk-button-small code-folder')
                        .click(toggle_code)
                    )
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
