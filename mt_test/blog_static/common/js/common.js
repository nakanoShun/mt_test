( function( $ ) {

    $( 'document' ).ready( function() {
        isSP( $( '.sp' ).css( 'display' ) );
        imageSwitch();
        page_top();
        spNav();
        addSpan();
        addPrivacyPolicy();

        ( function() {
            var header = $( 'body > header' );
            $( window ).scroll( function() {
                if ( $( this ).scrollTop() > 100 ) {
                    header.addClass( 'header_scroll' );
                } else {
                    header.removeClass( 'header_scroll' );
                }
            } );
        }() );
        ( function() {
            $( 'header #nav_global>nav>ul>li.current-menu-item>a,#nav_global>nav>ul>li>ul li.current-menu-item>a,#companyNav .current-menu-item>a' ).click( function() {
                return false;
            } )
        }() );

        // 動的なリサイズは操作後0.2秒経ってから処理を実行する。
        var resizeTimer;
        $( window ).on( 'resize', function() {
            clearTimeout( resizeTimer );
            resizeTimer = setTimeout( function() {
                imageSwitch();
            }, 200 );
        } );

        // $( '.gNav_contact' ).click( function() {
        //     var href = $( this ).children( 'a' ).attr( 'href' );
        //     pageTabOpen( href );
        //     return false;
        // } )

        if ( $( 'body' ).hasClass( 'isSP' ) ) {
            addGnavSp();
            var windowHeight = $( window ).height() - 55;
            $( '#wrap_gNav ul' ).height( windowHeight );
        } else {
            addGnavPc();
        }

        // ページャーをheaderに移動し（nth-childの邪魔になるので）、表示を消す。
        $( '.moreread' ).insertBefore( 'body>header' );

    } )

    /*==================================================
    SP判定
    ==================================================*/

    function isSP( mark ) {
        mark = mark;
        if ( mark === 'block' ) {
            $( 'body' ).addClass( 'isSP' );
        }
    };

    /*==================================================
    PC・SP画像差替え
    ==================================================*/
    function imageSwitch() {
        var $elem = $( '.imageSwitch' );
        $elem.each( function() {
            $( '.toggle' ).css( 'display' ) === "none" ? $( this ).attr( 'src', $( this ).data( 'src' ).replace( '_sp', '_pc' ) ) : $( this ).attr( 'src', $( this ).data( 'src' ).replace( '_pc', '_sp' ) );
        } );
    }

    /*==================================================
    ページトップ
    ==================================================*/
    function page_top() {
        $( '#btn_pageTop' ).click( function() {
            //id名#pagetopがクリックされたら、以下の処理を実行
            $( 'html,body' ).animate( {
                scrollTop: 0
            }, '300' );
        } );
        //ページトップの出現
        // $( '#btn_pageTop' ).hide();
        // $( window ).scroll( function() {
        //     $( window ).scrollTop() > 0 ? $( '#btn_pageTop' ).slideDown( 600 ) : $( '#btn_pageTop' ).slideUp( 600 );
        // } );
    }

    /*==================================================
    アンカーリンクの挙動
    ==================================================*/
    // 他ページからの遷移時にハッシュタグの場所を表示
    // function scrollPosition( elm, adjust ) {
    //     var id;
    //     var position;
    //     if ( typeof( elm ) === 'string' ) {
    //         if ( elm === "" ) {
    //             return;
    //         }
    //         id = $( elm );
    //         position = $( id ).offset().top - adjust;
    //         setTimeout( function() {
    //             $( 'html, body' ).scrollTop( position );
    //         }, 100 );
    //     } else {
    //         id = $( elm ).attr( 'href' ).split( "/" );
    //         position = $( id[ id.length - 1 ] ).offset().top - adjust;
    //         $( 'html, body' ).animate( { scrollTop: position }, 1000 );
    //     }
    // };

    /*==================================================
    別ウィンドウ表示
    ==================================================*/
    // function pageTabOpen( url ) {
    //     window.open( url, '', 'width=1280,height=830,scrollbars=yes,resizable=yes' );
    // }

    /*==================================================
    SPナビゲーションの開閉
    ==================================================*/
    function spNav() {
        var flag = false,
            scrollpos;
        $( '.toggle' ).click( function() {

            $( 'header nav' ).stop( false, false ).slideToggle();

            $( this ).toggleClass( 'active' );

            $( this ).hasClass( 'active' ) ? flag = true : flag = false;

            if ( flag == true ) {
                $( '#overlay' ).stop( false, false ).fadeIn( 300 );
                scrollpos = $( window ).scrollTop();
                //背景の固定案　1
                //iOSではスクロールを繰り返すと白い余白が出る。
                $( 'body' ).addClass( 'scrollFixed' ).css( {
                    'top': -scrollpos
                } );
                //背景の固定案　2
                //スマホのスクロール機能自体を停止（グローバルメニュー内でのスクロールもできなくなる）
                // $(window).on('touchmove.noScroll', function(e) {
                //     e.preventDefault();
                // });
            } else {
                $( '#overlay' ).stop( false, false ).fadeOut( 300 );
                //スマホのスクロール機能自体の停止を解除
                //背景の固定案　1に対応
                $( 'body' ).removeClass( 'scrollFixed' );
                //背景の固定案　2に対応
                // $(window).off('.noScroll');
                $( window ).scrollTop( scrollpos );
            }
        } );
        $( '#overlay,.icon_close' ).click( function() {
            $( '.toggle' ).trigger( 'click' );
        } );
    }

    /*==================================================
    タブボタン、バックボタンへDOMの追加
    ==================================================*/
    function addSpan() {
        $( '.icon_tabOpen,.icon_backTo' ).each( function() {
            $( this ).append( '<span class="icon"></span>' );
        } );
    }

    /*==================================================
    PCグロナビへのDOM追加
    ==================================================*/
    function addGnavPc() {
        $( '#gNav li' ).append( '<span class="icon_underbar"></span>' );
    }

    /*==================================================
    SPグロナビへのDOM追加
    ==================================================*/
    function addGnavSp() {
        $( '#gNav' ).append( '<li class="sp"><a href="tel:" class="btn_call icon_skewArrow">CALL</a></li>' );
    }

    /*==================================================
    フッターナビへのDOM追加
    ==================================================*/
    function addPrivacyPolicy() {
        $( '#fNav' ).append( '<li><a href="http://amana.jp/isms/" target="_blanc">PRIVACY POLICY</a></li>' );
    }

    /*==================================================
    // タブレットはPCサイトを表示させる
    ==================================================*/
    var UA       = navigator.userAgent;
    var isSPUA     = UA.indexOf('iPhone') > 0 || UA.indexOf('iPod') > 0 || UA.indexOf('Android') > 0 && UA.indexOf('Mobile') > 0;
    var isTabletUA = UA.indexOf('iPad') > 0 || UA.indexOf('Android') > 0;
    if (!isSPUA && isTabletUA) {
        $('head').prepend('<meta name="viewport" content="width=1260">');
        $('body').addClass('tablet');
    }

} )( jQuery );