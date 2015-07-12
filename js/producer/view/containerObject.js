/**
 *container object grid view
 **/
define('js/producer/view/containerObject', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/producer/view/containerObjectForm',
        'js/util/dictionary'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, SearchBarView, ContainerObjectForm, Dictionary
    ) {
        var ContainerObjectListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.listContainerObject(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        var __deletePageAction = function(deleteModuleData) {
                            MC.deleteContainerObject(deleteModuleData, function(data) {
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
                                t.creatDialog.dialog = new Modal({
                                    title: '添加页面',
                                    content: t.creatDialog.container
                                });
                                t.creatDialog.pageForm = new ContainerObjectForm({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: MC.readContainerObject,
                                    saveDataEvent: MC.addContainerObject,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.creatDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.creatDialog.dialog).modal('hide');
                                    }
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
                                t.updateDialog.dialog = new Modal({
                                    title: '更新页面',
                                    content: t.updateDialog.container
                                });
                                t.updateDialog.pageForm = new ContainerObjectForm({
                                    el: t.updateDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'update',
                                    loadDataEvent: MC.readContainerObject,
                                    updateDataEvent: MC.updateContainerObject,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.updateDialog.dialog).modal('hide');
                                            $(t.updateDialog.dialog).remove();
                                            //reload grid data
                                            grid.gridView.loadData();
                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.updateDialog.dialog).modal('hide');
                                        $(t.updateDialog.dialog).remove();
                                    }
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
                                        content: '是否删除该页面',
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
                                t.viewDialog.dialog = new Modal({
                                    title: '查看页面',
                                    content: t.viewDialog.container
                                });
                                t.viewDialog.pageForm = new ContainerObjectForm({
                                    el: t.viewDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'view',
                                    loadDataEvent: MC.readContainerObject,
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.viewDialog.dialog).modal('hide');
                                        $(t.viewDialog.dialog).remove();
                                    }
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
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }, {
                        fieldName: 'updateDate',
                        columnName: '更新时间'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return ContainerObjectListView;
    });