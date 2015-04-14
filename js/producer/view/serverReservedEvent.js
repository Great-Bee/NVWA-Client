define([
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/dictionary',
        'js/producer/view/serverReservedEventForm'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, Dictionary, ServerReservedEventForm
    ) {
        var ServerReservedEventListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.serverReservedEventPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        t.updateDialog = {};
                        t.updateDialog.container = $('<div></div>');
                        t.viewDialog = {};
                        t.viewDialog.container = $('<div></div>');
                        var __deleteReservedFieldAction = function(deleteModuleData) {
                            MC.deleteServerReservedEvent(deleteModuleData, function(data) {
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
                                    title: '添加服务器保留事件',
                                    content: t.creatDialog.container
                                });
                                t.creatDialog.serverReservedEventForm = new ServerReservedEventForm({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: MC.readServerReservedEvent,
                                    saveDataEvent: MC.addServerReservedEvent,
                                    uniqueEvent: MC.serverReservedEventUnique,
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
                                                msg: '添加服务器保留事件成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            //update false
                                            new Message({
                                                type: 'error',
                                                msg: '添加服务器保留事件失败',
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
                                    title: '更新服务器保留事件',
                                    content: t.updateDialog.container
                                });
                                t.updateDialog.serverReservedEventForm = new ServerReservedEventForm({
                                    el: t.updateDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'update',
                                    loadDataEvent: MC.readServerReservedEvent,
                                    updateDataEvent: MC.updateServerReservedEvent,
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
                                                msg: '更新服务器保留事件成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            //update false
                                            new Message({
                                                type: 'error',
                                                msg: '更新服务器保留事件失败',
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
                                        content: '是否删除该服务器保留事件',
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
                                    title: '查看服务器保留事件',
                                    content: t.viewDialog.container
                                });
                                t.viewDialog.serverReservedEventForm = new ServerReservedEventForm({
                                    el: t.viewDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'view',
                                    loadDataEvent: MC.readServerReservedEvent,
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
                        fieldName: 'target',
                        columnName: '保留事件类型',
                        dictionary: Dictionary.ServerReservedEvent
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return ServerReservedEventListView;
    });