define('js/producer/view/preview_container_form', [
    'backbone',

    'js/util/api/mc',
    'text!js/producer/template/previewContainerForm.tpl'
], function(Backbone, MCModel, previewFormTpl) {
    var PreviewContainerFormView = Backbone.View.extend({
        events: {},
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

            t.$el.html(tpl(previewFormTpl, {
                options: t.options,
                config: t.config
            }));
            var containerBean = t.containerModel['container'];
            //渲染最终表单
            requirejs(["js/core/container/view/form"], function(FormView) {
                new FormView({
                        el: $('#editor_container_form')
                    },
                    t.containerModel['container'],
                    t.containerModel['containerClientAttribute'],
                    t.containerModel['clientEvents'],
                    t.containerModel['elementViews'],
                    t.containerModel['elementLayout'],
                    false);
            });

            return t;
        }

    });
    return PreviewContainerFormView;
});