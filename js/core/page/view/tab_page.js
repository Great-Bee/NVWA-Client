define('js/core/page/view/tab_page', [

    'js/core/page/view/base_page',
    'text!js/core/page/template/tab_page.tpl',
    'js/util/api/mc',
    'js/util/dictionary',
    'js/bower_components/achy/message',
    'js/util/string',
    'js/util/ui/view/button',
    'js/util/ui/view/containerPaginationSelection',
    'js/util/ui/view/modal',
    'js/core/container/util/view/attribute',
    'js/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
    //   'text!js/bower_components/jQuery-contextMenu/src/jquery.contextMenu.css',
    'jqueryui'
], function(BasePageView, PageTpl, MC, DictionaryUtil, Message, StringUtil, ButtonView, ContainerSelection, Modal, AttributeView) {
    var PageView = BasePageView.extend({
        events: {
            "container.form.search": "__searchEvent",
            "afterSaveLayouts": "afterSaveLayouts",
        },
        initialize: function(options, pageBean, pageClientAttribute, pageclientEvents, pageElementViews, editAble) {
            var t = this;
            var addCss = function(cssurl) {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = cssurl;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            addCss('js/bower_components/jQuery-contextMenu/src/jquery.contextMenu.css');

            t.defaultClientAttribute = {

            };
            BasePageView.prototype.initialize.apply(this, arguments);
            t.render();
            t.attributes = {
                columnViews: []
            };
            t.initLayout();
            //    $('#tabTitle a:first').tab('show'); //初始化显示哪个tab 
            //    t.initListener();
        },
        afterSaveLayouts: function() {
            var t = this;
            //reload page
            //不需要重新加载
            //    location.reload();
        },
        //tab 显示
        _showTab: function(e, t, idname) {
            if (idname) {
                t.currentTab = idname.replace("#", "");
                event.preventDefault(); //阻止a链接的跳转行为 
                //    $(idname).tab('show'); //显示当前选中的链接及关联的content 
                t.$el.find('.nav-tabs').find('[role="presentation"]').removeClass('active');
                t.$el.find('[idname="' + idname + '"]').parent().addClass("active");

                t.$el.find('.tab-content').find('.tab-pane').removeClass('active');
                $(idname).addClass("active");
                if (t.editAble) {
                    //显示设置标题的属性
                    t._setTabTitleAttribute();
                }
                //清除之前的数据再渲染
                //     t.$el.find('#' + t.currentTab).find('.def-grid-bar').html('');
                //    t.$el.find(idname).find('[elementid]').remove();
                //    t._renderTab(t.layouts[i]);
            }
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
            //    t.layouts[1] = newLayouts;
            //设置当前tab 的element layouts
            t._chooiceTab(null, null, newLayouts);
            //update to server
            t._saveLayout();
        },
        //初始化top bar 的 事件
        _initTopBarListener: function(tabTitle) {
            var t = this;
            if (!tabTitle && t.currentTab) {
                tabTitle = t.currentTab;
            }
            t.$el.find('#' + tabTitle).find('.element-drop-area').droppable({
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
                                /*         t.layouts[1] = t.layouts[1] || [];
                                         var elementId = view.element.id;
                                         _log(t.layouts[1]);
                                  */
                                var elementId = view.element.id;
                                if (elementId) {
                                    t._chooiceTab(elementId, null, null, null);

                                    //    t.layouts[1].push(elementId);
                                    t.pageBean['layouts'] = t.layouts;
                                    //    t.$el.trigger('saveLayouts', [t.pageBean]);
                                    t._saveLayout();
                                }
                            }, null, componentAlias);
                        } else {
                            _log('no component alias');
                        }
                    }
                }
            });
            //fire top button box draggable event            
            t.$el.find('#' + tabTitle).find(".top-button-bar").sortable({
                update: function(event, ui) {
                    var elementBodys = $(event.target).find('[elementId]');
                    t.__updateElementLayout(elementBodys);
                }
            });
            t.$el.find('#' + tabTitle).find('.dropRemoveArea').droppable({
                drop: function(event, ui) {
                    var target = $(event.target).parent();
                    _log(target);
                }
            });
            t.$el.find('#tabTitle').find('[idname="#' + tabTitle + '"]').on('click', function() {
                var $tabTitle = $(event.target).attr("idname");
                t.currentTab = $tabTitle.replace("#", "");
                t._showTab(null, t, $tabTitle);
            })
        },
        _initElementListener: function(el, componentView, elementView) {
            var t = this;
            //init element settings listener
            _log('elementView');
            _log(elementView);
            //标记是否显示了 tab
            var flag = false;
            if (!componentView.$el.width()) {
                componentView.$el.parent().parent().parent().parent().addClass('active');
                flag = true;
            }
            var maskWidth = componentView.$el.width() || 200;
            var maskHeight = componentView.$el.height() || 34;
            //如果显示了tab 就关闭tab
            if (flag) {
                componentView.$el.parent().parent().parent().parent().removeClass('active');
            }
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
                                    var elementBodys = t.$el.find('#' + t.currentTab).find('.def-top-button-bar').find('[elementid]');
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
        //设置tab的title
        _setTabTitleAttribute: function() {
            var t = this;
            //get component support attribute
            var supportAttr = ['text'];
            //hidden掉所有的右边面板
            $('[data-collapse]').hide();
            //显示属性面板
            $('#elementSettings').html('');
            //随意给的一个element
            var element = {};
            element.id = 0;
            t.elementSettings = new AttributeView({
                    el: $('#elementSettings')
                }, {
                    supportAttribute: supportAttr,
                    clientAtttributes: {
                        text: t.currentTab
                    } || {}, //get component client attribute
                    serverAtttributes: null || {} //这个地方的元素不允许设置服务器属性
                },
                null,
                element, //get element object
                {
                    callbackEvent: function() {
                        //销毁窗口          
                    },
                    setClientAttribute: function(attributeName, attributeValue) {
                        //修改tab的标题只需要更新page表中的layouts属性
                        _log('attributeName=' + attributeName + '++attributeValue=' + attributeValue);
                        var $tabTitleDom = t.$el.find('[idname="#' + t.currentTab + '"]');
                        if ($tabTitleDom) {
                            // 修改idname
                            $tabTitleDom.attr("idname", '#' + attributeValue);
                            $tabTitleDom.html(attributeValue);
                            //修改id
                            t.$el.find('#' + t.currentTab).attr("id", attributeValue);
                            //设置layouts
                            t._chooiceTab(null, null, null, attributeValue);
                            //保存布局
                            t._saveLayout();
                            t.currentTab = attributeValue;
                            //添加监听
                            t._initTopBarListener(attributeValue);
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
            //默认打开第一
            if (supportAttr && supportAttr.length > 0) {
                //说明当前元素上已经有组件,默认打开客户端属性和事件这两个标签
                t.collapse.open(0);
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
        _getLastElementRenderTarget: function(tabTitle) {
            var t = this;
            if (!tabTitle && t.currentTab) {
                tabTitle = t.currentTab;
            }
            var list = t.$el.find('#' + tabTitle).find('.def-top-button-bar').children();
            if (list && list.length > 0) {
                var object = $(list[list.length - 1]);
                return t._getElementRenderTarget(object);
            } else {
                //Target length < 1
                _log('Target length < 1');
                return null;
            }
        },
        //初始化tab页面的布局
        initLayout: function() {
            var t = this;
            _log('page');
            _log(t.pageBean);
            _log('pageClientAttribute');
            _log(t.pageClientAttribute);
            //对于新创建的简单页面初始化布局
            t.pageBean['layouts'] = t.pageBean['layouts'] || '[[],[[],[],[]]]';
            if (t.pageBean && t.pageBean['layouts']) {
                _log('page layouts');
                t.layouts = eval("(" + t.pageBean['layouts'] + ")");
                _log(t.layouts);
                if (t.layouts && t.layouts.length >= 1) {
                    //渲染配置
                    //渲染搜索表单
                    t.hasSearchForm = false;
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
                            t.hasSearchForm = true;
                        }
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

                        //添加按钮 -添加tab
                        new ButtonView({
                            el: t.$el.find('.tab-setting-container')
                        }, {
                            text: '添加tab',
                            icon: 'glyphicon-plus',
                            click: function() {
                                //渲染tab
                                t._renderTabTitle('请输入tab的标题');
                                //给新增的tab 添加监听
                                t._initTopBarListener('请输入tab的标题');
                                //将新添加的tab设置成当前tab,并且设置t.currentTab
                                t._showTab(null, t, '#请输入tab的标题');
                                //添加layouts到page表中
                                var newLayoutJson = '[["请输入tab的标题"],[],[]]';
                                var newLayout = eval("(" + newLayoutJson + ")");
                                //渲染top
                                t._renderTab(newLayout);
                                //新增tab
                                t.layouts.push(newLayout);
                                //保存布局
                                t._saveLayout();


                            }
                        });
                    } else {
                        if (!t.hasSearchForm) {
                            t.$el.find('.search-setting-container').parent().parent().remove();
                        }
                    }
                    //渲染所有的tab标题
                    if (t.layouts && t.layouts.length > 1) {
                        for (var i = 1; i < t.layouts.length; i++) {
                            if (t.layouts[i][0] && t.layouts[i][0].length > 0) {
                                //渲染标题和 初始内容页
                                t._renderTabTitle(t.layouts[i][0][0]);
                                //渲染top
                                t._renderTab(t.layouts[i]);
                                //添加单个页面的监听
                                t._initTopBarListener(t.layouts[i][0][0]);
                                //默认显示第一个tab
                                if (i == 1) {
                                    t.currentTab = t.layouts[i][0][0];
                                    t.$el.find('[idname="#' + t.layouts[i][0][0] + '"]').parent().addClass('active');
                                    t.$el.find('#' + t.layouts[i][0][0]).addClass('active');
                                }
                            }
                        }
                    }
                    //拿到第一个tab
                    /*     var tabs = t.layouts[1];
                         if (tabs && tabs.length > 0 && tabs[0] && tabs[0].length > 0) {
                             t.currentTab = tabs[0][0]; //拿到当前tab 的标题
                             //渲染tab   默认渲染第一个列表
                             t._renderTab(tabs);
                         }*/

                }
            }
        },
        //渲染tab的标题 和 tab的初始内容页
        _renderTabTitle: function(tabTitle) {
            var t = this;
            if (tabTitle) {
                //先渲染标题
                var $tabTitle = $('<li role="presentation"><a href="#' + tabTitle + '" idname="#' + tabTitle + '">' + tabTitle + '</a></li>');
                t.$el.find('.tab-setting-container').parent().before($tabTitle);
                var tabContent = '<div class="tab-pane" id="' + tabTitle + '"><div><div class="' + (t.editAble ? "def" : "") + ' def-top-button-bar top-button-bar control-area ' + (t.editAble ? "ui-droppable" : "") + '"> <div class = "top-button-box"> ' + (t.editAble ? " <div class = 'column-mask hidden'> </div>" : "") + '<div  class="element-drop-area ' + (t.editAble ? "ui-droppable" : "") + '"> <def ' + (!t.editAble ? 'class = "hidden"' : "") + '> 请放置元件2 </def></div> </div></div> </div> <div> <div class = "form-group"> <div class = "grid-setting-container"> </div> <div class = "def def-grid-bar grid-bar control-area"> <def> 请放置元件 </def></div > </div></div> </div> ';
                //再渲染 tab初始内容页
                var $tabContent = $(tabContent);
                //tab内容初始化界面
                $tabContent.appendTo(t.$el.find('.tab-content'));
                if (t.editAble) {
                    //渲染 grid 添加按钮
                    var gridLayoutAddButtonView = t.$el.find('#' + tabTitle).find('.def-grid-bar');
                    gridLayoutAddButtonView.html('');
                    //如果是编辑状态，添加grid 的添加按钮
                    new ButtonView({
                        el: t.$el.find('#' + tabTitle).find('.grid-setting-container')
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
                }
            }
        },
        //渲染 单个tab页content   tabLyaout 是tab 的布局 [['tab1'],[490],['grid']]
        _renderTab: function(tabLyaout) {
            var t = this;
            //渲染grid
            var gridLayout = tabLyaout[2];
            if (gridLayout && gridLayout.length > 0 && tabLyaout[0][0]) {
                var data = {
                    alias: gridLayout[0],
                    type: 'grid'
                };
                t._containerSelection(t.$el.find('#' + tabLyaout[0][0]).find('.def-grid-bar'), data);
            }

            if (t.editAble) {
                //渲染 grid 添加按钮
                //  var gridLayoutAddButtonView = t.$el.find('#' + t.currentTab).find('.def-grid-bar');
                //  gridLayoutAddButtonView.html('');
                /*   new ButtonView({
                       el: t.$el.find('#' + t.currentTab).find('.grid-setting-container')
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
                   });*/
                //init context menu
                $.contextMenu({
                    selector: '[idname="#' + tabLyaout[0][0] + '"]',
                    callback: function(key, options) {
                        if (key == 'delete') {
                            var tabTilte = options.$trigger.attr("idname").replace("#", "");
                            _log(tabTilte);
                            if (tabTilte) {
                                //remove html dom

                                //这个tab 删除后  就默认选择前一个tab
                                var currentTabPrev = options.$trigger.parent().prev();
                                options.$trigger.parent().remove();
                                t.$el.find('#' + tabTilte).remove();
                                if (currentTabPrev) {
                                    //出发点击前一个tab 的事件
                                    //    currentTabPrev.children().trigger('click');
                                    var $tabTitle = currentTabPrev.children().attr('idname');
                                    t.currentTab = currentTabPrev.children().attr('idname').replace("#", "");
                                    t._showTab(null, t, $tabTitle);
                                }

                                var elementIds = tabLyaout[1];
                                if (elementIds && elementIds.length > 0) {
                                    //    var isDeletedLayout = false;
                                    for (var i = 0; i < elementIds.length; i++) {
                                        MC.deleteElement({
                                            id: elementIds[i]
                                        }, function(deleteElement) {
                                            if (deleteElement && deleteElement.ok) {
                                                //delete element success
                                                //update element layouts

                                                //     var elementBodys = t.$el.find('#' + t.currentTab).find('.def-top-button-bar').find('[elementid]');
                                                //    t.__updateElementLayout(elementBodys);
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
                                    //   var elementBodys = t.$el.find('#' + t.currentTab).find('.def-top-button-bar').find('[elementid]');
                                    //   t.__updateElementLayout(elementBodys);
                                }
                                debugger;
                                for (var i = 1; i < t.layouts.length; i++) {
                                    if (t.layouts[i] && t.layouts[i][0][0] == tabLyaout[0][0]) {
                                        t.layouts.splice(i, 1);
                                        break;
                                    }
                                }
                                //保存布局
                                t._saveLayout();

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
            } else {
                //no editable
                if (!t.hasSearchForm) {
                    //no search form
                    //remove search-setting-container
                    t.$el.find('.def-top-button-bar').parent().parent().parent().parent().attr('class', 'col-md-12');
                    t.$el.find('.grid-setting-container').parent().parent().parent().parent().parent().attr('class', 'col-md-12');
                }
            }
            //渲染顶部元素
            var topElementLayout = tabLyaout[1];
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
                    var eleRenderBody = t._getLastElementRenderTarget(tabLyaout[0]);
                    t._initColumn(eleView, eleRenderBody);
                });
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
                                e.parent().find('.column-mask-' + element.id).removeClass('hidden');
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
                //    t.layouts[2] = [data['alias']];
                t._chooiceTab(null, data['alias']);
            }
            t._saveLayout();
        },
        //通过tabTitle选择t.layouts中对应的位置,并设置值
        _chooiceTab: function(elementId, gridAlias, elementArray, tabTitle) {
            var t = this;
            if (t.currentTab) {
                for (var i = 1; i < t.layouts.length; i++) {
                    //找到当前tab
                    if (t.layouts[i][0] && t.layouts[i][0][0] == t.currentTab) {
                        //添加elements
                        if (elementId) {
                            t.layouts[i][1].push(elementId);
                        }
                        //添加grid
                        if (gridAlias) {
                            t.layouts[i][2] = [gridAlias];
                        }
                        //添加element数组
                        if (elementArray) {
                            t.layouts[i][1] = elementArray;
                        }
                        if (tabTitle) {
                            t.layouts[i][0] = [tabTitle];
                        }
                    }
                }
            }
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
            this.$el.html(tpl(PageTpl, {
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