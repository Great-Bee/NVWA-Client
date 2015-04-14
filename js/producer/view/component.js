define([
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/dictionary',
        'js/producer/view/componentForm'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, Dictionary, ComponentForm
    ) {
        var ComponentListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.componentPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        t.updateDialog = {};
                        t.updateDialog.container = $('<div></div>');
                        t.viewDialog = {};
                        t.viewDialog.container = $('<div></div>');
                        var __deleteReservedFieldAction = function(deleteModuleData) {
                            MC.deleteComponent(deleteModuleData, function(data) {
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
                                    title: '添加组件',
                                    content: t.creatDialog.container
                                });
                                t.creatDialog.componentForm = new ComponentForm({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: MC.readComponent,
                                    saveDataEvent: MC.addComponent,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.creatDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                            //弹出提示信息
                                            new Message({
                                                type: 'info',
                                                msg: '添加组件成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            //update false
                                            new Message({
                                                type: 'error',
                                                msg: '添加组件失败',
                                                timeout: 1500
                                            });
                                            _log(data.message);
                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.creatDialog.dialog).modal('hide');
                                    }
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                t.updateDialog.dialog = new Modal({
                                    title: '更新组件',
                                    content: t.updateDialog.container
                                });
                                t.updateDialog.componentForm = new ComponentForm({
                                    el: t.updateDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'update',
                                    loadDataEvent: MC.readComponent,
                                    updateDataEvent: MC.updateComponent,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.updateDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                            //弹出提示
                                            new Message({
                                                type: 'info',
                                                msg: '更新组件成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            //update false
                                            new Message({
                                                type: 'error',
                                                msg: '更新组件失败',
                                                timeout: 1500
                                            });
                                            _log(data.message);
                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.updateDialog.dialog).modal('hide');
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
                                        content: '是否删除该组件',
                                        yes: function() {
                                            __deleteReservedFieldAction(deleteModuleData);
                                        }
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
                                t.viewDialog.dialog = new Modal({
                                    title: '查看组件',
                                    content: t.viewDialog.container
                                });
                                t.viewDialog.componentForm = new ComponentForm({
                                    el: t.viewDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'view',
                                    loadDataEvent: MC.readComponent,
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.viewDialog.dialog).modal('hide');
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
                        fieldName: 'type',
                        columnName: '类型',
                        dictionary: Dictionary.ComponentType
                    }, {
                        fieldName: 'producer',
                        columnName: '开发者'
                    }, {
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return ComponentListView;
    });