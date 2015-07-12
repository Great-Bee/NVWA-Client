/**
 *page grid view
 **/
define('js/producer/view/apiConfig', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/producer/view/apiConfigForm',
        'js/producer/view/apiResources',
        'js/util/dictionary'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, SearchBarView, APIConfigForm, APIResources, Dictionary
    ) {
        var PageListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.listAPIConfig(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        var __deletePageAction = function(deleteModuleData) {
                            MC.deleteAPIConfig(deleteModuleData, function(data) {
                                if (data && data.ok) {
                                    //删除成功  
                                    new Message({
                                        type: 'info',
                                        msg: '删除成功',
                                        timeout: 1500
                                    });
                                    //reload grid
                                    grid.gridView.refreshCurrentPage();
                                } else {
                                    new Message({
                                        type: 'error',
                                        msg: '删除失败',
                                        timeout: 1500
                                    });
                                }
                            });
                        }
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '添加',
                            icon: 'glyphicon-plus',
                            click: function() {
                                var url = 'apiConfig/add';
                                options.routes.navigate(url, {
                                    trigger: true
                                });

                            }
                        });
                        t.updateDialog = {};
                        t.updateDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                var url = 'apiConfig/update/' + objectId;
                                options.routes.navigate(url, {
                                    trigger: true
                                });

                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '删除',
                            icon: 'glyphicon-trash',
                            click: function() {
                                var deleteModuleData = grid.gridView.getSelectionRowData();
                                if (deleteModuleData && deleteModuleData['id'] && deleteModuleData['id'] > 0) {
                                    new Modal.Confirm({
                                        title: '删除',
                                        content: '是否删除该API配置',
                                        yes: function() {
                                            __deletePageAction(deleteModuleData);
                                        },
                                        no: function() {}
                                    });
                                }
                            }
                        });
                        t.viewDialog = {};
                        t.viewDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看',
                            icon: 'glyphicon-file',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                var url = 'apiConfig/view/' + objectId;
                                options.routes.navigate(url, {
                                    trigger: true
                                });
                            }
                        });
                        t.viewResourcesDialog = {};
                        t.viewResourcesDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看API资源',
                            icon: 'glyphicon-file',
                            click: function() {
                                var alias = grid.gridView.getSelectionRowData()['alias'];
                                t.viewResourcesDialog.dialog = new Modal({
                                    title: 'API资源',
                                    content: t.viewResourcesDialog.container
                                });
                                t.apiResourcesGrid = new APIResources({
                                    el: t.viewResourcesDialog.container
                                }, {
                                    conditions: [{
                                        fieldName: 'apiAlias',
                                        fieldValue: alias
                                    }],
                                });
                            }
                        });
                        new SearchBarView({
                            el: toolBar
                        }, {
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
                        fieldName: 'name',
                        columnName: '名称'
                    }, {
                        fieldName: 'alias',
                        columnName: '别名'
                    }, {
                        fieldName: 'appName',
                        columnName: 'APP名称'
                    }, {
                        fieldName: 'appType',
                        columnName: 'APP类型',
                        dictionary: Dictionary.AppType
                    }, {
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return PageListView;
    });