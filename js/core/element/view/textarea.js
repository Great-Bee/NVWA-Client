define([

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/textarea.tpl'
], function(BaseElementView, StringUtil, TextAreaTpl) {
    var TextAreaView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
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
                //PlaceHolder
                placeholder: null,
                //元素类型
                type: 'textarea',
                //Feedback
                feedback: null
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this.$el.html(tpl(TextAreaTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        supportAttribute: function() {
            return ['helpLabel', 'readonly', 'placeholder', 'feedback'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['keyup', 'keydown', 'keypress'];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var label = t.$el.find('label');
            var editor = t.$el.find('textarea');
            switch (attributeName) {
                case 'label':
                    label.html(attributeValue);
                    break;
                case 'showLabel':
                    if (attributeValue) {
                        label.removeClass('sr-only');
                    } else {
                        label.addClass('sr-only');
                    }
                    break;
                case 'labelCol':
                    var labelClass = label.attr('class');
                    var labelClassArray = labelClass.split(" ");
                    $.each(labelClassArray, function(i, item) {
                        if (item.indexOf('col-sm-')) {
                            label.removeClass(item);
                            label.addClass('col-sm-' + attributeValue);
                        }
                    });
                    break;
                case 'editorCol':
                    var editorClass = editor.attr('class');
                    var editorClassArray = labelClass.split(" ");
                    $.each(editorClassArray, function(i, item) {
                        if (item.indexOf('col-sm-')) {
                            editor.removeClass(item);
                            editor.addClass('col-sm-' + attributeValue);
                        }
                    });
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
                case 'readonly':
                    if (attributeValue) {
                        editor.attr('readonly', 'readonly');
                    } else {
                        editor.removeAttr('readonly');
                    }
                    break;
                case 'placeholder':
                    if (attributeValue) {
                        editor.attr('placeholder', attributeValue);
                    } else {
                        editor.removeAttr('placeholder');
                    }
                    break;
                case 'feedback':
                    if (attributeValue) {
                        t.$el.find('span').attr('class', 'glyphicon form-control-feedback glyphicon-' + attributeValue);
                        t.$el.find('span').removeClass('hidden');
                        t.$el.find('span').addClass('show');
                    } else {
                        t.$el.find('span').removeClass('show');
                        t.$el.find('span').addClass('hidden');
                    }
                    break;
                default:
                    return;
            }
        },
        setValue: function(value) {
            var t = this;
            t.$el.find('textarea').val(value);
        },
        getValue: function() {
            var t = this;
            return t.$el.find('textarea').val();
        }
    });
    return TextAreaView;
});