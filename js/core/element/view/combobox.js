define([
    'underscore',
    'js/core/module/nvwaUser',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/combobox.html',
    'bootstrap-combobox',
    'achy/widget/ui/message'
], function(_, NvwaUserAPI, BaseElementView, StringUtil, ComboboxTpl, Combobox, Message) {
    var ComboboxView = BaseElementView.extend({
        events: {
            'change': '_onChange',
            // 'afterLoadData': 'render'//写这里又不生效了，坑爹
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                //是否只读
                readonly: false,
                datasource: null,
                // value: null, //当前的值
                //元素类型
                type: 'combobox'
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            var t = this;
            this.$el.on('afterLoadData', function() {
                t.render();
            });
            this.loadData();

        },
        render: function() {
            this.$el.html(_.template(ComboboxTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                data: this.data, //选择框的数据
                editAble: this.editAble
            }));
            this.initCombobox();
            return this;
        },
        initCombobox: function() {
            var t = this;
            t.element = t.$el.find('.combobox');
            //设置默认值
            if (t.attributes.value) {
                t.element.val(t.attributes.value);
            }
            t.element.combobox();
            if (t.attributes.readonly) {
                t.element.combobox('disable');
            }
        },
        _onChange: function() {
            var value = this.element.val();
            if (this.eves.onChange) {
                this.eves.onChange(value);
            }
            if (this.eves.onSelect) {
                this.eves.onSelect(value);
            }
        },
        supportAttribute: function() {
            return ['readonly', 'datasource'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['select', 'keyup', 'keydown', 'keypress'];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        getDatasourceSchemaList: function() {
            return [{
                name: "文本",
                schema: "text"
            }, {
                name: "值",
                schema: "value"
            }]
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            switch (attributeName) {
                case 'disabled':
                    t.attributes[attributeName] = attributeValue;
                    t.setEnable(!attributeValue);
                    break;
                case 'readonly':
                    t.attributes[attributeName] = attributeValue;
                    t.setEnable(!attributeValue);
                    break;
                case 'datasource':
                    break;
                case 'value':
                    t.setValue(attributeValue);
                    break;
                default:
                    return;
            }
        },
        setValue: function(value) {
            var t = this;
            var attributes = t.attributes;
            t.element.val(value);
            t.element.combobox('parse', value);
        },
        getValue: function() {
            var t = this;
            var attributes = t.attributes;
            var value = t.element.val();
            if (value) {
                return value;
            } else {
                _log('请选择一个选项');
            }
        },
        setEnable: function(enable) {
            var t = this;
            if (enable) {
                t.element.combobox('enable');
                t.attributes.readonly = false;
            } else {
                t.element.combobox('disable');
                t.attributes.readonly = true;
            }
        }
    });
    return ComboboxView;
});