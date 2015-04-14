/**
 *遮罩组件
 */
define([], function() {
    var ButtonView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                text: '正在载入......'
            }, config);
            t.config = config;
            t.render();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            var config = t.config;
            t.cover = t.$el.find('.cover');
            if (!t.cover || t.cover.length < 1) {
                t.cover = $('<div class="cover"></div>').appendTo(t.$el);
                window._log('render cover...');
            }
        },
        show: function() {
            var t = this;
            t.cover.html('');
            t.cover.show();
            var loading = $('<div><span class="spinner primary"></span><span> ' + t.config['text'] + '</span></div>').appendTo(t.cover);
            loading.css('margin-left', $(window).width() / 2 - 80 + 'px');
            loading.css('margin-top', $(window).height() / 2 + 'px');
        },
        hiden: function() {
            var t = this;
            t.cover.remove();
        }
    });
    return ButtonView;
});