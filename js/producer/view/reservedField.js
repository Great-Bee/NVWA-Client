define([
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/ui/view/list',
        'js/util/dictionary',
        'js/producer/view/reservedFieldForm'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, OI,
        ListGridView, Dictionary, ReservedFieldForm
    ) {
        var ReservedListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        OI.reservedFieldPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        t.updateDialog = {};
                        t.updateDialog.container = $('<div></div>');
                        t.viewDialog = {};
                        t.viewDialog.container = $('<div></div>');
                        var __deleteReservedFieldAction = function(deleteModuleData) {
                            OI.deleteReservedField(deleteModuleData, function(data) {
                                if (data && data.ok) {
                                    //删除成功
                                    //reload grid
                                    grid.gridView.refreshCurrentPage();
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
                                    title: '添加保留字',
                                    content: t.creatDialog.container
                                });
                                t.creatDialog.reservedFieldForm = new ReservedFieldForm({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: OI.readReservedField,
                                    saveDataEvent: OI.addReservedField,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.creatDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                        } else {
                                            //update false
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
                                    title: '更新保留字',
                                    content: t.updateDialog.container
                                });
                                t.updateDialog.reservedFieldForm = new ReservedFieldForm({
                                    el: t.updateDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'update',
                                    loadDataEvent: OI.readReservedField,
                                    updateDataEvent: OI.updateReservedField,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.updateDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                        } else {
                                            //update false

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
                                new Modal.Confirm({
                                    title: '删除',
                                    content: '是否删除该保留字',
                                    yes: function() {
                                        __deleteReservedFieldAction(deleteModuleData);
                                    },
                                    no: function() {

                                    }
                                });
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
                                    title: '查看保留字',
                                    content: t.viewDialog.container
                                });
                                t.viewDialog.reservedFieldForm = new ReservedFieldForm({
                                    el: t.viewDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'view',
                                    loadDataEvent: OI.readReservedField,
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
                        fieldName: 'fieldName',
                        columnName: '字段名称'
                    }, {
                        fieldName: 'description',
                        columnName: '描述'
                    }, {
                        fieldName: 'className',
                        columnName: '类名'
                    }, {
                        fieldName: 'attributes',
                        columnName: '属性'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return ReservedListView;
    });