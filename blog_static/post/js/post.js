( function( $ ) {


    // 処理の記述ここから　－－－－－－－－－－－－－－－－－－－－
    /* ====================================================================
    イベント
    ====================================================================*/

    $( function() {

        navCurrent();
        singleInit();
        filter();
        // articleAction();
        if ( $( 'body' ).hasClass( 'isSP' ) ) {
            resizeBoximg();
        }

        /* ====================================================================
        処理
        ====================================================================*/
        /* =========================
        WORK INTERVIEW のナビのカレント表示
        =========================*/
        function navCurrent() {
            var postType = '';
            var Nav = $( '#gNav li,#fNav li' );
            if ( $( 'body' ).hasClass( 'post-type-archive-work' ) || $( 'body' ).hasClass( 'single-work' ) || $( 'body' ).hasClass( 'tax-work_cat' ) || $( 'body' ).hasClass( 'search' ) ) {
                postType = 'WORK';
            } else if ( $( 'body' ).hasClass( 'post-type-archive-interview' ) || $( 'body' ).hasClass( 'single-interview' ) ) {
                postType = 'INTERVIEW';
            } else if ( $( 'body' ).hasClass( 'single-post' ) ) {
                postType = 'NEWS';
            }
            for ( var i = 0; i < Nav.length; i++ ) {
                if ( $( Nav[ i ] ).children().text() == postType ) {
                    $( Nav[ i ] ).children().css( 'transition', 'none' );
                    $( Nav[ i ] ).addClass( 'current_page_item' );
                }
            }
        }

        /* =========================
        記事詳細ページのHTML構造の制御
        =========================*/
        function singleInit() {
            // パンくずをタイトルから取得するため、改行があった場合に削除
            $( '#breadcrumb br' ).remove();
            // 記事詳細ページの設定
            $( '.block_contents' ).each( function() {
                //imgが自動でpにラップされるのを防ぐ
                $( this ).find( 'img,.caption,iframe' ).unwrap();
                //dashがpでラップされていない場合、ラップする
                $( '.dash' ).each( function() {
                    if ( !( $( this ).parent().is( 'p' ) ) && !( $( this ).parent().is( '.block_contents' ) ) ) {
                        $( this ).unwrap().wrap( '</p>' );
                    } else if ( $( this ).parent().is( '.block_contents' ) ) {
                        $( this ).wrap( '</p>' );
                    }
                } );
                //captionの直前の要素にhascaptionをつける
                $( this ).children( 'img' ).next().each( function() {
                    if ( $( this ).hasClass( 'caption' ) ) {
                        $( this ).prev().addClass( 'hascaption' )
                    }
                } );
                // 最後の p にlastをつける
                $( this ).children( 'p' ).next().each( function() {
                    if ( $( this ).is( 'img' ) || $( this ).is( 'iframe' ) ) {
                        $( this ).prev().addClass( 'last' )
                    }
                } );
            } );
        }

        /* =========================
        INTERVIEW のメインビジュアル部分のレイアウト調整（スマホ時）
        =========================*/
        function resizeBoximg() {
            var box_img = $( '.article_detailInterview .block>div.block_intro .box_img' );
            var height_box_img = box_img.height();
            var height_img = $( '.article_detailInterview .block>div.block_intro .box_img img.sp' ).height();
            if ( height_box_img < height_img ) {
                box_img.css( 'height', 'auto' )
            }
        }


        /* =========================
        WORK カテゴリフィルターのレイアウト制御
        =========================*/
        function filter() {
            // 読み込み時にアコーディオンの高さをセット、カテゴリの増減に対応
            var searchformH = $( '.searchformWrapper' ).height();
            var filterH = $( '.filterWrapper' ).height();
            $( '.searchformWrapper,.filterWrapper' ).css( 'height', '0' );
            $( 'head' ).append( '<style>.searchformWrapper.active {height: ' + searchformH + 'px !important;} .filterWrapper.active {height: ' + filterH + 'px !important;}</style>' )
                //toggleにclassを追加
            $( '.toggle_filter, .toggle_search' ).click( function() {
                if ( $( this ).hasClass( 'active' ) ) {
                    $( '.box_filter *' ).removeClass( 'active' );
                    return false;
                }
                $( '.box_filter *' ).removeClass( 'active' );
                $( this ).toggleClass( 'active' );
                var clickedClass = $( this ).attr( "class" );
                if ( clickedClass.indexOf( 'toggle_filter active' ) != -1 ) {
                    $( '.filterWrapper' ).addClass( 'active' );
                } else if ( clickedClass.indexOf( 'toggle_search active' ) != -1 ) {
                    $( '.searchformWrapper' ).addClass( 'active' );
                }
            } );
        }

        /* =========================
        記事一覧の表示制御
        =========================*/
        function articleAction() {

            var listCardParent = $( '[class*="article_list"] .block > ul' );
            var listCard = listCardParent.children();

            //記事リスト表示アニメーション（ページ表示時）
            listCardParent.AddClassActions( {
                action: 'scroll',
                speed: 120,
                firePosition: 600
            } );

            // =================================================

            // 次のページが存在する場合
            // 記事リストの下揃えの処理（はみ出した分にhideをつけ、非表示に）
            // infiniteScrollの実行

            if ( !( $( '#next a.next' ).length == 0 ) ) {
                // はみ出した分の記事を取得 ==================================================
                // 記事リストのうち、上部に表示される分にclassを付け、それらをlatestListCardとして保存
                // ※この追加classに対しはレイアウトが効いていない点に注意、特定のレイアウトのものがlatestを持つようになる。
                for ( var i = 0; i < listCard.length; i++ ) {
                    $( listCard[ i ] ).addClass( 'latest' );
                    if ( $( listCard[ i ] ).width() !== $( listCard[ i + 1 ] ).width() ) {
                        break;
                    }
                }
                var latestListCard = listCardParent.children( '.latest' );
                // はみ出した分の記事数を取得：一列に並んだ記事/列数のあまり。overListCardに格納。
                var overListCardNum;
                if ( $( 'body' ).hasClass( 'isSP' ) ) {
                    if ( $( 'body' ).hasClass( 'blog' ) ) {
                        overListCardNum = listCard.length % 2;
                    } else {
                        overListCardNum = ( listCard.length - latestListCard.length ) % 2;
                    }
                } else {
                    if ( $( 'body' ).hasClass( 'blog' ) ) {
                        overListCardNum = listCard.length % 3;
                    } else {
                        overListCardNum = ( listCard.length - latestListCard.length ) % 3;
                    }
                }
                var overListCard = '[class*="listcard"]:nth-last-child(-n+' + overListCardNum + ')';
                // はみ出した分の記事にchildが付いているものを検索（addClassの処理が終わるまで処理を繰り返す）、hideを追加し、非表示に。
                var seachClass = function( counter ) {
                    if ( counter == null ) {
                        var counter = 0;
                    } else {
                        var counter = counter;
                    }
                    setTimeout( function() {
                        $( overListCard ).each( function() {
                            if ( $( this ).hasClass( 'child' ) ) {
                                $( this ).removeClass( 'child' ).addClass( 'hide' );
                                counter++;
                            }
                        } )
                        if ( counter == overListCardNum ) {
                            return false;
                        }
                        seachClass( counter );
                    }, 100 );
                }
                seachClass();

                // listCardParent.infiniteScroll( {
                //     path: '#next a.next',
                //     append: '[class*="listcard"]',
                //     history: false,
                //     button: '.btn_more',
                //     scrollThreshold: false,
                // } );

                listCardParent.on( 'append.infiniteScroll', function( event, response, path ) {
                    // 読み込後の記事を取得
                    listCard = listCardParent.children();
                    // ループカウントから、はみ出した記事分を引き取得。
                    var count = listCardParent.data( 'count' ) - overListCardNum;
                    // はみ出した分の記事数を再取得。
                    if ( $( 'body' ).hasClass( 'isSP' ) ) {
                        if ( $( 'body' ).hasClass( 'blog' ) ) {
                            overListCardNum = listCard.length % 2;
                        } else {
                            overListCardNum = ( listCard.length - latestListCard.length ) % 2;
                        }
                    } else {
                        if ( $( 'body' ).hasClass( 'blog' ) ) {
                            overListCardNum = listCard.length % 3;
                        } else {
                            overListCardNum = ( listCard.length - latestListCard.length ) % 3;
                        }
                    }
                    var element = listCardParent;
                    var addClassLoop = function( element, settings ) {
                        var children = element.children();
                        var id = setTimeout( function() {
                            // ターゲットのdata-count属性にカウント数を追加していく。
                            if ( children[ count ] ) {
                                $( children[ count ] ).removeClass( 'hide' ).addClass( 'child' );
                            } else {
                                if ( $( '.btn_more' ).css( 'display' ) == 'block' ) {
                                    var overListCard = '[class*="listcard"]:nth-last-child(-n+' + overListCardNum + ')';
                                    $( overListCard ).removeClass( 'child' ).addClass( 'hide' );
                                }
                                return false;
                            }
                            count++;
                            element.data( 'count', count );
                            addClassLoop( element, settings );
                        }, 120 );
                    };
                    addClassLoop( element );
                } );
            } else {
                $( '.btn_more' ).css( 'display', 'none' );
            }
        }

    } );

} )( jQuery );