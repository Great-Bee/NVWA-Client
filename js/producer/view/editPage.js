define([
    'backbone',

    'js/util/api/mc',
    'js/util/dictionary',
    'achy/widget/ui/message',
    'text!js/producer/template/editPage.tpl',
    'js/bower_components/Slidebars/distribution/0.10.2/slidebars',
    'css!bower_components/Slidebars/distribution/0.10.2/slidebars',
    'js/bower_components/jQuery-Collapse/src/jquery.collapse',
], function(Backbone, MCModel, Dictionary, Message, gridEditorTpl, SlidebarsView, SlidebarsViewCSS, CollapseView) {
    var EditorContainerGridView = Backbone.View.extend({
        events: {
            'click #openPanelLeft': 'openPanelLeft',
            'click #openPanelRight': 'openPanelRight',
        },
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                pageAlias: null
            }, config);
            t.config = config;
            _log('edit page layout');
            _log(config);

            //读取Container相关信息
            MCModel.pageLayout(t.config['pageAlias'], function(response) {
                if (response && response['ok']) {
                    if (response['dataMap'] && response['dataMap']['layout']) {
                        _log(response.dataMap);
                        t.pageView = response['dataMap']['layout']; //page layouts
                        t.pageView['elementViews'] = response['dataMap']['elementViews']; //elementViews
                        t.render();
                    } else {
                        _log('没有相page信息');
                        return;
                    }
                } else {
                    _log(response['message']);
                }
            });

        },

        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;

            t.$el.html(tpl(gridEditorTpl, {
                options: t.options,
                config: t.config
            }));

            var pageBean = t.pageView['page'];
            var pageClientAttribute = t.pageView['pageClientAttribute'];
            var pageServerAttribute = t.pageView['pageServerAttribute'];
            var pageServerEvents = t.pageView['serverEvents'];
            var pageclientEvents = t.pageView['clientEvents'];
            var pageElementViews = t.pageView['elementViews'];

            //渲染container
            var pageContainer = $('#editor_page');
            requirejs(["js/core/page/view/" + pageBean.type], function(PageView) {
                t.componentsView = new PageView({
                        el: pageContainer
                    },
                    pageBean,
                    pageClientAttribute,
                    pageclientEvents,
                    pageElementViews,
                    true);
                //listen save layouts event
                pageContainer.on('saveLayouts', function(e, data) {
                    MCModel.updatePageLayout(data, function(response) {
                        if (response && response.ok) {
                            if (response && response.ok) {
                                //删除成功  
                                new Message({
                                    type: 'info',
                                    msg: '更新页面布局成功',
                                    timeout: 1500
                                });
                            } else {
                                new Message({
                                    type: 'error',
                                    msg: '更新页面布局失败',
                                    timeout: 1500
                                });
                                _log(response.message);
                            }
                        }
                        pageContainer.trigger('afterSaveLayouts', [response]);
                    });
                });
                //listen save element client attribute event
                pageContainer.on('saveElementClientAttribute', function(e, data) {
                    MCModel.updateElementClientAttribute(data, function(response) {
                        if (response && response.ok) {
                            if (response && response.ok) {
                                //添加成功
                            } else {
                                //false
                                new Message({
                                    type: 'error',
                                    msg: '更新元素客户端属性失败',
                                    timeout: 1500
                                });
                                _log(response.message);
                            }
                        }
                        pageContainer.trigger('afterSaveElementClientAttribute', [response]);
                    });
                });
                //渲染事件
                requirejs(["js/util/ui/view/editorEvent"], function(EditorEvent) {
                    new EditorEvent({
                        el: $('#event')
                    }, {
                        containerBean: pageBean,
                        target: Dictionary.EventTargetType.page,
                        targetId: pageBean['id'],
                        supportEventNames: t.componentsView.supportEventNames(),
                        supportServerEventNames: t.componentsView.supportServerEventNames()
                    });
                });
                requirejs(["js/producer/view/editorPageAttribute"], function(EditorPageAttribute) {
                    new EditorPageAttribute({
                        el: $('#attribute')
                    }, {
                        pageBean: pageBean,
                        serverAttribute: pageServerAttribute,
                        supportServerAttribute: t.componentsView.supportServerAttribute()
                    });
                });
            });

            //渲染元件列表
            var componenViewContainer = $('#component');

            requirejs(["js/producer/view/editorComponent"], function(EditorComponentView) {
                new EditorComponentView({
                    el: componenViewContainer
                }, {
                    containerBean: null
                });
            });


            //绑定元件的事件
            componenViewContainer.on('startDraggable', function() {
                pageContainer.trigger('startDraggable');
            });
            componenViewContainer.on('stopDraggable', function() {
                pageContainer.trigger('stopDraggable');
            });
            return t;
        },
        setCollapse: function() {
            var t = this;
            t.collapse = new jQueryCollapse($("#containerSettings"));
            t.collapse.open(0);
        },
        setLayoutHeight: function() {
            var t = this;
            $('#editor_container_form').height($(window).height() - 80);
        },
        setSlidebars: function() {
            var t = this;
            t.slidebarsView = new $.slidebars();
        },
        openPanelLeft: function(e) {
            var t = this;
            t.slidebarsView.slidebars.open('left');
        },
        openPanelRight: function(e) {
            var t = this;
            t.slidebarsView.slidebars.open('right');
        }
    });
    return EditorContainerGridView;
});