define('js/util/ui/view/editorServerEvent', [
    'backbone',

    'js/util/api/mc',
    'js/util/ui/view/button',
    'achy/widget/ui/message',
    'js/util/ui/view/modal',
    'js/util/ui/view/list',
    'js/util/ui/view/editorServerEventForm',
], function(Backbone, MCModel, ButtonView, Message, Modal, ListGridView, ServerEventFormView) {
    //服务器事件
    var EditorServerEventView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerBean: null,
                pageSize: 50,
                showPagination: false,
                supportServerEventNames: []
            }, config);
            t.config = config;
            config = $.extend({
                loadPageEvent: function(handler, config) {
                    MCModel.serverEventPage(handler, config);
                },
                loadButton: function(toolBar, grid) {
                    var containerBean = t.config.containerBean;
                    var loadDataEvent = MCModel.readServerEvent;
                    var updateDataEvent = MCModel.updateServerEvent;
                    var deleteDataEvent = MCModel.deleteServerEvent;
                    var addDataEvent = MCModel.addServerEvent;
                    var addEventTitle = "添加服务器事件";
                    var updateEventTitle = "修改服务器事件";
                    var viewEventTitle = "查看服务器事件详情";
                    var deleteConfirmContent = "是否删除该服务器事件";
                    t.creatDialog = {};
                    t.creatDialog.container = $('<div></div>');
                    var FormInstance = ServerEventFormView;
                    var __deleteAction = function(deleteModuleData) {
                        deleteDataEvent(deleteModuleData, function(data) {
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
                    new ButtonView({ //添加
                        el: toolBar
                    }, {
                        text: '',
                        icon: 'glyphicon-plus',
                        buttonSize: 'xs',
                        click: function() {
                            t.creatDialog.dialog = new Modal({
                                title: addEventTitle,
                                content: t.creatDialog.container
                            });
                            t.creatDialog.pageForm = new FormInstance({
                                el: t.creatDialog.container
                            }, {
                                containerBean: containerBean,
                                loadDataEvent: loadDataEvent,
                                saveDataEvent: addDataEvent,
                                target: t.config.target,
                                targetId: t.config.targetId,
                                supportServerEventNames: t.config.supportServerEventNames,
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
                    new ButtonView({ //修改
                        el: toolBar
                    }, {
                        text: '',
                        icon: 'glyphicon-pencil',
                        buttonSize: 'xs',
                        click: function() {
                            var objectId = grid.gridView.getSelectionRowData()['id'];
                            t.updateDialog.dialog = new Modal({
                                title: updateEventTitle,
                                content: t.updateDialog.container
                            });
                            t.updateDialog.pageForm = new FormInstance({
                                el: t.updateDialog.container
                            }, {
                                objectId: objectId,
                                containerBean: containerBean,
                                formType: 'update',
                                loadDataEvent: loadDataEvent,
                                updateDataEvent: updateDataEvent,
                                target: t.config.target,
                                targetId: t.config.targetId,
                                supportServerEventNames: t.config.supportServerEventNames,
                                afterUpdateEvent: function(data) {
                                    if (data && data.ok) {
                                        //update success
                                        //销毁窗口
                                        $(t.updateDialog.dialog).modal('hide');
                                        //reload grid data
                                        grid.gridView.loadData();
                                    }
                                },
                                callbackEvent: function() {
                                    //销毁窗口
                                    $(t.updateDialog.dialog).modal('hide');
                                }
                            });
                        }
                    });
                    new ButtonView({ //删除
                        el: toolBar
                    }, {
                        text: '',
                        icon: 'glyphicon-trash',
                        buttonSize: 'xs',
                        click: function() {
                            var deleteModuleData = grid.gridView.getSelectionRowData();
                            if (deleteModuleData) {
                                new Modal.Confirm({
                                    title: '删除',
                                    content: deleteConfirmContent,
                                    yes: function() {
                                        __deleteAction(deleteModuleData);
                                    },
                                    no: function() {}
                                });
                            }
                        }
                    });
                    t.viewDialog = {};
                    t.viewDialog.container = $('<div></div>');
                    new ButtonView({ //查看
                        el: toolBar
                    }, {
                        text: '',
                        icon: 'glyphicon-file',
                        buttonSize: 'xs',
                        click: function() {
                            var objectId = grid.gridView.getSelectionRowData()['id'];
                            t.viewDialog.dialog = new Modal({
                                title: viewEventTitle,
                                content: t.viewDialog.container
                            });
                            t.viewDialog.pageForm = new FormInstance({
                                el: t.viewDialog.container
                            }, {
                                objectId: objectId,
                                containerBean: containerBean,
                                formType: 'view',
                                loadDataEvent: loadDataEvent,
                                target: t.config.target,
                                targetId: t.config.targetId,
                                supportServerEventNames: t.config.supportServerEventNames,
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
                    fieldName: 'eventName',
                    columnName: '服务端'

                }, {
                    fieldName: 'alias',
                    columnName: '别名'
                }], //columns
                conditions: [{
                    fieldName: 'target',
                    fieldValue: t.config.target
                }, {
                    fieldName: 'targetId',
                    fieldValue: t.config.targetId
                }], //conditions
                hiddenId: true
            }, config);
            new ListGridView(options, config);
        }
    });

    return EditorServerEventView;
});