define('js/producer/view/oi', [
        'backbone',
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
        'js/util/string',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/ui/view/list',
        'js/util/ui/view/cover',
        'js/util/ui/view/search',
        'js/util/dictionary',
        'js/producer/view/deleteOIConfirm',
    ],
    function(
        Backbone, ButtonView, Message, StringUtil, Modal, Producer, OI,
        ListGridView, Cover, SearchBarView, Dictionary, DeleteOIConfirm
    ) {
        var OIListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        OI.oiPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        var __deleteOIAction = function(deleteModuleData) {
                            OI.deleteOi(deleteModuleData, function(data) {
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
                                //跳转到添加OI的表单
                                var url = 'oi/add';
                                options.routes.navigate(url, {
                                    trigger: true
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '修改',
                            icon: 'glyphicon-pencil',
                            click: function() {
                                var updateModuleData = grid.gridView.getSelectionRowData();
                                if (updateModuleData && updateModuleData['id'] && updateModuleData['id'] > 0) {
                                    var url = 'oi/update/' + updateModuleData['id'];
                                    options.routes.navigate(url, {
                                        trigger: true
                                    });
                                }
                            }
                        });
                        var deleteConfimContent = $('<form></form>');
                        new DeleteOIConfirm({
                            el: deleteConfimContent
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '删除',
                            icon: 'glyphicon-trash',
                            click: function() {
                                deleteConfimContent.find('input').prop('checked', false);
                                var deleteModuleData = grid.gridView.getSelectionRowData();
                                if (deleteModuleData != null) {
                                    new Modal.Confirm({
                                        title: '删除',
                                        content: deleteConfimContent,
                                        yes: function() {
                                            var isSync = deleteConfimContent.find('input').prop('checked');
                                            if (isSync) {
                                                deleteModuleData['dropSchema'] = true;
                                            }
                                            __deleteOIAction(deleteModuleData);
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
                                var updateModuleData = grid.gridView.getSelectionRowData();
                                if (updateModuleData && updateModuleData['id'] && updateModuleData['id'] > 0) {
                                    var url = 'oi/view/' + updateModuleData['id'];
                                    options.routes.navigate(url, {
                                        trigger: true
                                    });
                                }
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '制作容器',
                            icon: 'glyphicon-calendar',
                            click: function() {
                                var selectModuleData = grid.gridView.getSelectionRowData();
                                var url = 'container/add?oi=' + selectModuleData['identified'];
                                options.routes.navigate(url, {
                                    trigger: true
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '存储 → Schema',
                            icon: 'glyphicon-circle-arrow-down',
                            click: function() {
                                var syncModuleData = grid.gridView.getSelectionRowData();
                                Producer.syncOItoSchema(syncModuleData, function(data) {
                                    if (data) {
                                        if (data.ok) {
                                            //同步成功                                    
                                            new Message({
                                                type: 'info',
                                                msg: '同步成功',
                                                timeout: 1500
                                            });
                                            grid.gridView.loadData();
                                        } else {
                                            //同步失败                                    
                                            new Message({
                                                type: 'error',
                                                msg: '同步失败',
                                                timeout: 1500
                                            });
                                        }
                                    }
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '载入数据库配置',
                            icon: 'glyphicon-circle-arrow-up',
                            click: function() {
                                new Modal.Confirm({
                                    title: '提示',
                                    content: '执行该操作，会重新加载所有的数据库配置',
                                    yes: function() {
                                        var cover = new Cover({
                                            el: $(document.body)
                                        }, {
                                            text: '正在同步......'
                                        });
                                        cover.show();
                                        new Message({
                                            type: 'success',
                                            msg: '正在同步......',
                                            timeout: 1500
                                        });
                                        Producer.syncSchemaToOI(function(data) {
                                            if (data) {
                                                if (data.ok) {
                                                    //同步成功
                                                    new Message({
                                                        type: 'info',
                                                        msg: '同步成功',
                                                        timeout: 1500
                                                    });
                                                    grid.gridView.loadData();
                                                    cover.hiden();
                                                } else {
                                                    //同步失败
                                                    new Message({
                                                        type: 'error',
                                                        msg: '同步失败',
                                                        timeout: 1500
                                                    });
                                                    cover.hiden();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '查看日志',
                            icon: 'glyphicon-list-alt',
                            click: function() {
                                var url = 'oi/log';
                                options.routes.navigate(url, {
                                    trigger: true
                                });
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
                        fieldName: 'identified',
                        columnName: '标识符'
                    }, {
                        fieldName: 'tableName',
                        columnName: '数据库表名'
                    }, {
                        fieldName: 'status',
                        columnName: '状态',
                        dictionary: Dictionary.OIStatus
                    }, {
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return OIListView;
    });