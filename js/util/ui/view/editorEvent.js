define([
    'backbone',

    'js/util/api/mc',
    'text!js/util/ui/template/editorEvent.tpl',
    'js/util/ui/view/button',
    'js/util/string',
    'js/util/dictionary',
    'js/util/ui/view/editorClientEvent',
    'js/util/ui/view/editorServerEvent'
], function(Backbone, MCModel, Tpl, ButtonView, StringUtil, Dictionary, EditorClientEventView, EditorServerEventView) {

    var EditorEvent = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            var serialNumber = config['serialNumber'];
            if (!serialNumber) {
                config['serialNumber'] = StringUtil.randomSN();
            }
            config = $.extend({
                containerBean: null,
                target: Dictionary.EventTargetType.container,
                targetId: 0,
                supportEventNames: [],
                supportServerEventNames: []
            }, config);
            t.config = config;
            t.render();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;

            t.$el.html(tpl(Tpl, {
                options: t.options,
                config: t.config
            }));

            t.setClientEventView();
            return t;
        },
        setClientEventView: function() {
            var t = this;
            new EditorClientEventView({
                el: t.$el.find('#' + t.config.serialNumber + '-clientEventGrid')
            }, {
                containerBean: t.config.containerBean,
                target: t.config.target,
                targetId: t.config.targetId,
                supportEventNames: t.config.supportEventNames
            });

            new EditorServerEventView({
                el: t.$el.find('#' + t.config.serialNumber + '-serverEventGrid')
            }, {
                containerBean: t.config.containerBean,
                target: t.config.target,
                targetId: t.config.targetId,
                supportServerEventNames: t.config.supportServerEventNames
            });
        }

    });

    return EditorEvent;

});