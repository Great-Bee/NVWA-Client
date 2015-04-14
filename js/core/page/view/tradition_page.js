define([
    'underscore',
    'js/core/page/view/base_page',
    'text!js/core/page/template/tradition_page.html',
    'js/util/api/mc',
    'js/util/dictionary',
    'achy/widget/ui/message',
    'js/util/string',
    'js/util/ui/view/button',
    'js/util/ui/view/containerPaginationSelection',
    'js/util/ui/view/modal',
    'js/core/container/util/view/attribute',
    'js/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
    'css!js/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
], function(_, BasePageView, PageTpl, MC, DictionaryUtil, Message, StringUtil, ButtonView, ContainerSelection, Modal, AttributeView) {
    var PageView = BasePageView.extend({
        events: {
            "container.form.search": "__searchEvent",
            "afterSaveLayouts": "afterSaveLayouts",
        },
        initialize: function(options, pageBean, pageClientAttribute, pageclientEvents, pageElementViews, editAble) {
            var t = this;
            t.defaultClientAttribute = {

            };
            BasePageView.prototype.initialize.apply(this, arguments);
            t.render();
            t.attributes = {
                columnViews: []
            };
            t.initLayout();
            t.initListener();
        },
        afterSaveLayouts: function() {
            var t = this;
            //reload page
            location.reload();
        },
        __updateElementLayout: function(elementBodys) {
            var t = this;
            var newLayouts = [];
            $.each(elementBodys, function(i, eleBody) {
                _log('eleBody');
                _log(eleBody);
                newLayouts.push($(eleBody).attr('elementId'));
            });
            _log('update layouts');
            _log(newLayouts);
            //update layouts
            t.layouts[1] = newLayouts;
            //update to server
            t._saveLayout();
        },
        initListener: function() {
            var t = this;

            t.$el.find('.element-drop-area').droppable({
                over: function(event, ui) {
                    //拖拽经过
                },
                out: function(event, ui) {
                    //拖拽离开
                },
                drop: function(event, ui) {
                    var target = $(event.target).parent();
                    var columnViewBody = t._getElementRenderTarget(target);
                    columnViewBody.html('');
                    //get component alias
                    if (!columnViewBody) {
                        _log('no body for render(drop)');
                    } else {
                        _log('element node');
                        var componentAlias = $(ui.draggable).attr('alias');
                        if (!componentAlias) {
                            componentAlias = $(ui.draggable).attr('alias');
                        }
                        _log($(event.toElement));
                        _log(componentAlias);
                        if (componentAlias) {
                            t._addColumn(columnViewBody, function(view) {
                                //init component to render on el
                                t._initColumn(view, columnViewBody);
                                //save layout to database
                                //获取当前顶部元素的布局,如果为null则初始化一个数组
                                t.layouts[1] = t.layouts[1] || [];
                                var elementId = view.element.id;
                                _log(t.layouts[1]);
                                if (elementId) {
                                    t.layouts[1].push(elementId);
                                    t.pageBean['layouts'] = t.layouts;
                                    t.$el.trigger('saveLayouts', [t.pageBean]);
                                }
                            }, null, componentAlias);
                        } else {
                            _log('no component alias');
                        }
                    }
                }
            });
            //fire top button box draggable event            
            $(".top-button-bar").sortable({
                update: function(event, ui) {
                    var elementBodys = $(event.target).find('[elementId]');
                    t.__updateElementLayout(elementBodys);
                }
            });
            t.$el.find('.dropRemoveArea').droppable({
                drop: function(event, ui) {
                    var target = $(event.target).parent();
                    _log(target);
                }
            });
        },
        _initElementListener: function(el, componentView, elementView) {
            var t = this;
            //init element settings listener
            _log('elementView');
            _log(elementView);
            var maskWidth = componentView.$el.width() || 200;
            var maskHeight = componentView.$el.height() || 34;
            var maskBody = el.parent().find('.column-mask');
            maskBody.width(maskWidth);
            maskBody.height(maskHeight);
            maskBody.on('click', function() {
                t._settingAttribute(componentView, elementView);
            });
            //init context menu
            $.contextMenu({
                selector: '.column-mask-' + elementView.element.id,
                callback: function(key, options) {
                    if (key == 'delete') {
                        var elementId = options.$trigger.parent().attr('elementid');
                        _log(elementId);
                        if (elementId) {
                            //remove html dom
                            options.$trigger.parent().remove();

                            MC.deleteElement({
                                id: elementId
                            }, function(deleteElement) {
                                if (deleteElement && deleteElement.ok) {
                                    //delete element success
                                    //update element layouts
                                    var elementBodys = t.$el.find('.def-top-button-bar').find('[elementid]');
                                    t.__updateElementLayout(elementBodys);
                                    //alert message
                                    new Message({
                                        type: 'info',
                                        msg: '删除元素成功',
                                        timeout: 1500
                                    });
                                } else {
                                    //delete element error
                                    //alert message
                                    new Message({
                                        type: 'error',
                                        msg: '删除元素失败',
                                        timeout: 3000
                                    });
                                }
                            });
                        }
                    }
                },
                items: {
                    "delete": {
                        name: "删除",
                        icon: "delete"
                    }
                }
            });
        },
        __searchEvent: function(e, data) {
            var t = this;
            var api = t.formView.containerAPI;
            var views = api.getViews();
            var searchRequest = {};
            $.each(views, function(i, view) {
                if (view && view.getValue &&
                    view.eleBean && view.eleBean.element && view.eleBean.element.fieldSerialNumber) {
                    var value = view.getValue();
                    var sn = view.eleBean.element.fieldSerialNumber;
                    //building search object
                    searchRequest[sn] = value;
                }
            });
            //send request to grid for search
            //get grid $el
            var gridEl = t.gridView.$el;
            //trigger the grid search event
            gridEl.trigger('search', [searchRequest]);
        },
        _settingAttribute: function(componentView, elementView) {
            var t = this;
            //get component support attribute
            var supportAttr = componentView.supportAttribute();
            var element = elementView.element;
            //hidden掉所有的右边面板
            $('[data-collapse]').hide();
            //显示属性面板
            $('#elementSettings').html('');
            t.elementSettings = new AttributeView({
                    el: $('#elementSettings')
                }, {
                    supportAttribute: supportAttr,
                    clientAtttributes: elementView.elementClientAttribute || {}, //get component client attribute
                    serverAtttributes: null || {} //这个地方的元素不允许设置服务器属性
                },
                null,
                element, //get element object
                {
                    callbackEvent: function() {
                        //销毁窗口          

                    },
                    setClientAttribute: function(attributeName, attributeValue) {
                        if (componentView) {
                            componentView.setAttribute(attributeName, attributeValue);
                        }
                    },
                    setClientAttributes: function(saveData) {
                        //todo save clientAttributes
                        if (elementView) {
                            if (elementView.elementClientAttribute) {
                                elementView.elementClientAttribute = $.extend(elementView.elementClientAttribute, saveData);
                                if (!elementView.elementClientAttribute['elementId']) {
                                    if (elementView.element) {
                                        if (elementView.element.id) {
                                            elementView.elementClientAttribute['elementId'] = elementView.element.id;
                                        } else {
                                            _log('elementView.element.id is null');
                                        }
                                    } else {
                                        _log('elementView.element is null');
                                    }
                                }
                                _log('change client attributeValue');
                                _log(elementView.elementClientAttribute);

                                t.$el.trigger('saveElementClientAttribute', [elementView.elementClientAttribute]);
                            } else {
                                _log("elementView ->  elementClientAttribute is null");
                            }
                        } else {
                            _log("elementView is null");
                        }
                    },
                    setServerAttributes: function(saveData) {
                        //这个地方的元素不允许设置服务器属性
                    },
                    rollbackClientAttr: function(clientAttr) {
                        $.each(clientAttr, function(k, attr) {
                            componentView.setAttribute(k, attr);
                        });
                        new Message({
                            type: 'info',
                            msg: '回滚当前元素客户端属性设置',
                            timeout: 1500
                        });
                    }
                });
            //屏蔽服务端属性的tab
            t.elementSettings.disableServerAttribute();
            //激活控件
            t.collapse = new jQueryCollapse($("#elementSettings"));
            //默认打开第一和第二个tab
            if (supportAttr && supportAttr.length > 0) {
                //说明当前元素上已经有组件,默认打开客户端属性和事件这两个标签
                t.collapse.open(0);
                t.collapse.open(2);
            }
            //显示
            $('#elementSettings').show();
        },
        //获取渲染元素的锚点
        _getElementRenderTarget: function(target) {
            // body...
            var columnObj = target.clone(true);
            target.before(columnObj);
            columnObj.find('.element-drop-area').removeClass('element-drop-area');
            var columnViewBody = columnObj.find('def').parent();
            return columnViewBody;
        },
        //获取渲染元素的锚点 for last
        _getLastElementRenderTarget: function() {
            var t = this;
            var list = t.$el.find('.def-top-button-bar').children();
            if (list && list.length > 0) {
                var object = $(list[list.length - 1]);
                return t._getElementRenderTarget(object);
            } else {
                //Target length < 1
                _log('Target length < 1');
                return null;
            }
        },
        //初始化传统页面的布局
        initLayout: function() {
            var t = this;
            _log('page');
            _log(t.pageBean);
            _log('pageClientAttribute');
            _log(t.pageClientAttribute);
            //对于新创建的简单页面初始化布局
            t.pageBean['layouts'] = t.pageBean['layouts'] || '[[],[],[]]';
            if (t.pageBean && t.pageBean['layouts']) {
                _log('page layouts');
                t.layouts = eval("(" + t.pageBean['layouts'] + ")");
                _log(t.layouts);
                if (t.layouts && t.layouts.length >= 1) {
                    //渲染配置
                    //渲染搜索表单
                    var hasSearchForm = false;
                    var searchFormLayout = t.layouts[0];
                    if (searchFormLayout && searchFormLayout.length > 0) {
                        if (searchFormLayout[0]) {
                            _log('init search form');
                            _log('alias=' + searchFormLayout[0]);
                            var data = {
                                alias: searchFormLayout[0],
                                type: 'form'
                            };
                            t._containerSelection(t.$el.find('.def-search-bar'), data);
                            hasSearchForm = true;
                        }
                    }
                    //渲染grid
                    var gridLayout = t.layouts[2];
                    if (gridLayout && gridLayout.length > 0) {
                        var data = {
                            alias: gridLayout[0],
                            type: 'grid'
                        };
                        t._containerSelection(t.$el.find('.def-grid-bar'), data);
                    }

                    if (t.editAble) {
                        //渲染 search from 添加按钮
                        var searchFormLayoutAddButtonView = t.$el.find('.def-search-bar');
                        searchFormLayoutAddButtonView.html('');
                        new ButtonView({
                            el: t.$el.find('.search-setting-container')
                        }, {
                            text: '添加搜索表单容器',
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
                                    conditions: [{
                                        fieldName: 'type',
                                        fieldValue: 'form'
                                    }]
                                });
                                t.containerSelectionView.container.on('selectedContainer', function(e, data) {
                                    //关闭选择器
                                    $(t.containerSelectionView.dialog).modal('hide');
                                    t._containerSelection(searchFormLayoutAddButtonView, data);
                                });
                            }
                        });
                        //渲染 grid 添加按钮
                        var gridLayoutAddButtonView = t.$el.find('.def-grid-bar');
                        gridLayoutAddButtonView.html('');
                        new ButtonView({
                            el: t.$el.find('.grid-setting-container')
                        }, {
                            text: '添加显示分页数据容器',
                            icon: 'glyphicon-plus',
                            click: function() {
                                t.containerSelectionView = [];
                                t.containerSelectionView.container = $('<div></div>');
                                t.containerSelectionView.dialog = new Modal({
                                    title: '选择列表容器',
                                    content: t.containerSelectionView.container
                                });
                                t.fieldGrid = new ContainerSelection({
                                    el: t.containerSelectionView.container
                                }, {
                                    conditions: [{
                                        fieldName: 'type',
                                        fieldValue: 'grid'
                                    }]
                                });
                                t.containerSelectionView.container.on('selectedContainer', function(e, data) {
                                    //关闭选择器
                                    $(t.containerSelectionView.dialog).modal('hide');
                                    t._containerSelection(gridLayoutAddButtonView, data);
                                });
                            }
                        });
                    } else {
                        //no editable
                        if (!hasSearchForm) {
                            //no search form
                            //remove search-setting-container
                            t.$el.find('.search-setting-container').parent().parent().remove();
                            t.$el.find('.def-top-button-bar').parent().parent().attr('class', 'col-md-12');
                            t.$el.find('.grid-setting-container').parent().parent().attr('class', 'col-md-12');
                        }
                    }
                    //渲染顶部元素
                    var topElementLayout = t.layouts[1];
                    if (topElementLayout && topElementLayout.length > 0) {
                        var eleViewsMap = {};
                        if (t.pageElementViews && t.pageElementViews.length > 0) {
                            $.each(t.pageElementViews, function(k, elementView) {
                                if (elementView && elementView.element && elementView.element.id) {
                                    eleViewsMap[elementView.element.id] = elementView;
                                }
                            });
                        }
                        $.each(topElementLayout, function(i, elementId) {
                            //render element
                            //get element view from viewMap
                            var eleView = eleViewsMap[elementId];
                            _log(eleView);
                            //TODO 渲染顶部元素
                            var eleRenderBody = t._getLastElementRenderTarget();
                            t._initColumn(eleView, eleRenderBody);
                        });
                    }

                }
            }
        },
        //添加一列(element) to database
        _addColumn: function(e, handler, columnWidth, componentAlias) {
            var t = this;
            //adding element to database
            var element = {
                name: t.pageBean['id'] + '-page',
                componentAlias: componentAlias,
                pageId: t.pageBean['id']
            };
            //请求数据库添加element
            MC.addElement(element, function(response) {
                if (response && response.ok) {
                    var elementId = response['dataMap']['id'];
                    element['id'] = elementId;
                    //请求数据库添加element的客户端布局元素
                    var elementView = {
                        element: element,
                        clientEvents: {},
                        serverEvents: {},
                        elementClientAttribute: {
                            columnWidth: columnWidth
                        },
                        elementServerAttribute: {}
                    };
                    //update element client attribute 
                    var updateElementClientAttributeModel = {
                        elementId: element['id'],
                        columnWidth: columnWidth
                    };
                    updateElementClientAttributeModel = $.extend(updateElementClientAttributeModel, {});
                    MC.updateElementClientAttribute(updateElementClientAttributeModel, function() {
                        //call back handler
                        if (handler && handler != null) {
                            handler(elementView);
                        }
                    });
                }
            });
        },
        //初始化列布局(element)
        _initColumn: function(elementView, e) {
            var t = this;
            if (elementView) {
                var elementClientEvents = elementView.clientEvents || [];
                //get element view object
                if (elementView) {
                    //获取element对象
                    var element = elementView['element'];
                    //element attribute
                    var eleAttribute = elementView['elementClientAttribute'] || {};
                    //render element
                    if (!e) {
                        _log('no body for render');
                        return null;
                    }
                    e.parent().attr('elementId', element.id);
                    e.parent().find('.column-mask').addClass('column-mask-' + element.id);

                    if (element && element.componentAlias && $nvwa.string.isVerify(element.componentAlias)) {
                        _log('elementId=' + element.id);
                        _log('alias=' + element.componentAlias);
                        requirejs(["js/core/element/view/" + element.componentAlias], function(ComponentView) {
                            var componentView = new ComponentView({
                                el: e
                            }, element, eleAttribute, elementClientEvents, t.editAble);
                            if (t.editAble) {
                                //only for editable
                                t._initElementListener(e, componentView, elementView);
                                $('.column-mask-' + element.id).removeClass('hidden');
                            }
                            return componentView;
                        });
                    } else {
                        _log('no componentAlias');
                        return null;
                    }
                }
            }

        },
        _saveLayout: function() {
            var t = this;
            var saveLayoutJSON = StringUtil.objectToJsonString(t.layouts);
            t.pageBean['layouts'] = saveLayoutJSON;
            t.$el.trigger('saveLayouts', [t.pageBean]);
        },
        //容器选择器的回调
        _containerSelection: function(el, data) {
            var t = this;
            t._renderContainer(el, data);
            if (data['type'] == 'form') {
                t.layouts[0] = [data['alias']];
            } else if (data['type'] == 'grid') {
                t.layouts[2] = [data['alias']];
            }
            t._saveLayout();
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
                        if (data['type'] == 'form') {
                            t._renderSearchForm(el,
                                containerView['container'],
                                containerView['containerClientAttribute'],
                                containerView['clientEvents'],
                                containerView['elementViews'],
                                containerView['elementLayout'], false);
                        } else if (data['type'] == 'grid') {
                            t._renderGrid(el,
                                containerView['container'],
                                containerView['containerClientAttribute'],
                                containerView['clientEvents'],
                                containerView['elementViews'],
                                containerView['elementLayout'], false);
                        }

                    } else {
                        _log(response['message']);
                    }
                });
            }
        },
        //渲染容器
        _renderSearchForm: function(el, containerBean, containerClientAttribute, clientEvents, elementViews, elementLayout) {
            var t = this;
            containerClientAttribute['cancelAble'] = false;
            containerClientAttribute['createAble'] = false;
            containerClientAttribute['updateAble'] = false;
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
        },
        //render grid
        _renderGrid: function(el, containerBean, containerClientAttribute, clientEvents, elementViews, elementLayout) {
            var t = this;
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
        },
        render: function() {
            this.$el.html(_.template(PageTpl, {
                pageBean: this.pageBean,
                attributes: this.pageClientAttribute,
                editAble: this.editAble
            }));
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