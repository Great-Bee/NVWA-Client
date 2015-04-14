/**
 *Basic gird view
 **/
define([
        'backbone',
        'underscore',
        'text!js/util/ui/template/list.html',
        'js/util/ui/view/grid'
    ],
    function(Backbone, _, ListGridTpl, GridView) {
        var ListGridView = Backbone.View.extend({
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
                        loadPageEvent: function() {},
                        loadButton: function(toolBar, grid) {},
                        showPagination: true, //是否显示分页控件
                        hiddenId: false,
                        pageSize: 10, //分页尺寸
                        columns: [], //columns
                        keyword: null, //Global search keyword
                        conditions: [] //log conditions
                    },
                    config);
                t.config = config;
                t.options = options;
                t.render();
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function() {
                var t = this;
                t.$el.html(_.template(ListGridTpl, {
                    options: t.options,
                    config: t.config
                }));
                t.loadgrid(t.$el.find('#list-grid'));
                t.toolBarEvent();
                return t;
            },
            /**
             * grid loader for OI
             * @param  {[type]} container [description]
             * @param  {[type]} columns   [description]
             * @param  {[type]} data      [description]
             * @return {[type]}           [description]
             */
            loadgrid: function(container, columns, data) {
                var t = this;
                var containerId = t.config.containerId || Date.parse(new Date());
                t.gridView = new GridView({
                    el: container
                }, {
                    containerId: containerId
                });
                t.gridView.loadData({
                    columns: t.config.columns,
                    loadPageEvent: t.config.loadPageEvent,
                    conditions: t.config.conditions,
                    pageSize: t.config.pageSize,
                    showPagination: t.config.showPagination,
                    hiddenId: t.config.hiddenId
                });
            },
            loadSearch: function(keyword) {
                var t = this;
                t.gridView.loadData({
                    page: 1,
                    keyword: keyword
                });
            },
            /**
             * 工具栏事件声明
             * @return {[type]} [description]
             */
            toolBarEvent: function() {
                var t = this;
                var toolBar = t.$el.find('#tool-bar');
                toolBar.html('');
                t.config.loadButton(toolBar, t);
            }
        });
        return ListGridView;
    });