define('js/producer/view/customScriptsParameters', [
        'backbone',
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
        'js/util/string',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/cover',
        'js/util/ui/view/search',
        'js/util/dictionary',
        'js/producer/view/customScriptsParametersForm'
    ],
    function(
        Backbone, ButtonView, Message, StringUtil, Modal, Producer, MC,
        ListGridView, Cover, SearchBarView, Dictionary, CustomScriptsParametersFormView
    ) {
        var CustomScriptsView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    //载入页面的事件
                    loadPageEvent: function(handler, config) {
                        MC.customScriptsParametersPage(handler, config);
                    },
                    //声明工具栏的按钮
                    loadButton: function(toolBar, grid) {
                        //删除的action
                        var __deleteOIAction = function(deleteModuleData) {
                            MC.deleteCustomScriptParameters(deleteModuleData, function(data) {
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
                        };
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '添加',
                            icon: 'glyphicon-plus',
                            click: function() {
                                t.creatDialog = {};
                                t.creatDialog.container = $('<div></div>');
                                t.creatDialog.dialog = new Modal({
                                    title: '添加参数',
                                    content: t.creatDialog.container
                                });
                                var formView = new CustomScriptsParametersFormView({
                                    el: t.creatDialog.container
                                }, {
                                    loadDataEvent: MC.readCustomScriptParameters,
                                    saveDataEvent: MC.addCustomScriptParameters,
                                    scriptAlias: config.scriptAlias,
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
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var selectData = grid.gridView.getSelectionRowData();
                                if (selectData) {
                                    var objectId = selectData['id'];
                                    t.updateDialog.dialog = new Modal({
                                        title: '更新参数',
                                        content: t.updateDialog.container
                                    });
                                    var formView = new CustomScriptsParametersFormView({
                                        el: t.updateDialog.container
                                    }, {
                                        objectId: objectId,
                                        formType: 'update',
                                        loadDataEvent: MC.readCustomScriptParameters,
                                        updateDataEvent: MC.updateCustomScriptParameters,
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
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '删除',
                            icon: 'glyphicon-trash',
                            click: function() {
                                var selectData = grid.gridView.getSelectionRowData();
                                if (selectData != null) {
                                    new Modal.Confirm({
                                        title: '删除',
                                        content: '是否删除当前自定义参数',
                                        yes: function() {
                                            __deleteOIAction(selectData);
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
                                var selectData = grid.gridView.getSelectionRowData();
                                if (selectData) {
                                    var objectId = selectData['id'];
                                    t.viewDialog.dialog = new Modal({
                                        title: '查看页面',
                                        content: t.viewDialog.container
                                    });
                                    var formView = new CustomScriptsParametersFormView({
                                        el: t.viewDialog.container
                                    }, {
                                        objectId: objectId,
                                        formType: 'view',
                                        loadDataEvent: MC.readPage,
                                        callbackEvent: function() {
                                            //销毁窗口
                                            $(t.viewDialog.dialog).modal('hide');
                                            $(t.viewDialog.dialog).remove();
                                        }
                                    });
                                }
                            }
                        });
                        new SearchBarView({
                            el: toolBar
                        }, {
                            autoSearch: false,
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
                        fieldName: 'defaultValue',
                        columnName: '默认值'
                    }], //columns
                    conditions: []
                }, config);
                new ListGridView(options, config);
            }
        });
        return CustomScriptsView;
    });