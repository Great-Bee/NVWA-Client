/**
 * grid 组件
 **/
define('js/util/ui/view/columnFormat', [
    'backbone',
    'js/core/element/view/base_element',
    'text!js/util/ui/template/columnFormat.tpl',
    'js/core/element/view/checkbox'
], function(Backbone, BaseElementView, Tpl, CheckboxView) {
    var HtmlView = BaseElementView.extend({
        events: {
            "change .format": "_typeChoose",
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            BaseElementView.prototype.initialize.apply(t, arguments);
            this.defaultAttributes = {}
            this.attributes = $.extend({}, this.defaultClientAttribute, attributes);
            t.render();
        },
        render: function() {
            var t = this;
            this.$el.html(tpl(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            t.isCoin = new CheckboxView({
                el: t.$el.find('.coinContainer')
            }, {}, {});
            return this;
        },
        supportAttribute: function() {
            return ['title', 'columnFormat'];
        },
        supportEventNames: function() {
            return [];
        },
        supportServerEventNames: function() {
            return [];
        },
        _typeChoose: function() {
            var t = this;
            var format = t.$el.find(".format").val();
            if (format == 'number') {
                t.$el.find(".datetimeContainer").addClass("hidden");
                t.$el.find(".digitNumContainer").removeClass("hidden");
                t.$el.find(".isCoinContainer").removeClass("hidden");
            } else if (format == 'datetime') {
                t.$el.find(".digitNumContainer").addClass("hidden");
                t.$el.find(".isCoinContainer").addClass("hidden");
                t.$el.find(".datetimeContainer").removeClass("hidden");
            } else {
                t.$el.find(".digitNumContainer").addClass("hidden");
                t.$el.find(".isCoinContainer").addClass("hidden");
                t.$el.find(".datetimeContainer").addClass("hidden");
            }
        },

        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
        },
        setValue: function(value) {
            var t = this;
            t.$el.find(".format").val("");
            t.$el.find(".digitNum").val("0");
            if (value && typeof value == 'string' && value.length > 0) {
                value = eval("(" + value + ")");
                var format = value['format'];
                t.$el.find(".format").val(format);
                if (format == 'number') {
                    t.$el.find(".digitNum").val(value['digitNum']);
                    //TODO checkbox 这里需要测试一下
                    t.isCoin.setValue(value['isCoin']);
                } else if (format == 'datetime') {
                    t.$el.find(".datetime").val(value['datetime']);
                }
                t._typeChoose();
            }
        },
        getValue: function() {
            var t = this;
            var format = t.$el.find(".format").val();
            var value = {};
            value['format'] = format;
            if (format == 'number') {
                value['digitNum'] = t.$el.find(".digitNum").val();
                value['isCoin'] = t.isCoin.getValue();
            } else if (format == 'datetime') {
                value['datetime'] = t.$el.find(".datetime").val();
            }
            return JSON.stringify(value);
        }
    });
    return HtmlView;
});