/**
 *session object grid view
 **/
define('js/producer/view/sessionObject', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/producer/view/sessionObjectForm',
        'js/util/dictionary'
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, SearchBarView, SessionObjectFormView, Dictionary
    ) {
        var PageListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.sessionDataBeanPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        t.creatDialog = {};
                        t.creatDialog.container = $('<div></div>');
                        var __deletePageAction = function(deleteModuleData) {
                            MC.deleteSessionDataBean(deleteModuleData, function(data) {
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
                                    title: '添加SessionObject',
                                    content: t.creatDialog.container
                                });
                                t.creatDialog.form = new SessionObjectFormView({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: MC.readSessionDataBean,
                                    saveDataEvent: MC.addSessionDataBean,
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
                                    },
                                    confirmAddContnet: '是否添加Session对象'
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
                                t.updateDialog = {};
                                t.updateDialog.container = $('<div></div>');
                                t.updateDialog.dialog = new Modal({
                                    title: '更新SessionObject',
                                    content: t.updateDialog.container
                                });
                                t.updateDialog.reservedFieldForm = new SessionObjectFormView({
                                    el: t.updateDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'update',
                                    loadDataEvent: MC.readSessionDataBean,
                                    updateDataEvent: MC.updateSessionDataBean,
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
                                    },
                                    confirmAddContnet: '是否更新Session对象'
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
                                        content: '是否删除该SessionObject',
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
                                t.viewDialog = {};
                                t.viewDialog.container = $('<div></div>');
                                t.viewDialog.dialog = new Modal({
                                    title: '查看SessionObject',
                                    content: t.viewDialog.container
                                });
                                t.viewDialog.reservedFieldForm = new SessionObjectFormView({
                                    el: t.viewDialog.container
                                }, {
                                    objectId: objectId,
                                    formType: 'view',
                                    loadDataEvent: MC.readSessionDataBean,
                                    callbackEvent: function() {
                                        //销毁窗口
                                        $(t.viewDialog.dialog).modal('hide');
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
                        fieldName: 'description',
                        columnName: '描述'
                    }, {
                        fieldName: 'sessionKey',
                        columnName: 'SessionKey'
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