/*!
 * jquery.iPreview() - v1.0.0
 *
 * Depends on jQuery
 * http://jquery.com/
 *
 * Copyright 2013 Masunaga Ray, standing on the shoulders of giants
 * http://www.msng.info/
 *
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.html
 */
;(function($) {
    'use strict';

    $.fn.iPreview = function(options) {
        // Merge defaults to options
        var settings = $.extend(true, {}, $.fn.iPreview.defaults, options);

        return this.filter('input[type=file]').each(function() {
            // Triggered when the file is selected or changed
            $(this).on('change', function() {
                var previews = $(settings.container);

                // Loop in case `multiple` attribute is set
                $.each(this.files, function(index, file) {
                    // Filter image files
                    if (file.type.match(/^image\/*/)) {
                        var reader = new FileReader();

                        // Triggered when a file loading is finished
                        reader.onload = (function() {
                            // Generate a new img element
                            var preview = $('<img>').addClass(settings.class).css(settings.css)
                                .attr('src', reader.result);

                            if (settings.wrapper) {
                                preview = $(settings.wrapper).html(preview);
                            }

                            previews.append(preview);
                        });

                        // Read the image file as Data URI scheme
                        reader.readAsDataURL(file);
                    }
                });

                // Remove the previews when the input is changed to replace with new ones
                $(this).on('change', function() {
                    previews.remove();
                });

                // If target is specified, previews are placed at the position to the target;
                // if not, inserted just after the input element.
                if (settings.target) {
                    switch (settings.position) {
                        case 'prepend':
                            previews.prependTo($(settings.target));
                            break;
                        case 'before':
                            previews.insertBefore($(settings.target));
                            break;
                        case 'after':
                            previews.insertAfter($(settings.target));
                            break;
                        default:
                            previews.appendTo($(settings.target));
                            break;
                    }
                } else {
                    previews.insertAfter(this);
                }

                // Hide `hideOnPreview` elements and Show `showOnPreview`
                $(settings.hideOnPreview).hide();
                $(settings.showOnPreview).show();

                // Reset everything on form reset
                $(this).parents('form').on('reset', function() {
                    previews.remove();
                    $(settings.hideOnPreview).show();
                    $(settings.showOnPreview).hide();
                });
            });
        });
    };

    // Default setting values
    $.fn.iPreview.defaults = {
        // When a jQuery selector is set, previews are appended to the element;
        // if not set, inserted after `this` input element and the "position" is omitted.
        target: '',

        // Position of the previews to the target;
        // omitted if the "target" is not specified.
        // (before|after|prepend|append)
        position: 'append',

        // HTML element used as the container of previews
        container: '<div class="previews"></div>',

        //HTML element used as the wrapper of each preview
        wrapper: '',

        // Class name for each thumbnail
        class: 'thumbnail',

        // Styles applied to each thumbnail
        css: {
            maxWidth: '300px',
            maxHeight: '300px'
        },

        // Selectors for elements to be hidden on preview
        hideOnPreview: '',

        // Selectors for elements to be shown on preview
        showOnPreview: ''
    };
})(jQuery);
