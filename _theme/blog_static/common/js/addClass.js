;
( function( $ ) {
    //"use strict"は、jquery文法に忠実に従うための宣言。間違えるとエラーになる
    "use strict";
    //newをし忘れたとしても、ここで空のobjectを生成するための記述かと 
    var AddClassActions = window.AddClassActions || {};

    AddClassActions = ( function() {

        function AddClassActions( element, options ) {
            //ここのthisはAddClassActionsオブジェクトを指す
            //無名関数でラッピングされているので、汚染されない
            //jqueryオブジェクトはnewされた際にelementで受け取っている  
            var t = this;
            //AddClassActionsオブジェクト自信にinitialsオブジェクトを持たせる
            t.initials = {
                action: 'scroll',
                speed: '1000',
                parentClass: 'parent',
                childClass: 'child',
                firePosition: '100',
                childSelect: '0',
            };
            //optionsをinitialsにマージ
            //空のオブジェクト{}にinitialsをマージし、optionsをマージすることで
            //既存のinitialsのプロパティが削除されるのを防止           
            t.settings = $.extend( {}, t.initials, options );
            //initEventsを実行、内部でまたAddClassActions自信をthisで受け取る
            t.initEvents( element );
            return false;
        }

        return AddClassActions;

    }() );

    AddClassActions.prototype.initEvents = function( element ) {
        var t = this;
        //受け取ったelementを、jqueryオブジェクトに変換して、jqobjectに格納
        var jqobject = $( element );
        var parentPos = jqobject.offset().top;
        var windowHeight = $( window ).height();
        //この処理の対象に共通のclassを設定              
        jqobject.addClass( 'target' );

        // ターゲットにdata-count="0"を追加、ループ回数として使用
        $( element ).attr( 'data-count', 0 );
        // t.settingsのactionプロパティによって処理を分岐
        switch ( t.settings.action ) {
            case 'ready':
                $( document ).ready( function() {
                    addClassLoop( jqobject, t.settings );
                } )
                break;
            case 'clickAddClass':
                // $( document ).ready( function() {
                //     addClassLoop( jqobject, t.settings );
                // } )
                $( document ).ready( function() {
                    addClassClick( jqobject, t.settings );
                } )
                break;
            case 'clickRemoveClass':
                // $( document ).ready( function() {
                //     addClassLoop( jqobject, t.settings );
                // } )
                $( document ).ready( function() {
                    addClassClickRemove( jqobject, t.settings );
                } )
                break;
            case 'scroll':
                var scrollPosition;
                $( document ).ready( function() {
                    scrollPosition = $( window ).scrollTop() + t.settings.firePosition;
                    if ( scrollPosition >= parentPos ) {
                        //jqobjectにparentClassが付いていなかったら場合、addClassLoopを実行
                        //その後すぐparentClassをつけて、addClassLoopがなんども実行されないようにする
                        if ( !jqobject.hasClass( t.settings.parentClass ) ) {
                            addClassLoop( jqobject, t.settings );
                            jqobject.addClass( t.settings.parentClass )
                        }
                    } else if ( scrollPosition < parentPos ) {}
                } )
                $( window ).on( 'scroll', function() {
                    scrollPosition = $( window ).scrollTop() + t.settings.firePosition;
                    if ( scrollPosition >= parentPos ) {
                        //jqobjectにparentClassが付いていなかったら場合、addClassLoopを実行
                        //その後すぐparentClassをつけて、addClassLoopがなんども実行されないようにする
                        if ( !jqobject.hasClass( t.settings.parentClass ) ) {
                            addClassLoop( jqobject, t.settings );
                            jqobject.addClass( t.settings.parentClass )
                        }
                    } else if ( scrollPosition < parentPos ) {}
                    return false;
                } );
                break;
        }
    };

    //このプラグインのターゲットの子要素に、クラスをつける関数
    var addClassLoop = function( element, settings ) {
        var children = element.children();
        // var length = children.length;
        var id = setTimeout( function() {
            // ターゲットのdata-count属性にカウント数を追加していく
            var count = element.data( 'count' );
            if(children[ count ]){
                $( children[ count ] ).addClass( settings.childClass );
            } else {
                return false;
            }
            count++;
            element.data( 'count', count );
            addClassLoop( element, settings );
        }, settings.speed );
        // ターゲットのdata-count属性が子要素の数を超えると停止
        //idをclearTimeoutで指定している
        // if ( element.data( 'count' ) > length ) {
        //     clearTimeout( id );　 
        // }
    }

    //このプラグインのターゲットの子要素に、クラスをつける関数
    var addClassClickAdd = function( element, settings ) {
        var children = element.children();
        var length = children.length;
        $(children[0]).addClass( settings.childClass );
        children.click(function(){
            $(children).removeClass( settings.childClass );
            $(this).addClass( settings.childClass );
        })
    }

    //このプラグインのターゲットの子要素に、クラスをつける関数
    var addClassClickRemove = function( element, settings ) {
        var children = element.children();
        var length = children.length;
        var childSelect = settings.childSelect;
        $(children).addClass( settings.childClass );
        $(children[childSelect]).removeClass( settings.childClass );
        children.click(function(){
            $(children).addClass( settings.childClass );
            $(this).removeClass( settings.childClass );
        })
    }

    $.fn.AddClassActions = function() {
        var
            element = this, //jqueryオブジェクトを受け取る
            options = arguments[ 0 ], //引数を受け取る
            args = Array.prototype.slice.call( arguments, 1 ), //使ってない
            i;
        //jqueryオブジェクトのそれぞれのAddClassActionsプロパティにインスタンスを格納
        for ( i = 0; i < element.length; i++ ) {
            if ( typeof options == 'object' || typeof options == 'undefined' ) {
                //newすることでインスタンスごとにプロパティを保持する
                //element[i]はjqueryオブジェクトではない。。。のに.AddClassActionsという記述の意味がわからない
                //elementはここでjqueryオブジェクトからひとつづつ抽出され、DOMとしてAddClassActionsに渡されるため、AddClassActions内ではeach()で扱う必要がない 
                //抽出されたelementは、DOMなので、AddClassActions内では$(element) としてjqueryオブジェクトに変換して使用する
                element[ i ].AddClassActions = new AddClassActions( element[ i ], options );
            }
        }
        //jqueryオブジェクトをメソッドチェーンのために返す
        return element;
    };

    // activate
    // -------------------------

} )( jQuery );