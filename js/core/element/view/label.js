define('js/core/element/view/label', [

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/label.tpl'
], function(BaseElementView, StringUtil, LabelTpl) {
    var LabelView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                text: 'Label', //文本
                color: 'fff', //颜色
                bgColor: null, //背景颜色 default primary success info warning danger
                fontSize: null, //字号
                font: null, //字体
                fontStyle: null, //字体风格
                fontWeight: null, //字体粗细
                textAlign: 'right',
                //元素类型
                type: 'label',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.initAttr();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this.$el.html(tpl(LabelTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        initAttr: function() {
            var t = this;
            t.setAttribute('textAlign', t.attributes['textAlign']);
        },
        supportAttribute: function() {
            return ['text', 'color', 'bgColor', 'fontSize', 'font', 'fontStyle', 'fontWeight', 'textAlign'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['click', 'dblclick', 'mouseover', 'mouseleave'];
        },
        supportServerEventNames: function() {
            return [];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var spanEle = t.$el.find('span');
            switch (attributeName) {
                case 'text':
                    if (attributeValue) {
                        spanEle.html(attributeValue);
                    } else {
                        spanEle.html('');
                    }
                    break;
                case 'color':
                    if ($nvwa.string.isVerify(attributeValue)) {
                        if (attributeValue.indexOf('#') == 0) {
                            spanEle.css('color', attributeValue);
                        } else {
                            spanEle.css('color', '#' + attributeValue);
                        }
                    }
                    break;
                case 'bgColor':
                    if ($nvwa.string.isVerify(attributeValue)) {
                        if (attributeValue.indexOf('#') == 0) {
                            spanEle.css('background-color', attributeValue);
                        } else {
                            spanEle.css('background-color', '#' + attributeValue);
                        }
                    }
                    break;
                case 'fontSize':
                    spanEle.css('font-size', attributeValue);
                    break;
                case 'font':
                    spanEle.css('font-family', attributeValue);
                    break;
                case 'fontStyle':
                    spanEle.css('font-style', attributeValue);
                    break;
                case 'fontWeight':
                    spanEle.css('font-weight', attributeValue);
                    break;
                case 'textAlign':
                    if ($nvwa.string.isVerify(attributeValue) && attributeValue == $nvwa.dictionary.TextAlignType.Left) {
                        spanEle.parent().css('text-align', $nvwa.dictionary.TextAlignType.Left);
                    } else {
                        spanEle.parent().css('text-align', $nvwa.dictionary.TextAlignType.Right);
                    }
                    break;
                default:
                    return;
            }
        },
    });
    return LabelView;
});