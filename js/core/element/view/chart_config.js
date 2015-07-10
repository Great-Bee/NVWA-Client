define([
    'backbone',
    'js/core/element/view/base_element',
    'text!js/core/element/template/chart_config.tpl'
], function(Backbone, BaseElementView, ChartConfigTpl) {
    var ChartConfigView = BaseElementView.extend({
        events: {},
        //初始化
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            BaseElementView.prototype.initialize.apply(t, arguments);
            t.render();
        },
        __debug: function() {
            _log(this.getValue());
        },
        //渲染
        render: function() {
            var t = this;
            this.$el.html(tpl(ChartConfigTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        //获取支持的客户端事件
        supportEventNames: function() {
            return [];
        },
        //获取支持的服务器事件
        supportServerEventNames: function() {
            return [];
        },
        //设置控件的值
        setValue: function(value) {
            var t = this;
            if (value && typeof value == 'string' && value.length > 0) {
                value = eval("(" + value + ")");
                t.$el.find(".chart_type").val(value['chart']['type']);
                t.$el.find(".title_text").val(value['title']['text']);
                t.$el.find(".subtitle_text").val(value['subtitle']['text']);
                t.$el.find(".xAxis_title_text").val(value['xAxis']['title']['text']);
                t.$el.find(".yAxis_title_text").val(value['yAxis']['title']['text']);
            }
        },
        //获取控件的值
        getValue: function() {
            var t = this;
            var value = {
                chart: {
                    type: t.$el.find(".chart_type").val()
                },
                title: {
                    text: t.$el.find(".title_text").val()
                },
                subtitle: {
                    text: t.$el.find(".subtitle_text").val()
                },
                xAxis: {
                    title: {
                        text: t.$el.find(".xAxis_title_text").val()
                    },
                },
                yAxis: {
                    title: {
                        text: t.$el.find(".yAxis_title_text").val()
                    }
                }
            };
            return JSON.stringify(value);
        }
    });
    return ChartConfigView;
});