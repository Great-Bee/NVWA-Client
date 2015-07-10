/**
 * User View
 */
define([
    'backbone',

    'text!js/user/template/userLayout.tpl',
    'css!js/bower_components/user-index/css/bootstrap.min',
    'css!js/bower_components/user-index/css/bootstrap-responsive.min',
    'css!js/bower_components/user-index/css/user-index',
], function(Backbone, UserTpl) {
    var UserView = Backbone.View.extend({

        initialize: function() {
            if ($('.skin-color').length <= 0) {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = 'js/bower_components/user-index/css/unicorn.grey.css';
                $(link).addClass('skin-color');
                document.getElementsByTagName("head")[0].appendChild(link);
            }
        },

        _init: function() {
            // === Sidebar navigation === //
            $('.submenu > a').click(function(e) {
                e.preventDefault();
                var submenu = $(this).siblings('ul');
                var li = $(this).parents('li');
                var submenus = $('#sidebar li.submenu ul');
                var submenus_parents = $('#sidebar li.submenu');
                if (li.hasClass('open')) {
                    if (($(window).width() > 768) || ($(window).width() < 479)) {
                        submenu.slideUp();
                    } else {
                        submenu.fadeOut(250);
                    }
                    li.removeClass('open');
                } else {
                    if (($(window).width() > 768) || ($(window).width() < 479)) {
                        submenus.slideUp();
                        submenu.slideDown();
                    } else {
                        submenus.fadeOut(250);
                        submenu.fadeIn(250);
                    }
                    submenus_parents.removeClass('open');
                    li.addClass('open');
                }
            });

            var ul = $('#sidebar > ul');
            $('#sidebar > a').click(function(e) {
                e.preventDefault();
                var sidebar = $('#sidebar');
                if (sidebar.hasClass('open')) {
                    sidebar.removeClass('open');
                    ul.slideUp(250);
                } else {
                    sidebar.addClass('open');
                    ul.slideDown(250);
                }
            });

            // === Resize window related === //
            $(window).resize(function() {
                if ($(window).width() > 479) {
                    ul.css({
                        'display': 'block'
                    });
                    $('#content-header .btn-group').css({
                        width: 'auto'
                    });
                }
                if ($(window).width() < 479) {
                    ul.css({
                        'display': 'none'
                    });
                    fix_position();
                }
                if ($(window).width() > 768) {
                    $('#user-nav > ul').css({
                        width: 'auto',
                        margin: '0'
                    });
                    $('#content-header .btn-group').css({
                        width: 'auto'
                    });
                }
            });

            if ($(window).width() < 468) {
                ul.css({
                    'display': 'none'
                });
                fix_position();
            }

            if ($(window).width() > 479) {
                $('#content-header .btn-group').css({
                    width: 'auto'
                });
                ul.css({
                    'display': 'block'
                });
            }

            // === Fixes the position of buttons group in content header and top user navigation === //
            function fix_position() {
                var uwidth = $('#user-nav > ul').width();
                $('#user-nav > ul').css({
                    width: uwidth,
                    'margin-left': '-' + uwidth / 2 + 'px'
                });
                var cwidth = $('#content-header .btn-group').width();
                $('#content-header .btn-group').css({
                    width: cwidth,
                    'margin-left': '-' + uwidth / 2 + 'px'
                });
            }

            // === Style switcher === //
            $('#style-switcher i').click(function() {
                if ($(this).hasClass('open')) {
                    $(this).parent().animate({
                        marginRight: '-=190'
                    });
                    $(this).removeClass('open');
                } else {
                    $(this).parent().animate({
                        marginRight: '+=190'
                    });
                    $(this).addClass('open');
                }
                $(this).toggleClass('icon-arrow-left');
                $(this).toggleClass('icon-arrow-right');
            });

            $('#style-switcher a').click(function() {
                var style = $(this).attr('name').replace('#', '');
                $('.skin-color').attr('href', 'js/bower_components/user-index/css/unicorn.' + style + '.css');
                $(this).siblings('a').css({
                    'border-color': 'transparent'
                });
                $(this).css({
                    'border-color': '#aaaaaa'
                });
            });

        },

        render: function() {
            var t = this;
            t.$el.html(tpl(UserTpl));
            t._init();
            return t;
        },
    });

    return UserView;
});