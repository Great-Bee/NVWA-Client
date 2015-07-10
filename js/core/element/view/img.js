define([

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/img.tpl'
], function(BaseElementView, StringUtil, ImageTpl) {
    var ImageView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                src: null, //图片的路径
                alt: null, //alt文字内容
                width: null, //宽度
                height: null, //高度
                //元素类型
                type: 'image',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this.$el.html(tpl(ImageTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        supportAttribute: function() {
            return ['src', 'alt', 'width', 'height'];
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
            var imgEle = t.$el.find('img');
            switch (attributeName) {
                case 'src':
                    if (attributeValue) {
                        imgEle.attr('src', attributeValue);
                    } else {
                        imgEle.removeAttr('src');
                    }
                    break;
                case 'alt':
                    if (attributeValue) {
                        imgEle.attr('alt', attributeValue);
                    } else {
                        imgEle.removeAttr('alt');
                    }
                    break;
                case 'width':
                    if (attributeValue) {
                        imgEle.attr('width', attributeValue);
                    } else {
                        imgEle.removeAttr('width');
                    }
                    break;
                case 'height':
                    if (attributeValue) {
                        imgEle.attr('height', attributeValue);
                    } else {
                        imgEle.removeAttr('height');
                    }
                    break;
                default:
                    return;
            }
        }
    });
    return ImageView;
});