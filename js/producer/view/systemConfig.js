define('js/producer/view/systemConfig', [
        'backbone',
        'text!js/producer/template/systemConfig.tpl',
        'js/util/ui/view/button',
        'js/util/ui/view/list',
        'js/util/ui/view/search',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/ui/view/cardView',
        'js/util/ui/view/modal',
        'js/producer/view/reservedField',
        'js/producer/view/component',
        'js/producer/view/containerObject',
        'js/producer/view/pageObject',
        'js/producer/view/sessionObject',
        'js/producer/view/clientReservedEvent',
        'js/producer/view/serverReservedEvent',
    ],
    function(Backbone, Tpl, ButtonView, ListGridView, SearchBarView, Producer, OI, CardView, Modal,
        ReservedFieldView, ComponentView, ContainerObjectView, PageObjectListView, SessionObjectListView, ClientReservedEventView, ServerReservedEventView) {
        var SystemConfigListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                t.options = options;
                t.config = config;
                t.render();
                new CardView({
                    el: t.$el.find('.cardContainer')
                }, {}, {
                    cards: [
                        [{
                            link: 'javascript:void(0);',
                            title: '保留字维护',
                            content: '保留字段基础数据维护',
                            onClick: function() {
                                t.reservedField = [];
                                t.reservedField.container = $('<div></div>');
                                t.reservedField.dialog = new Modal({
                                    title: '保留字维护',
                                    content: t.reservedField.container
                                });
                                new ReservedFieldView({
                                    el: t.reservedField.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: '元素组件',
                            content: '元件基础数据维护',
                            onClick: function() {
                                t.componentView = [];
                                t.componentView.container = $('<div></div>');
                                t.componentView.dialog = new Modal({
                                    title: '组件基础数据维护',
                                    content: t.componentView.container
                                });
                                new ComponentView({
                                    el: t.componentView.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: '容器对象类型',
                            content: '容器对象基础数据维护',
                            onClick: function() {
                                t.containerObjectListView = [];
                                t.containerObjectListView.container = $('<div></div>');
                                t.containerObjectListView.dialog = new Modal({
                                    title: '容器对象类型',
                                    content: t.containerObjectListView.container
                                });
                                new ContainerObjectView({
                                    el: t.containerObjectListView.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: '页面对象类型',
                            content: '页面对象基础数据维护',
                            onClick: function() {
                                t.pageObjectListView = [];
                                t.pageObjectListView.container = $('<div></div>');
                                t.pageObjectListView.dialog = new Modal({
                                    title: '页面对象类型',
                                    content: t.pageObjectListView.container
                                });
                                new PageObjectListView({
                                    el: t.pageObjectListView.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: 'Session对象',
                            content: '建设中.....',
                            onClick: function() {
                                t.sessionObjectListView = [];
                                t.sessionObjectListView.container = $('<div></div>');
                                t.sessionObjectListView.dialog = new Modal({
                                    title: 'Session对象类型',
                                    content: t.sessionObjectListView.container
                                });
                                new SessionObjectListView({
                                    el: t.sessionObjectListView.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: '客户端保留事件',
                            content: '客户端保留事件基础数据维护',
                            onClick: function() {
                                t.clientReservedEventView = [];
                                t.clientReservedEventView.container = $('<div></div>');
                                t.clientReservedEventView.dialog = new Modal({
                                    title: '客户端保留事件',
                                    content: t.clientReservedEventView.container
                                });
                                new ClientReservedEventView({
                                    el: t.clientReservedEventView.container
                                }, {});
                            }
                        }, {
                            link: 'javascript:void(0);',
                            title: '服务器保留事件',
                            content: '服务器基础数据维护',
                            onClick: function() {
                                t.serverReservedEventView = [];
                                t.serverReservedEventView.container = $('<div></div>');
                                t.serverReservedEventView.dialog = new Modal({
                                    title: '服务器保留事件',
                                    content: t.serverReservedEventView.container
                                });
                                new ServerReservedEventView({
                                    el: t.serverReservedEventView.container
                                }, {});
                            }
                        }]
                    ]
                });
            },
            render: function() {
                var t = this;
                t.$el.html(_.template(Tpl, {
                    options: t.options,
                    config: t.config
                }));
                return t;
            }
        });
        return SystemConfigListView;
    });