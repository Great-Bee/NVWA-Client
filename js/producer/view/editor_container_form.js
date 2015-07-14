define('js/producer/view/editor_container_form', [
    'backbone',

    'js/util/api/mc',
    'js/util/dictionary',
    'js/bower_components/achy/message',
    'js/util/string',
    'js/util/businessUtil',
    'text!js/producer/template/editorContainerForm.tpl',
    'js/bower_components/Slidebars/distribution/0.10.2/slidebars',
    'css!bower_components/Slidebars/distribution/0.10.2/slidebars',
    'js/bower_components/jQuery-Collapse/src/jquery.collapse',
], function(Backbone, MCModel, Dictionary, Message, StringUtil, BusinessUtil, formEditorTpl, SlidebarsView, SlidebarsViewCSS, CollapseView) {
    var EditorContainerFormView = Backbone.View.extend({
        events: {
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

            t.$el.html(tpl(formEditorTpl, {
                options: t.options,
                config: t.config
            }));

            var containerBean = t.containerModel['container'];

            //渲染元件
            requirejs(["js/producer/view/editorComponent"], function(EditorComponentView) {
                new EditorComponentView({
                    el: $('#component')
                }, {
                    containerBean: containerBean
                });
            });
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

            //渲染最终表单
            requirejs(["js/core/container/view/form"], function(FormView) {
                var componentsViewEl = $('#editor_container_form');
                t.componentsView = new FormView({
                        el: componentsViewEl
                    },
                    t.containerModel['container'],
                    t.containerModel['containerClientAttribute'],
                    t.containerModel['clientEvents'],
                    t.containerModel['elementViews'],
                    t.containerModel['elementLayout'],
                    true);
                componentsViewEl.on('container.form.afterCreate', function(e, data) {
                    new Message({
                        type: 'info',
                        msg: '触发了添加按钮',
                        timeout: 1500
                    });
                });
                componentsViewEl.on('container.form.afterUpdate', function(e, data) {
                    new Message({
                        type: 'info',
                        msg: '添加了保存按钮',
                        timeout: 1500
                    });
                });
                componentsViewEl.on('container.form.search', function(e, data) {
                    new Message({
                        type: 'info',
                        msg: '触发了搜索按钮',
                        timeout: 1500
                    });
                });
                componentsViewEl.on('container.form.close', function(e, data) {
                    new Message({
                        type: 'info',
                        msg: '触发了返回按钮',
                        timeout: 1500
                    });
                });

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

            //Collapse            
            t.collapse = new jQueryCollapse($("#containerSettings"));
            t.collapse.open(0);

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
        }
    });
    return EditorContainerFormView;
});