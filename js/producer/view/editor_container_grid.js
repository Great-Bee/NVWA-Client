define([
    'backbone',

    'js/util/api/mc',
    'js/util/dictionary',
    'achy/widget/ui/message',
    'js/util/string',
    'js/util/businessUtil',
    'text!js/producer/template/editorContainerGrid.tpl',
    'js/bower_components/Slidebars/distribution/0.10.2/slidebars',
    'css!bower_components/Slidebars/distribution/0.10.2/slidebars',
    'js/bower_components/jQuery-Collapse/src/jquery.collapse',
], function(Backbone, MCModel, Dictionary, Message, StringUtil, BusinessUtil, gridEditorTpl, SlidebarsView, SlidebarsViewCSS, CollapseView) {
    var EditorContainerGridView = Backbone.View.extend({
        events: {
            'click #openPanelLeft': 'openPanelLeft',
            'click #openPanelRight': 'openPanelRight',
            'click .btnCreateSimplePage': '_createSimplePage'
        },
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerAlias: null
            }, config);
            t.config = config;

            //读取Container相关信息
            MCModel.containerLayout(t.config['containerAlias'], function(response) {
                if (response['ok']) {
                    t.containerModel = response['dataMap']['container'];
                    if (!t.containerModel) {
                        alert('没有相关容器信息');
                        return;
                    }
                    t.render();
                    t.setCollapse();
                    t.setLayoutHeight();
                } else {
                    alert(response['message']);
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

            var containerBean = t.containerModel['container'];

            //渲染元件(TODO:改成渲染字段选择器)
            // requirejs(["js/producer/view/editorComponent"], function(EditorComponentView) {
            //     new EditorComponentView({
            //         el: $('#component')
            //     }, {
            //         containerBean: containerBean
            //     });
            // });
            //渲染条件
            requirejs(["js/producer/view/editorCondition"], function(EditorCondition) {
                new EditorCondition({
                    el: $('#condition')
                }, {
                    containerBean: containerBean,
                    conditions: [{
                        fieldName: 'containerId',
                        fieldValue: containerBean['id']
                    }]
                });
            });

            //渲染最终grid
            requirejs(["js/core/container/view/grid"], function(GridView) {
                t.componentsView = new GridView({
                        el: $('#editor_container_grid')
                    },
                    t.containerModel['container'],
                    t.containerModel['containerClientAttribute'],
                    t.containerModel['clientEvents'],
                    t.containerModel['elementViews'],
                    t.containerModel['elementLayout'],
                    true);

                //渲染属性
                requirejs(["js/producer/view/editorContainerAttribute"], function(EditorContainerAttribute) {
                    //如果检出发现服务器上没有返回客户端属性,则表示当前数据库里面没有该容器的客户端属性数据,拿出默认值赋值上去
                    var containerClientAttribute = t.containerModel['containerClientAttribute'] || t.componentsView.getDefaultAttribute();
                    containerClientAttribute['containerId'] = containerBean['id'];
                    var containerServerAttribute = t.containerModel['containerServerAttribute'] || {
                        containerId: containerBean['id']
                    };
                    new EditorContainerAttribute({
                        el: $('#attribute')
                    }, {
                        containerBean: containerBean,
                        containerClientAttribute: containerClientAttribute,
                        containerServerAttribute: containerServerAttribute,
                        supportAttribute: t.componentsView.supportAttribute(),
                        supportServerAttribute: t.componentsView.supportServerAttribute()
                    }, {
                        setAttribute: function(name, value) {
                            if (t.componentsView && t.componentsView.setAttribute && typeof(t.componentsView.setAttribute) == 'function') {
                                t.componentsView.setAttribute(name, value);
                            }
                        }
                    });
                });
                //渲染事件
                requirejs(["js/util/ui/view/editorEvent"], function(EditorEvent) {
                    new EditorEvent({
                        el: $('#event')
                    }, {
                        containerBean: containerBean,
                        target: Dictionary.EventTargetType.container,
                        targetId: containerBean['id'],
                        supportEventNames: t.componentsView.supportEventNames(),
                        supportServerEventNames: t.componentsView.supportServerEventNames()
                    });
                });
            });
            return t;
        },
        //action for creaste simple page
        _createSimplePage: function() {
            var t = this;
            BusinessUtil.createSimplePage(MCModel, StringUtil, t.containerModel['container']['alias'], function(createPageBean) {
                var url = 'page/edit/' + createPageBean['alias'];
                window.router.navigate(url, {
                    trigger: true
                });
            }, function() {
                new Message({
                    type: 'error',
                    msg: '创建简单页面失败',
                    timeout: 1500
                });
            });
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