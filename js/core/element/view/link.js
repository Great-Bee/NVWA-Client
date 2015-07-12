define('js/core/element/view/link', [

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/link.tpl'
], function(BaseElementView, StringUtil, LinkTpl) {
    var LinkView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                text: 'Link', //超链接上显示的文本
                link: '#', //连接到的地方   
                color: 'fff', //颜色
                fontSize: null, //字号
                font: null, //字体
                fontStyle: null, //字体风格
                fontWeight: null, //字体粗细
                textAlign: 'right',
                //元素类型
                type: 'link'
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.initAttr();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this.$el.html(tpl(LinkTpl, {
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
            return ['text', 'link', 'color', 'fontSize', 'font', 'fontStyle', 'fontWeight', 'textAlign'];
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
            var linkEle = t.$el.find('a');
            switch (attributeName) {
                case 'text':
                    if (attributeValue) {
                        linkEle.html(attributeValue);
                    } else {
                        linkEle.html('');
                    }
                    break;
                case 'link':
                    if ($nvwa.string.isVerify(attributeValue)) {
                        linkEle.attr('href', attributeValue);
                    } else {
                        linkEle.attr('href', 'javascript:void(0);');
                    }
                    break;
                case 'color':
                    if (attributeValue.indexOf('#') == 0) {
                        linkEle.css('color', attributeValue);
                    } else {
                        linkEle.css('color', '#' + attributeValue);
                    }
                    break;
                case 'fontSize':
                    linkEle.css('font-size', attributeValue);
                    break;
                case 'font':
                    linkEle.css('font-family', attributeValue);
                    break;
                case 'fontStyle':
                    linkEle.css('font-style', attributeValue);
                    break;
                case 'fontWeight':
                    linkEle.css('font-weight', attributeValue);
                    break;
                case 'textAlign':
                    if ($nvwa.string.isVerify(attributeValue) && attributeValue == $nvwa.dictionary.TextAlignType.Left) {
                        linkEle.parent().css('text-align', $nvwa.dictionary.TextAlignType.Left);
                    } else {
                        linkEle.parent().css('text-align', $nvwa.dictionary.TextAlignType.Right);
                    }
                    break;
                default:
                    return;
            }
        }
    });
    return LinkView;
});