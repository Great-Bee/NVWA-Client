define([
        'backbone',
        'js/util/ui/view/button',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/util/api/producer',
        'js/util/api/oi'
    ],
    function(Backbone, ButtonView, ListGridView, SearchBarView, Producer, OI) {
        var LogListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        OI.logPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        new SearchBarView({
                            el: toolBar
                        }, {
                            autoSearch: true,
                            doSearch: function(keyword) {
                                grid.loadSearch(keyword);
                            },
                            cancelSearch: function() {
                                grid.gridView.loadData({
                                    page: 1,
                                    keyword: null
                                });
                            }
                        });
                    },
                    columns: [{
                        fieldName: 'id',
                        columnName: 'ID'
                    }, {
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }, {
                        fieldName: 'createXingMing',
                        columnName: '操作人'
                    }, {
                        fieldName: 'content',
                        columnName: '日志'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return LogListView;
    });