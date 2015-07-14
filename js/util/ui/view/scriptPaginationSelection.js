define('js/util/ui/view/scriptPaginationSelection', [
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
        'js/util/ui/view/modal',
        'js/util/api/mc',
        'js/util/dictionary',
        'js/util/ui/view/pagePaginationSelection'
    ],
    function(ButtonView, Message, Modal, MC,
        Dictionary, PagePaginationSelectionView
    ) {
        var ScriptsListView = PagePaginationSelectionView.extend({
            initialize: function(options, config) {
                var t = this;
                PagePaginationSelectionView.prototype.initialize.apply(this, arguments);
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
                    text: '选择脚本',
                    icon: 'glyphicon-ok',
                    click: function() {
                        var selectModuleData = grid.gridView.getSelectionRowData();
                        new Modal.Confirm({
                            title: '选择脚本',
                            content: '是否添加该脚本',
                            yes: function() {
                                t.$el.trigger('selectedScript', [selectModuleData]);
                            },
                            no: function() {

                            }
                        });
                    }
                });
            },
            loadPageEvent: function(handler, config) {
                MC.customScriptsPage(handler, config);
            }
        });
        return ScriptsListView;
    });