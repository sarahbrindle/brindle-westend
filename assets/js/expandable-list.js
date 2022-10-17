/**
 * Add expanding behavior to a unordered list.
 *
 * Add the classname 'ct-expanding-list-block' to a div (or container block) that contains
 * the following two Gutenberg blocks:
 *    1. Unordered list
 *    2. Button (which is really just a link)
 *
 * When the button is clicked, the list will expand by x number of list items.
 */

 ; jQuery(function ($) {
    'use strict';

    // Display only this number of list items with each button click.
    // Our corresponding stylesheet will hide all but this number of list items.
    // If you change this number, change that line in the stylesheet also.
    let visibleCount = 5;

    // Duration of our slide effect in displaying list items.
    let slideDuration = 500; // milliseconds

    // Don't waste our time if no blocks are on this page.
    let $expandingListBlocks = $('.ct-expanding-list-block');

    if (!$expandingListBlocks.length) {
        return;
    }

    /**
     * Returns true if all of the given list items are visible.
     *
     * @param jQuery $listItems
     * @returns bool
     */
    function isAllItemsOpen($listItems) {
        return $listItems.length === $listItems.filter(':visible').length;
    }

    /**
     * Hide the button for this list.
     *
     * @param jQuery $expandingListBlock
     */
    function hideButtonIfAllItemsOpen($expandingListBlock) {
        let $button    = $expandingListBlock.find('.wp-block-button__link').first();
        let $listItems = $expandingListBlock.find('li');

        // Hide the button if all list items are visible. Let's do so with some animation!
        if (isAllItemsOpen($listItems)) {
            // Get the GB button container.
            let $buttonGroup = $button.closest('.wp-block-buttons');

            $buttonGroup.animate({
                height: 0,
                opacity: 0
            }, slideDuration);
        }
    }

    /**
     * Initialize our lists to display only the first x number of list items.
     */
    function initLists() {
        $expandingListBlocks.each(function (index) {
            let $expandingListBlock = $(this);
            let $listItems = $expandingListBlock.find('li');

            // Show only the first x number of list items.
            $listItems.slice(0, visibleCount).show();
            $listItems.slice(visibleCount).hide();

            // Remove visibility on the button if all list items are exposed.
            hideButtonIfAllItemsOpen($expandingListBlock);
        });
    }

    /**
     * Initialize our buttons
     */
    function initButtons() {
        let $buttons = $expandingListBlocks.find('.wp-block-button__link');

        $buttons.on('click', function (e) {
            e.preventDefault();

            // Get a handle to our button, container, and all list items.
            let $button = $(this);
            let $expandingListBlock = $button.closest('.ct-expanding-list-block');
            let $listItems = $expandingListBlock.find('li');

            // Grab the next x number of hidden list items and animate their display.
            $listItems.filter(':hidden').slice(0, visibleCount).each(function (index) {
                $(this).slideDown(slideDuration);
            });

            hideButtonIfAllItemsOpen($expandingListBlock);
        });
    }

    function init() {
        initLists();
        initButtons();
    }

    init();
});
