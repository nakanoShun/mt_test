( function( $ ) {

    $( document ).ready( function() {

        // 処理の記述ここから　－－－－－－－－－－－－－－－－－－－－
        /* ====================================================================
        イベント
        ====================================================================*/
        $( '.ttl_page' ).AddClassActions( {
            action: 'ready',
            speed: 0,
            firePosition: -1
        } );
        $( '.box_decoration' ).AddClassActions( {
            action: 'ready',
            speed: 0,
        } );
    } );
} )(jQuery);