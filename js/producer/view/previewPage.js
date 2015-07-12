define('js/producer/view/previewPage', [
    'backbone',

    'js/util/api/mc',
    'js/util/dictionary',
    'text!js/producer/template/previewPage.tpl',
], function(Backbone, MCModel, Dictionary, pagePreviewTpl) {
    var PreviewPageView = Backbone.View.extend({
        events: {

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

            t.$el.html(tpl(pagePreviewTpl, {
                options: t.options,
                config: t.config
            }));

            var pageBean = t.pageView['page'];
            var pageClientAttribute = t.pageView['pageClientAttribute'];
            var pageServerAttribute = t.pageView['pageServerAttribute'];
            var pageServerEvents = t.pageView['serverEvents'];
            var pageclientEvents = t.pageView['clientEvents'];
            var pageElementViews = t.pageView['elementViews'];
            //渲染事件
            requirejs(["js/util/ui/view/editorEvent"], function(EditorEvent) {
                new EditorEvent({
                    el: $('#event')
                }, {
                    containerBean: pageBean,
                    target: Dictionary.EventTargetType.page,
                    targetId: pageBean['id']
                });
            });
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
                    false);
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
    return PreviewPageView;
});