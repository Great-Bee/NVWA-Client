define([
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/checkbox.tpl',
    'bootstrap-checkbox'
], function(BaseElementView, StringUtil, CheckboxTpl, CheckboxControl) {
    var CheckboxView = BaseElementView.extend({
        events: {
            'click a': 'onSelect'
        },
        //初始化
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                defaultValue: false, //默认不选中**
                reverse: false, //是否反向**
                title: null, //标题**
                dataOffTitle: null, //off标签文字**
                dataOnTitle: null, //on标签文字**
                dataOffIconClass: null, //off标签的图标**
                dataOnIconClass: null, //on标签的图标**
                dataOfflabel: true, //是否显示off标签上的文字**
                dataOnlabel: true, //是否显示on标签上的文字**
                dataOffColor: null, //off标签上的颜色** warning primary info 
                dataOnColor: null, //on标签上的颜色** warning primary info 
                //编辑器宽度**
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //是否禁用**
                disabled: false,
                //元素类型
                type: 'checkbox'
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.initCheckbox();
        },
        //渲染
        render: function() {
            this.$el.html(tpl(CheckboxTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        //初始化选择器
        initCheckbox: function() {
            var t = this;
            var checkboxDefaultAttribute = {
                offLabel: 'No',
                onLabel: 'Yes',
                offTitle: false,
                onTitle: false,
            };
            if (t.attributes) {
                if (t.attributes['dataOffTitle']) {
                    checkboxDefaultAttribute['offLabel'] = t.attributes['dataOffTitle'];
                }
                if (t.attributes['dataOnTitle']) {
                    checkboxDefaultAttribute['onLabel'] = t.attributes['dataOnTitle'];
                }
            }
            t.checkbox = $(':checkbox').checkboxpicker(checkboxDefaultAttribute);
            BaseElementView.prototype.bindEvents.apply(this, arguments);
            var onSelectEvent = function() {
                t.$el.on('click', function(e) {
                    var currentValue = t.getValue();
                    //fire select event
                    t.$el.trigger('select', [currentValue]);
                });
            };
            setTimeout(onSelectEvent(), 100);
        },
        //支持的客户端属性
        supportAttribute: function() {
            return ['defaultValue', 'reverse', 'title', 'dataOffTitle', 'dataOnTitle', 'dataOffIconClass', 'dataOnIconClass',
                'dataOffColor', 'dataOnColor', 'helpLabel', 'disabled'
            ];
        },
        //支持的服务器属性
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        //支持的客户端事件
        supportEventNames: function() {
            return ['click', 'dblclick'];
        },
        //支持的服务器事件
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            var __rerender = function() {
                t.$el.children().remove();
                t.render();
                t.initCheckbox();
            };
            t.attributes[attributeName] = attributeValue;
            var label = t.$el.find('label');
            var editor = t.$el.find('intput[type="checkbox"]');
            switch (attributeName) {
                //私有属性
                case 'reverse':
                    if (typeof(attributeValue) == 'boolean' && (attributeValue == true || attributeValue == false)) {
                        //设置反转选项
                        __rerender();
                    } else {
                        //reset attribute
                        t.attributes[attributeName] = t.defaultAttributes[attributeName];
                    }
                    break;
                case 'defaultValue':
                    if (attributeValue && typeof(attributeValue) == 'string' && attributeValue.length > 0) {
                        if (attributeValue == 'true') {
                            t.setValue(true);
                        } else if (attributeValue == 'false') {
                            t.setValue(false);
                        }
                    }
                    break;
                case 'title':
                    __rerender();
                    break;
                case 'dataOffTitle':
                    __rerender();
                    break;
                case 'dataOnTitle':
                    __rerender();
                    break;
                case 'dataOffIconClass':
                    __rerender();
                    break;
                case 'dataOnIconClass':
                    __rerender();
                    break;
                case 'dataOfflabel':
                    if (!attributeValue) {
                        editor.attr('data-off-label', 'false');
                    } else {
                        editor.removeAttr('data-off-label');
                    }
                    break;
                case 'dataOnlabel':
                    if (!attributeValue) {
                        editor.attr('data-on-label', 'false');
                    } else {
                        editor.removeAttr('data-on-label');
                    }
                    break;
                case 'dataOffColor':
                    __rerender();
                    break;
                case 'dataOnColor':
                    __rerender();
                    break;
                    //公共属性
                case 'disabled':
                    t.$el.children().remove();
                    t.render();
                    if (attributeValue == 'true' || attributeValue == true) {
                        editor.attr('disabled', '');
                    } else {
                        editor.removeAttr('disabled');
                    }
                    t.initCheckbox();
                    break;
                case 'editorCol':
                    if (attributeValue) {
                        var btnGroup = t.$el.find('.checkbox-container');
                        var btnClass = btnGroup.attr('class');
                        var btnClassArray = btnClass.split(" ");
                        $.each(btnClassArray, function(i, item) {
                            if (item.indexOf('col-sm-')) {
                                btnGroup.removeClass(item);
                            }
                        });
                        btnGroup.addClass('col-sm-' + attributeValue);
                    }
                    break;
                case 'helpLabel':
                    var helpBlock = t.$el.find('.help-block');
                    if (attributeValue) {
                        //如果没有show属性则加上
                        if (!helpBlock.hasClass('show')) {
                            helpBlock.addClass('show');
                        }
                        //如果有隐藏属性则去掉
                        if (helpBlock.hasClass('hidden')) {
                            helpBlock.removeClass('hidden');
                        }
                        helpBlock.html(attributeValue);
                    } else {
                        helpBlock.removeClass('show');
                        helpBlock.addClass('hidden');
                    }
                    break;
                default:
                    return;
            }
        },
        //设置控件值
        setValue: function(value) {
            var t = this;
            if (value != t.$el.find('input').prop('checked')) {
                t.$el.find('input').prop("checked", value).change();
            }
        },
        //获取控件值
        getValue: function() {
            var t = this;
            return t.$el.find('input').prop('checked');
        }
    });
    return CheckboxView;
});