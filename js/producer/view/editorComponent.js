define([
    'backbone',

    'js/util/api/mc',
    'text!js/producer/template/editorComponent.tpl',
    'jqueryui'
], function(Backbone, MCModel, editorComponentTpl) {
    var EditorComponentView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerBean: null,
                data: null
            }, config);
            t.config = config;
            t.beforeRender(function() {
                t.render(function() {
                    t.afterRender(function() {
                        t.bindEvent();
                    });
                });
            });
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function(callback) {
            var t = this;
            t.$el.html(tpl(editorComponentTpl, {
                options: t.options,
                config: t.config,
                data: t.config['data']
            }));

            t.$el.find("a").each(function(i, btn) {
                $(btn).draggable({
                    appendTo: "body",
                    helper: "clone",
                    revert: "invalid",
                    cursor: "move",
                    start: function(e) {
                        t.$el.trigger('startDraggable');
                    },
                    stop: function(e) {
                        t.$el.trigger('stopDraggable');
                    }
                });
            });
            if (callback) {
                callback();
            }
            return t;
        },
        beforeRender: function(callback) {
            var t = this;
            MCModel.componentPage(function(data) {
                t.config['data'] = data['currentRecords'];
                if (callback) {
                    callback();
                }
            }, {
                page: 1,
                pageSize: 200
            });
        },
        afterRender: function(callback) {
            var t = this;
            if (callback) {
                callback();
            }
        },
        bindEvent: function() {
            var t = this;
        }

    });
    return EditorComponentView;
});