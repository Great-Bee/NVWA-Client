define([
    'underscore',
    'js/core/page/view/base_page',
    'text!js/core/page/template/simple_page.html',
    'js/util/api/mc',
    'js/util/ui/view/button',
    'js/util/ui/view/containerPaginationSelection',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
], function(_, BasePageView, PageTpl, MC, ButtonView, ContainerSelection, Modal, Message) {
    var PageView = BasePageView.extend({
        events: {},
        initialize: function(options, pageBean, pageClientAttribute, pageclientEvents, pageElementViews, editAble) {
            var t = this;
            t.defaultClientAttribute = {
                style: 'primary'
            };
            BasePageView.prototype.initialize.apply(this, arguments);
            t.attributes = {
                columnViews: []
            };
            t.render();
        },
        //初始化简单页面的布局
        initLayout: function() {
            var t = this;
            //对于新创建的简单页面初始化布局
            t.pageBean['layouts'] = t.pageBean['layouts'] || '[[]]';
            if (t.pageBean && t.pageBean['layouts']) {
                _log('page layouts');
                t.layouts = eval("(" + t.pageBean['layouts'] + ")");
                _log(t.layouts);
                if (t.layouts && t.layouts.length >= 1) {
                    //渲染配置
                    //渲染搜索表单
                    var containerLayout = t.layouts[0];
                    if (containerLayout && containerLayout.length > 0) {
                        if (containerLayout[0]) {
                            //读取container的信息                            
                            var data = {
                                alias: containerLayout[0],
                                type: 'form'
                            };
                            t._containerSelection(t.$el.find('.def-search-bar'), data);
                        }
                    }
                    if (t.editAble) {
                        //渲染容器添加按钮
                        var searchFormLayoutAddButtonView = t.$el.find('.def-search-bar');
                        searchFormLayoutAddButtonView.html('');
                        new ButtonView({
                            el: t.$el.find('.grid-setting-container')
                        }, {
                            text: '添加容器',
                            icon: 'glyphicon-plus',
                            click: function() {
                                t.containerSelectionView = [];
                                t.containerSelectionView.container = $('<div></div>');
                                t.containerSelectionView.dialog = new Modal({
                                    title: '选择表单容器',
                                    content: t.containerSelectionView.container
                                });
                                t.fieldGrid = new ContainerSelection({
                                    el: t.containerSelectionView.container
                                }, {

                                });
                                t.containerSelectionView.container.on('selectedContainer', function(e, data) {
                                    //关闭选择器
                                    $(t.containerSelectionView.dialog).modal('hide');
                                    t._containerSelection(searchFormLayoutAddButtonView, data);
                                    t.pageBean.layouts = $nvwa.string.objectToJsonString(t.layouts);
                                    MC.updatePage(t.pageBean, function(response) {
                                        if (response && response.ok) {
                                            new Message({
                                                type: 'info',
                                                msg: '添加容器成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            new Message({
                                                type: 'warn',
                                                msg: '添加容器失败',
                                                timeout: 1500
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            }
        },
        //容器选择器的回调
        _containerSelection: function(el, data) {
            var t = this;
            t._renderContainer(el, data);
            t.layouts[0] = [data['alias']];
        },
        //render container
        _renderContainer: function(el, data) {
            var t = this;
            //去掉默认元素
            el.removeClass('def');
            el.removeClass('search-bar');
            el.removeClass('grid-bar');
            //渲染容器
            if (data && data['alias'] && data['alias'].length > 0) {
                //读取Container相关信息
                MC.containerLayout(data['alias'], function(response) {
                    if (response['ok']) {
                        var containerView = response['dataMap']['container'];
                        if (!containerView) {
                            alert('没有相关容器信息');
                            return;
                        }
                        if (containerView.container && containerView.container.type) {
                            var containerType = containerView.container.type;
                            if (containerType == 'form') {
                                t._renderForm(el,
                                    containerView['container'],
                                    containerView['containerClientAttribute'],
                                    containerView['clientEvents'],
                                    containerView['elementViews'],
                                    containerView['elementLayout'], false);
                            } else if (containerType == 'grid') {
                                t._renderGrid(el,
                                    containerView['container'],
                                    containerView['containerClientAttribute'],
                                    containerView['clientEvents'],
                                    containerView['elementViews'],
                                    containerView['elementLayout'], false);
                            }
                        }
                    } else {
                        _log(response['message']);
                    }
                });
            }
        },
        //渲染容器
        _renderForm: function(el, containerBean, containerClientAttribute, clientEvents, elementViews, elementLayout) {
            var t = this;
            if (el && containerBean && containerBean.id && $nvwa.string.isVerify(containerBean.alias)) {
                requirejs(["js/core/container/view/form"], function(FormView) {
                    t.formView = new FormView({
                            el: el
                        },
                        containerBean,
                        containerClientAttribute,
                        clientEvents,
                        elementViews,
                        elementLayout, false);
                    BasePageView.prototype.setContainer.apply(t, [t.formView]);
                });
            }
        },
        //render grid
        _renderGrid: function(el, containerBean, containerClientAttribute, clientEvents, elementViews, elementLayout) {
            var t = this;
            if (el && containerBean && containerBean.id && $nvwa.string.isVerify(containerBean.alias)) {
                requirejs(["js/core/container/view/grid"], function(GridView) {
                    t.gridView = new GridView({
                            el: el
                        },
                        containerBean,
                        containerClientAttribute,
                        clientEvents,
                        elementViews,
                        elementLayout, false);
                    BasePageView.prototype.setContainer.apply(t, [t.gridView]);
                });
            }
        },
        render: function() {
            var t = this;
            this.$el.html(_.template(PageTpl, {
                pageBean: this.pageBean,
                attributes: this.pageClientAttribute,
                editAble: this.editAble
            }));
            t.initLayout();
            return this;
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            switch (attributeName) {
                case 'title':
                    t.$el.find('.panel-title').html(attributeValue);
                    break;
                case 'width':

                    break;
                case 'style':
                    t.$el.children('div').attr('class', 'panel panel-' + attributeValue);
                    break;
                default:
                    return;
            }
        }
    });
    return PageView;
});