define([
    'backbone',
    'underscore',
    'js/util/api/mc',
    'js/util/ui/view/button',
    'achy/widget/ui/message',
    'js/util/ui/view/modal',
    'js/util/ui/view/list',
    'js/util/dictionary',
    'js/util/ui/view/editorClientEventForm'
], function(Backbone, _, MCModel, ButtonView, Message, Modal, ListGridView, Dictionary, ClientEventFormView) {

    var EditorClientEventView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerBean: null,
                pageSize: 50,
                showPagination: false,
                supportEventNames: []
            }, config);
            t.config = config;
            config = $.extend({
                loadPageEvent: function(handler, config) {
                    MCModel.clientEventPage(handler, config);
                },
                loadButton: function(toolBar, grid) {
                    var containerBean = t.config.containerBean;
                    var loadDataEvent = MCModel.readClientEvent;
                    var updateDataEvent = MCModel.updateClientEvent;
                    var deleteDataEvent = MCModel.deleteClientEvent;
                    var addDataEvent = MCModel.addClientEvent;
                    var addEventTitle = "添加客户端事件";
                    var updateEventTitle = "修改客户端事件";
                    var viewEventTitle = "查看客户端事件详情";
                    var deleteConfirmContent = "是否删除该客户端事件";
                    t.creatDialog = {};
                    t.creatDialog.container = $('<div></div>');
                    var FormInstance = ClientEventFormView;
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
                                supportEventNames: t.config.supportEventNames,
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
                                supportEventNames: t.config.supportEventNames,
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
                                supportEventNames: t.config.supportEventNames,
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
                    columnName: '客户端',
                    dictionary: Dictionary.ClientEventType
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

    return EditorClientEventView;
});