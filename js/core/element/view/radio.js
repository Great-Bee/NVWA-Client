define('js/core/element/view/radio', [

    'js/core/element/view/base_element',
    'js/util/string',
    'js/util/dictionary',
    'text!js/core/element/template/radio.tpl',
    'radio',
    'css!bower_components/iCheck/skins/all'
], function(BaseElementView, StringUtil, Dictionary, RadioTpl, RadioControl) {
    var RadioView = BaseElementView.extend({
        events: {
            'ifChecked input': 'onSelect'
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            this.defaultAttributes = {
                radioColor: 'blue', //radio 的颜色 red blue aero green line pink orange yellow 
                //编辑器宽度**
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //是否禁用**
                disabled: false,
                //PlaceHolder*
                placeholder: null,
                //select data** {text:xxxxx,value:xxxxx}
                selectData: [{
                    text: '选项1',
                    value: '1'
                }, {
                    text: '选项2',
                    value: '2'
                }, {
                    text: '选项3',
                    value: '3'
                }],
                //元素类型
                type: 'checkbox',
                //default
                value: null
            };
            //转换json字符串变成object
            if (attributes.selectData && typeof(attributes.selectData) == 'string') {
                attributes.selectData = StringUtil.jsonStringToObject(attributes.selectData);
            }
            BaseElementView.prototype.initialize.apply(this, arguments);
            t.render();
            t.initRadio();
            setTimeout(t.initDefaultValue(), 100);
        },
        render: function() {
            this.$el.html(tpl(RadioTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        //初始化选择器
        initRadio: function() {
            var t = this;
            var color = t.attributes['radioColor'] || 'blue';
            t.radio = t.$el.find('input').iCheck({
                checkboxClass: 'icheckbox_flat-' + color, //每个风格都对应一个，这个不能写错哈。  
                radioClass: 'iradio_flat-' + color,
            });
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        //init default value
        initDefaultValue: function() {
            var t = this;
            if (t.attributes && t.attributes['value'] && t.attributes['value'].length > 0) {
                t.setValue(t.attributes['value']);
            }
        },
        onSelect: function(e) {
            var t = this;
            var selectEle = $(e.target);
            t.attributes['value'] = selectEle.val();
        },
        supportAttribute: function() {
            return ['radioColor', 'helpLabel', 'disabled', 'selectData', 'value'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['click', 'dblclick', 'mouseover', 'mouseleave', 'select'];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var label = t.$el.find('label');
            var editor = t.$el.find('intput[type="checkbox"]');
            switch (attributeName) {
                //私有属性
                case 'radioColor':
                    if (attributeValue && typeof(attributeValue) == 'string' && attributeValue.length > 0) {
                        if (!Dictionary.RadioColorType[attributeValue]) {
                            t.attributes[attributeName] = t.defaultAttributes.radioColor;
                        }
                        t.render();
                        t.initRadio();
                    }
                    break;
                    //公共属性
                    //setting disable attribute
                case 'disabled':
                    t.render();
                    t.initRadio();
                    break;
                case 'editorCol':
                    if (attributeValue) {
                        var radioContainer = t.$el.find('.radio-container');
                        var radioClass = radioContainer.attr('class');
                        var radioClassArray = radioClass.split(" ");
                        $.each(radioClassArray, function(i, item) {
                            if (item.indexOf('col-sm-')) {
                                radioContainer.removeClass(item);
                            }
                        });
                        radioContainer.addClass('col-sm-' + attributeValue);
                    }
                    break;
                    //setting help label attribute
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
                    //setting select data attribute
                case 'selectData':
                    if (attributeValue && typeof(attributeValue) == 'string' && attributeValue.length > 0) {
                        try {
                            t.attributes.selectData = StringUtil.jsonStringToObject(attributeValue);
                            _log('selectData');
                            _log(t.attributes.selectData);
                            //init render radio
                            //clean $el
                            t.$el.children().remove();
                            //render template
                            t.render();
                            //init radio
                            t.initRadio();
                        } catch (err) {

                        }
                    }
                    break;
                    //setting default value
                case 'value':
                    t.setValue(attributeValue);
                    break;
                default:
                    return;
            }
        },
        setValue: function(value) {
            var t = this;
            t.radio.parent().removeClass('checked');
            t.$el.find('input[value="' + value + '"]').parent().addClass('checked');
            t.attributes['value'] = value;
            // t.render();
            // t.initRadio();
        },
        getValue: function() {
            var t = this;
            return t.attributes['value'];
        }
    });
    return RadioView;
});