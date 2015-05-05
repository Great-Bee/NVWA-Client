//普通按钮
define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/selectButton.html'
], function(_, BaseElementView, StringUtil, ButtonTpl) {

    var ButtonView = BaseElementView.extend({
        events: {},
        //初始化
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                text: '下拉按钮', //按钮上的文本
                glyphicon: null, //按钮上的图标
                size: '', //按钮的尺寸，对应 lg,sm,xs
                //元素类型
                type: 'button',
                //Feedback
                feedback: null
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        //渲染
        render: function() {
            this._buildData();
            this.$el.html(_.template(ButtonTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble,
                data : this.data
            }));
            this.afterRender();
            return this;
        },
        //构造data
        _buildData: function(){
            var t = this;
            if(t.attributes.datasource){
                var datasourceObject = eval('('+t.attributes.datasource+')');
                if(datasourceObject.datasource == 'static'){
                    t.data = datasourceObject.data;
                }else{
                    t.data = datasourceObject.schema;
                }
            }
        },
        //支持的客户端属性
        supportAttribute: function() {
            return ['text', 'size','datasource'];
        },
        //支持的客户端事件
        supportEventNames: function() {
            return ['click', 'dblclick', 'mouseover', 'mouseleave'];
        },
        //支持的服务器事件
        supportServerEventNames: function() {
            return [];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            switch (attributeName) {
                case 'text':
                    if (attributeValue && attributeValue.length > 0) {
                        if (t.$el.find('b').hasClass('hidden')) {
                            t.$el.find('b').removeClass('hidden');
                        }
                        t.$el.find('b').html(attributeValue);
                    } else {
                        // t.$el.find('b').addClass('hidden');
                    }
                    break;
                case 'size':
                    var btnEle = t.$el.find('button');
                    var btnClass = btnEle.attr('class');
                    btnEle.removeClass('btn-sm');
                    btnEle.removeClass('btn-xs');
                    btnEle.removeClass('btn-lg');
                    if ($nvwa.string.isVerify(attributeValue)) {
                        btnEle.addClass('btn-' + attributeValue);
                    }
                    break;
                case 'datasource':
                    break;
                default:
                    return;
            }
        }
    });
    return ButtonView;
});