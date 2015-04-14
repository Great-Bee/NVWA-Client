define([
    'backbone',
    'underscore',
    'js/util/api/mc',
    'js/util/ui/view/button',
    'achy/widget/ui/message',
    'js/util/ui/view/modal',
    'js/util/ui/view/list',
    'js/producer/view/editorConditionForm'
], function(Backbone, _, MCModel, ButtonView, Message, Modal, ListGridView, ConditionForm) {
    var EditorCondition = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerBean: null,
                pageSize: 50,
                showPagination: false
            }, config);
            t.config = config;
            config = $.extend({
                loadPageEvent: function(handler, config) {
                    MCModel.conditionPage(handler, config);
                },
                loadButton: function(toolBar, grid) {
                    var containerBean = t.config.containerBean;
                    var loadDataEvent = MCModel.readCondition;
                    var updateDataEvent = MCModel.updateCondition;
                    var deleteDataEvent = MCModel.deleteCondition;
                    var addDataEvent = MCModel.addCondition;
                    var addEventTitle = "添加条件";
                    var updateEventTitle = "修改条件";
                    var viewEventTitle = "查看条件详情";
                    var deleteConfirmContent = "是否删除该条件";
                    t.creatDialog = {};
                    t.creatDialog.container = $('<div></div>');
                    var FormInstance = ConditionForm;
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
                    new ButtonView({
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
                                afterUpdateEvent: function(data) {
                                    if (data && data.ok) {
                                        //update success
                                        //销毁窗口
                                        $(t.creatDialog.dialog).modal('hide');
                                        //reload grid data
                                        grid.gridView.loadData();
                                        new Message({
                                            type: 'info',
                                            msg: '添加条件成功',
                                            timeout: 1500
                                        });
                                    } else {
                                        new Message({
                                            type: 'error',
                                            msg: '添加条件失败',
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
                    t.updateDialog = {};
                    t.updateDialog.container = $('<div></div>');
                    new ButtonView({
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
                                afterUpdateEvent: function(data) {
                                    if (data && data.ok) {
                                        //update success
                                        //销毁窗口
                                        $(t.updateDialog.dialog).modal('hide');
                                        //reload grid data
                                        grid.gridView.loadData();
                                        new Message({
                                            type: 'info',
                                            msg: '更新条件成功',
                                            timeout: 1500
                                        });
                                    } else {
                                        new Message({
                                            type: 'error',
                                            msg: '更新条件失败',
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
                    new ButtonView({
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
                    fieldName: 'conditionFieldName',
                    columnName: '字段'
                }], //columns
                conditions: config.conditions //conditions
            }, config);
            new ListGridView(options, config);
        }
    });
    return EditorCondition;
});