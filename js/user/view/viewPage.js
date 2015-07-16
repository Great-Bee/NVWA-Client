define('js/user/view/viewPage', [
    'backbone',
    'js/util/api/user',
    'js/util/dictionary',
    'text!js/user/template/viewPage.tpl',
], function(Backbone, UserModel, Dictionary, pageViewTpl) {
    var ViewPageView = Backbone.View.extend({
        events: {

        },
        initialize: function(options, config) {
            var t = this;

            var removeCss = function(cssurl) {
                    var findStr = '[href="' + cssurl + '"]';
                    var findDom = $(document.getElementsByTagName("head")[0]).find(findStr);
                    if (findDom) {
                        findDom.remove();
                    }
                }
                //    removeCss('js/bower_components/user-login/css/bootstrap.css');
                //    removeCss('js/bower_components/user-login/css/bootstrap-responsive.css');
                //    removeCss('js/bower_components/user-login/css/user-login.css');
                //    removeCss('js/bower_components/user-index/css/user-index.css');
                //    removeCss('js/bower_components/user-index/css/bootstrap.min.css');
                //    removeCss('js/bower_components/user-index/css/bootstrap-responsive.min.css');


            t.options = options;
            config = $.extend({
                pageAlias: null
            }, config);
            t.config = config;
            _log('view page layout');
            _log(config);

            //读取Container相关信息
            UserModel.pageLayout(t.config['pageAlias'], function(response) {
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

            t.$el.html(tpl(pageViewTpl, {
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
            /*     requirejs(["js/util/ui/view/editorEvent"], function(EditorEvent) {
                     new EditorEvent({
                         el: $('#event')
                     }, {
                         containerBean: pageBean,
                         target: Dictionary.EventTargetType.page,
                         targetId: pageBean['id']
                     });
                 });*/
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
    return ViewPageView;
});