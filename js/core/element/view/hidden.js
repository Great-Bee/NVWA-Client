define('js/core/element/view/hidden', [

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/hidden.tpl'
], function(BaseElementView, StringUtil, HiddenTpl) {
    var HiddenView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                fieldName: null, //隐藏域对应的字段 
                value: null, //隐藏域的值
                //元素类型
                type: 'hidden',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
        },
        render: function() {
            this.$el.html(tpl(HiddenTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return [];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        setValue: function(value) {
            var t = this;
            t.$el.find('input').val(value);
        },
        getValue: function() {
            var t = this;
            return t.$el.find('input').val();
        }
    });
    return HiddenView;
});