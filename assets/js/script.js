jQuery(document).ready(function() {
  jQuery('#masthead').scrollToFixed();
});

jQuery( document ).ready( function( $ ) {
    $( '.close-bar' ).on( 'click', function( e ) {
        e.preventDefault();

        $( 'body' ).css( 'transformY', '-145px' ); /* height of top bar */
    } );
} );

jQuery( document ).ready( function( $ ) {
    $( ".full-list" ).each(function( i ) {         
        if( $(this).length )         // use this if you are using id to check
        {
            $(this).children('li:gt(4)').hide();
        }
    });
    $( '.view-full-list' ).on( 'click', function( e ) {
        e.preventDefault();         
        $(this).parent().parent().find(".full-list").children('li:gt(4)').show();
    } );
} );


jQuery( document ).ready( function( $ ) {
    //alert('hi');
    jQuery('.popup-youtube').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
    jQuery('.popup-video .wp-block-button__link').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
    jQuery('.popup-video .gb-container-link').magnificPopup({
        disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
});