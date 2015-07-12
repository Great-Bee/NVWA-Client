define('js/producer/view/connector', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/ui/view/list',
        'js/util/dictionary',
        'js/producer/view/connectorForm'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, OI,
        ListGridView, Dictionary, ConnectorForm
    ) {
        var ConnectorListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        OI.connectorPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.connectorCreatDialog = {};
                        t.connectorCreatDialog.container = $('<div></div>');
                        t.connectorUpdateDialog = {};
                        t.connectorUpdateDialog.container = $('<div></div>');
                        t.connectorViewDialog = {};
                        t.connectorViewDialog.container = $('<div></div>');
                        var __deleteConnectorAction = function(deleteModuleData) {
                            OI.deleteConnector(deleteModuleData, function(data) {
                                if (data && data.ok) {
                                    //删除成功
                                    //reload grid
                                    new Message({
                                        type: 'info',
                                        msg: '删除成功',
                                        timeout: 1500
                                    });
                                    grid.gridView.refreshCurrentPage();
                                } else {
                                    new Message({
                                        type: 'warn',
                                        msg: '删除失败',
                                        timeout: 1500
                                    });
                                }
                            });
                        }
                        t.btnAdd = new ButtonView({
                            el: toolBar
                        }, {
                            text: '添加',
                            icon: 'glyphicon-plus',
                            click: function() {
                                t.connectorCreatDialog.dialog = new Modal({
                                    title: '连接器添加',
                                    content: t.connectorCreatDialog.container
                                });
                                t.connectorCreatDialog.connectorForm = new ConnectorForm({
                                    el: t.connectorCreatDialog.container
                                }, {
                                    loadDataEvent: OI.readConnector,
                                    saveDataEvent: OI.addConnector,
                                    fromIdentified: config.fromIdentified,
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.connectorCreatDialog.dialog).modal('hide');
                                    },
                                    afterAddEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.connectorCreatDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                            new Message({
                                                type: 'info',
                                                msg: '添加连接器成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            //update false
                                            new Message({
                                                type: 'error',
                                                msg: '添加连接器失败',
                                                timeout: 1500
                                            });
                                        }
                                    }
                                });
                            }
                        });
                        t.btnUpdate = new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var selectionRowData = grid.gridView.getSelectionRowData();
                                var objectId = selectionRowData['id'] || 0;
                                if (objectId && objectId > 0) {
                                    t.connectorUpdateDialog.dialog = new Modal({
                                        title: '更新连接器',
                                        content: t.connectorUpdateDialog.container
                                    });
                                    t.connectorUpdateDialog.connectorForm = new ConnectorForm({
                                        el: t.connectorUpdateDialog.container
                                    }, {
                                        objectId: objectId,
                                        formType: 'update',
                                        loadDataEvent: OI.readConnector,
                                        updateDataEvent: OI.updateConnector,
                                        fromIdentified: config.fromIdentified,
                                        afterUpdateEvent: function(data) {
                                            if (data && data.ok) {
                                                //update success
                                                //销毁窗口
                                                $(t.connectorUpdateDialog.dialog).modal('hide');
                                                //reload grid data
                                                grid.gridView.loadData();
                                                new Message({
                                                    type: 'info',
                                                    msg: '更新连接器成功',
                                                    timeout: 1500
                                                });
                                            } else {
                                                //update false
                                                new Message({
                                                    type: 'error',
                                                    msg: '更新连接器失败',
                                                    timeout: 1500
                                                });
                                            }
                                        },
                                        callbackEvent: function() {
                                            //销毁窗口
                                            $(t.connectorUpdateDialog.dialog).show();
                                        }
                                    });
                                } else {
                                    _log('id<0');
                                    _log('no selection data');
                                }
                            }
                        });
                        t.btnDelete = new ButtonView({
                            el: toolBar
                        }, {
                            text: '删除',
                            icon: 'glyphicon-trash',
                            click: function() {
                                var deleteModuleData = grid.gridView.getSelectionRowData();
                                if (deleteModuleData && deleteModuleData != null) {
                                    new Modal.Confirm({
                                        title: '删除',
                                        content: '是否删除该连接器',
                                        yes: function() {
                                            __deleteConnectorAction(deleteModuleData);
                                        },
                                        no: function() {

                                        }
                                    });
                                } else {
                                    _log('no selection data');
                                }
                            }
                        });
                        t.btnView = new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看',
                            icon: 'glyphicon-file',
                            click: function() {
                                var selectionRowData = grid.gridView.getSelectionRowData();
                                if (selectionRowData && selectionRowData != null) {
                                    var objectId = selectionRowData['id'];
                                    if (objectId && objectId > 0) {
                                        t.connectorViewDialog.dialog = new Modal({
                                            title: '查看连接器',
                                            content: t.connectorViewDialog.container
                                        });
                                        t.connectorUpdateDialog.connectorForm = new ConnectorForm({
                                            el: t.connectorViewDialog.container
                                        }, {
                                            objectId: objectId,
                                            formType: 'view',
                                            loadDataEvent: OI.readConnector,
                                            fromIdentified: config.fromIdentified,
                                            callbackEvent: function() {
                                                //销毁窗口
                                                $(t.connectorViewDialog.dialog).modal('hide');
                                            }
                                        });
                                    } else {
                                        _log('id<0');
                                    }
                                } else {
                                    _log('no selection data');
                                }
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
                        columnName: 'Alias'
                    }, {
                        fieldName: 'fromOI',
                        columnName: '来源存储'
                    }, {
                        fieldName: 'fromField',
                        columnName: '来源字段'
                    }, {
                        fieldName: 'toOI',
                        columnName: '目标存储'
                    }, {
                        fieldName: 'toField',
                        columnName: '目标字段'
                    }], //columns
                    conditions: config.conditions //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return ConnectorListView;
    });