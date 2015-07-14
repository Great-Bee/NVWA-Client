define('js/util/ui/view/containerPaginationSelection', [
        'backbone',
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
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
        var FieldListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.containerPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.fildCreatDialog = {};
                        t.fildCreatDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '选择容器',
                            icon: 'glyphicon-ok',
                            click: function() {
                                var deleteModuleData = grid.gridView.getSelectionRowData();
                                new Modal.Confirm({
                                    title: '选择容器',
                                    content: '是否添加该容器',
                                    yes: function() {
                                        t.$el.trigger('selectedContainer', [deleteModuleData]);
                                    },
                                    no: function() {

                                    }
                                });
                            }
                        });
                    },
                    columns: [{
                        fieldName: 'id',
                        columnName: 'ID'
                    }, {
                        fieldName: 'name',
                        columnName: '名称'
                    }, {
                        fieldName: 'alias',
                        columnName: '别名'
                    }, {
                        fieldName: 'oi',
                        columnName: 'OI'
                    }], //columns
                    conditions: config.conditions //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return FieldListView;
    });