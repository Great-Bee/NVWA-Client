/**
 *按钮组件
 */
define([], function() {
    var ButtonView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                containerId: 0,
                //label的宽度
                labelCol: null,
                //编辑器宽度
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //前缀
                prefix: null,
                //是否禁用
                disabled: false,
                //是否只读
                readonly: false,
                //表单大小
                size: null,
                buttonSize: 'default',
                //PlaceHolder
                placeholder: null,
                //编辑器类型
                type: 'button',
                //Feedback
                feedback: null,
                //=================button属性===================
                text: 'button',
                click: null, //click event function
                icon: 'glyphicon-cog',
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
            var config = t.config;
            var element = $('<button type="button" class="btn btn-default btn-' + config.buttonSize + '" ><span class="glyphicon ' + config.icon + '"></span> <b>' + config.text + '</b></button>').appendTo(t.$el);
            if (config['click']) {
                element.bind('click', config['click']);
            }
        }
    });
    return ButtonView;
});