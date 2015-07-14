define('js/producer/view/container', [
        'backbone',
        'js/util/ui/view/button',
        'js/bower_components/achy/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/util/dictionary',
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC,
        ListGridView, SearchBarView, Dictionary
    ) {
        var ContainerListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    loadPageEvent: function(handler, config) {
                        MC.containerPage(handler, config);
                    },
                    loadButton: function(toolBar, grid) {
                        var __deleteOIAction = function(deleteModuleData) {
                            MC.deleteContainer(deleteModuleData, function(data) {
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
                                //跳转到添加container的表单
                                var url = 'container/add';
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
                                    var url = 'container/update/' + updateModuleData['id'];
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
                                var deleteModuleData = grid.gridView.getSelectionRowData();
                                if (deleteModuleData && deleteModuleData['id'] && deleteModuleData['id'] > 0) {
                                    new Modal.Confirm({
                                        title: '删除',
                                        content: '是否删除该容器',
                                        yes: function() {
                                            __deleteOIAction(deleteModuleData);
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
                                var updateModuleData = grid.gridView.getSelectionRowData();
                                if (updateModuleData && updateModuleData['id'] && updateModuleData['id'] > 0) {
                                    var url = 'container/view/' + updateModuleData['id'];
                                    options.routes.navigate(url, {
                                        trigger: true
                                    });
                                }
                            }
                        });
                        new ButtonView({
                            el: toolBar
                        }, {
                            text: '编辑UI',
                            icon: 'glyphicon glyphicon-th',
                            click: function() {
                                var selectModuleData = grid.gridView.getSelectionRowData();
                                if (selectModuleData && selectModuleData['id'] && selectModuleData['id'] > 0) {
                                    var type = selectModuleData['type'];
                                    var alias = selectModuleData['alias'];
                                    var url = 'container/' + type + '/edit/' + alias;
                                    options.routes.navigate(url, {
                                        trigger: true
                                    });
                                }
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
                        fieldName: 'oi',
                        columnName: 'OI'
                    }, {
                        fieldName: 'type',
                        columnName: '类型',
                        dictionary: Dictionary.ContainerType
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
        return ContainerListView;
    });