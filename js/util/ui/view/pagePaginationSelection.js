define([
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/dictionary'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, Dictionary
    ) {
        var PageListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: t.loadPageEvent,
                    loadButton: function(toolBar, grid) {
                        t.loadButton(toolBar, grid);
                    },
                    columns: t.getColumns(), //columns
                    conditions: config.conditions // conditions
                }, config);
                new ListGridView(options, config);
            },
            getColumns: function() {
                return [{
                    fieldName: 'id',
                    columnName: 'ID'
                }, {
                    fieldName: 'name',
                    columnName: '名称'
                }, {
                    fieldName: 'alias',
                    columnName: '别名'
                }, {
                    fieldName: 'producer',
                    columnName: '开发者'
                }, {
                    fieldName: 'createDate',
                    columnName: '创建时间'
                }];
            },
            loadButton: function(toolBar, grid) {
                var t = this;
                t.dialog = {};
                t.dialog.container = $('<div></div>');
                new ButtonView({
                    el: toolBar
                }, {
                    text: '选择页面',
                    icon: 'glyphicon-ok',
                    click: function() {
                        var deleteModuleData = grid.gridView.getSelectionRowData();
                        new Modal.Confirm({
                            title: '选择页面',
                            content: '是否添加该页面',
                            yes: function() {
                                t.$el.trigger('selectedPage', [deleteModuleData]);
                            },
                            no: function() {

                            }
                        });
                    }
                });
            },
            loadPageEvent: function(handler, config) {
                MC.listPage(handler, config);
            }
        });
        return PageListView;
    });