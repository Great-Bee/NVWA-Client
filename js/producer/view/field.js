define('js/producer/view/field', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/ui/view/list',
        'js/util/dictionary',
        'js/producer/view/fieldForm',
        'js/producer/view/reservedSelection'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, OI,
        ListGridView, Dictionary, FieldForm, ReservedSelectionView
    ) {
        var FieldListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        OI.fieldPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.fildCreatDialog = {};
                        t.fildCreatDialog.container = $('<div></div>');
                        var __deleteFieldAction = function(deleteModuleData) {
                            OI.deleteField(deleteModuleData, function(data) {
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
                                t.fildCreatDialog.dialog = new Modal({
                                    title: '字段添加',
                                    content: t.fildCreatDialog.container
                                });
                                t.fildCreatDialog.fieldForm = new FieldForm({
                                    el: t.fildCreatDialog.container
                                }, {
                                    identified: config.identified,
                                    loadDataEvent: OI.readField,
                                    saveDataEvent: OI.addField,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.fildCreatDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                        } else {
                                            //update false

                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.fildCreatDialog.dialog).modal('hide');
                                    }
                                });
                            }
                        });
                        t.fildUpdateDialog = {};
                        t.fildUpdateDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                t.fildUpdateDialog.dialog = new Modal({
                                    title: '更新Field',
                                    content: t.fildUpdateDialog.container
                                });
                                t.fildUpdateDialog.fieldForm = new FieldForm({
                                    el: t.fildUpdateDialog.container
                                }, {
                                    objectId: objectId,
                                    identified: config.identified,
                                    formType: 'update',
                                    loadDataEvent: OI.readField,
                                    updateDataEvent: OI.updateField,
                                    afterUpdateEvent: function(data) {
                                        if (data && data.ok) {
                                            //update success
                                            //销毁窗口
                                            $(t.fildUpdateDialog.dialog).modal('hide');
                                            //reload grid data
                                            grid.gridView.loadData();
                                        }
                                    },
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.fildUpdateDialog.dialog).modal('hide');
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
                                        content: '是否删除该字段',
                                        yes: function() {
                                            new Modal.Confirm({
                                                title: '删除',
                                                content: '是否删除schema上的字段',
                                                yes: function() {
                                                    deleteModuleData['dropSchema'] = true;
                                                    __deleteFieldAction(deleteModuleData);
                                                },
                                                no: function() {
                                                    __deleteFieldAction(deleteModuleData);
                                                }
                                            });
                                        },
                                        no: function() {

                                        }
                                    });
                                }
                            }
                        });
                        t.fildViewDialog = {};
                        t.fildViewDialog.container = $('<div></div>');
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看',
                            icon: 'glyphicon-file',
                            click: function() {
                                var objectId = grid.gridView.getSelectionRowData()['id'];
                                t.fildViewDialog.dialog = new Modal({
                                    title: '查看Field',
                                    content: t.fildViewDialog.container
                                });
                                t.fildViewDialog.fieldForm = new FieldForm({
                                    el: t.fildViewDialog.container
                                }, {
                                    objectId: objectId,
                                    identified: config.identified,
                                    formType: 'view',
                                    loadDataEvent: OI.readField,
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.fildViewDialog.dialog).modal('hide');
                                    }
                                });
                            }
                        });
                        t.reservedDialog = {};
                        t.reservedDialog.container = $('<div></div>');
                        var __loadReservedsToContainer = function(reserveds) {
                            t.reservedDialog.container.html('');
                            var reservedSelections = [];
                            $.each(reserveds, function(index, item) {
                                if (item) {
                                    _log(item);
                                    if (item['name'] && item['attributes']) {
                                        try {
                                            item['attributesObject'] = eval("(" + item['attributes'] + ")");
                                            item['attributesObject']['identified'] = config.identified;
                                            reservedSelections.push(item);
                                        } catch (e) {
                                            _log('reserved attributes error!');
                                        }
                                    }
                                }
                            });
                            t.reservedSelectionView = new ReservedSelectionView({
                                el: t.reservedDialog.container
                            }, {
                                reserveds: reservedSelections,
                                selectEvent: function(selection) {
                                    OI.addField(selection['attributesObject'], function(data) {
                                        if (data && data.ok) {
                                            //添加成功
                                            new Message({
                                                type: 'info',
                                                msg: '添加保留字 ' + selection['name'] + ' 成功',
                                                timeout: 1500
                                            });
                                            //reload grid
                                            grid.gridView.loadData();
                                            //disable reserveds
                                            t.reservedSelectionView.disable(selection['fieldName']);
                                        } else {
                                            new Message({
                                                type: 'error',
                                                msg: '添加保留字 ' + selection['name'] + ' 失败,' + data.message,
                                                timeout: 1500
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        var __loadReserveds = function() {
                            //loading reserveds
                            OI.listReservedField(function(data) {
                                if (data) {
                                    t.reserveds = data;
                                    __loadReservedsToContainer(t.reserveds);
                                }
                            }, {
                                identified: config.identified
                            });
                        };

                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '添加保留字',
                            icon: 'glyphicon-plus',
                            click: function() {
                                __loadReserveds();
                                t.reservedDialog.dialog = new Modal({
                                    title: '添加保留字',
                                    content: t.reservedDialog.container
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
                        fieldName: 'dataTypeField',
                        columnName: '类型',
                        dictionary: Dictionary.DataFieldType
                    }, {
                        fieldName: 'length',
                        columnName: '长度'
                    }, {
                        fieldName: 'defaultValue',
                        columnName: '默认值'
                    }], //columns
                    conditions: config.conditions //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return FieldListView;
    });