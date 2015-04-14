define([
    'backbone',
    'underscore',
    'js/util/api/mc',
    'js/util/dictionary',
    'text!js/producer/template/previewContainerGrid.html',
    'js/bower_components/Slidebars/distribution/0.10.2/slidebars',
    'css!bower_components/Slidebars/distribution/0.10.2/slidebars',
    'js/bower_components/jQuery-Collapse/src/jquery.collapse',
], function(Backbone, _, MCModel, Dictionary, gridEditorTpl, SlidebarsView, SlidebarsViewCSS, CollapseView) {
    var EditorContainerGridView = Backbone.View.extend({
        events: {
            'click #openPanelLeft': 'openPanelLeft',
            'click #openPanelRight': 'openPanelRight',
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

            t.$el.html(_.template(gridEditorTpl, {
                options: t.options,
                config: t.config
            }));
            var containerBean = t.containerModel['container'];
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
                    false);
            });
            return t;
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