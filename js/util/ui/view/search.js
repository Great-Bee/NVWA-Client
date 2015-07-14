/**
 *search 组件
 **/
define('js/util/ui/view/search', [
        'backbone',

        'text!js/util/ui/template/search.tpl',
        'js/bower_components/achy/message'
    ],
    function(Backbone, SearchTpl, Message) {
        var SearchBarView = Backbone.View.extend({
            events: {},
            /**
             * 初始化
             * @param  {[type]} options [description]
             * @param  {[type]} config  [description]
             * @return {[type]}         [description]
             */
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                        containerId: null,
                        doSearch: function(keyword) {},
                        cancelSearch: function() {},
                        loadButton: function(toolBar, grid) {},
                        columns: [], //columns
                        conditions: [], //log conditions                        
                        padding: 0,
                        isShowFeedback: false,
                        autoSearch: false
                    },
                    config);
                t.config = config;
                t.options = options;
                t.render();
                t.afterRender();
                t.bindEvent();
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function() {
                var t = this;
                // t.$el.append();
                var element = $(tpl(SearchTpl, {
                    options: t.options,
                    config: t.config
                })).appendTo(t.$el);
                return t;
            },
            afterRender: function() {
                var t = this;
                t.$el.find('form').css("padding", t.config.padding + 'px');
                t.$el.find('span[feedback="search-feedback"]').hide();
                t.config.isShowFeedback = false;
            },
            bindEvent: function() {
                var t = this;
                var __cancelSearch = function() {
                    t.$el.find('input[search="search"]').val('');
                    t.config.cancelSearch();
                    t.config.isShowFeedback = false;
                    t.$el.find('span[feedback="search-feedback"]').hide();
                };
                t.$el.find('button[search="search"]').bind('click', function() {
                    var inputer = t.$el.find('input[search="search"]').val();
                    if (inputer && inputer.length > 0) {
                        t.config.doSearch(inputer);
                        t.config.isShowFeedback = true;
                        t.$el.find('span[feedback="search-feedback"]').show();
                    } else {
                        new Message({
                            type: 'error',
                            msg: '请输入关键字',
                            timeout: 1500
                        });
                    }
                });
                t.$el.find('span[feedback="search-feedback"]').bind('click', function() {
                    __cancelSearch();
                });
                if (t.config.autoSearch) {
                    t.$el.find('input[search="search"]').bind('keyup', function(e) {
                        t.$el.find('button[search="search"]').trigger("click");
                    });
                } else {
                    t.$el.find('input[search="search"]').bind('keyup', function(e) {
                        if (e.keyCode == 13) {
                            t.$el.find('button[search="search"]').trigger("click");
                        } else if (e.keyCode == 96) {
                            __cancelSearch();
                        }
                    });
                }

            }
        });
        return SearchBarView;
    });