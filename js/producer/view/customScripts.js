define([
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/string',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/cover',
        'js/util/ui/view/search',
        'js/util/dictionary',
    ],
    function(
        Backbone, ButtonView, Message, StringUtil, Modal, Producer, MC,
        ListGridView, Cover, SearchBarView, Dictionary
    ) {
        var CustomScriptsView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    //载入页面的事件
                    loadPageEvent: function(handler, config) {
                        MC.customScriptsPage(handler, config);
                    },
                    //声明工具栏的按钮
                    loadButton: function(toolBar, grid) {
                        //删除的action
                        var __deleteOIAction = function(deleteModuleData) {
                            MC.deleteCustomScripts(deleteModuleData, function(data) {
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
                                var url = 'customScripts/add';
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
                                var selectData = grid.gridView.getSelectionRowData();
                                if (selectData && selectData['id'] && selectData['id'] > 0) {
                                    var url = 'customScripts/update/' + selectData['id'];
                                    options.routes.navigate(url, {
                                        trigger: true
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
                                        content: '是否删除当前自定义脚本',
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
                                if (selectData && selectData['id'] && selectData['id'] > 0) {
                                    var url = 'customScripts/view/' + selectData['id'];
                                    options.routes.navigate(url, {
                                        trigger: true
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
                        fieldName: 'description',
                        columnName: '描述'
                    }, {
                        fieldName: 'alias',
                        columnName: '别名'
                    }, {
                        fieldName: 'type',
                        columnName: '类型',
                        dictionary: Dictionary.ScriptsType
                    }, {
                        fieldName: 'producer',
                        columnName: '开发者'
                    }, {
                        fieldName: 'createDate',
                        columnName: '创建时间'
                    }], //columns
                    conditions: [] //log conditions
                }, config);
                new ListGridView(options, config);
            }
        });
        return CustomScriptsView;
    });