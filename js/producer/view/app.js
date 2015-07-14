/**
 *page grid view
 **/
define('js/producer/view/app', [
        'backbone',
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/producer/view/appForm',
        'js/producer/view/appResource',
        'js/util/dictionary'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, SearchBarView, AppForm, AppResourceView, Dictionary
    ) {
        var PageListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.listApp(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        var __deletePageAction = function(deleteModuleData) {
                            MC.deleteApp(deleteModuleData, function(data) {
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
                                var url = 'app/add';
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
                                var url = 'app/update/' + objectId;
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
                                        content: '是否删除该App',
                                        yes: function() {
                                            __deletePageAction(deleteModuleData);
                                        },
                                        no: function() {}
                                    });
                                }
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看',
                            icon: 'glyphicon-file',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                var url = 'app/view/' + objectId;
                                options.routes.navigate(url, {
                                    trigger: true
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '设置资源',
                            icon: 'glyphicon-file',
                            click: function() {
                                var selectRow = grid.gridView.getSelectionRowData();
                                if (selectRow) {
                                    var objectId = selectRow['id'];
                                    t.appResourceListView = {};
                                    t.appResourceListView.container = $('<div></div>');
                                    t.appResourceListView.dialog = new Modal({
                                        title: selectRow['name'] + ' 资源',
                                        content: t.appResourceListView.container
                                    });
                                    new AppResourceView({
                                        el: t.appResourceListView.container
                                    }, {
                                        appAlias: selectRow['alias'],
                                        conditions: [{
                                            fieldName: 'appAlias',
                                            fieldValue: selectRow['alias']
                                        }]
                                    });
                                }
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
                        fieldName: 'description',
                        columnName: '描述'
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