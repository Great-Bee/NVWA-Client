define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/video.html'
], function(_, BaseElementView, StringUtil, Tpl) {
    var ImageView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                src: null, //图片的路径
                width: null, //宽度
                height: null, //高度
                videoConfig: null, //video config
                //元素类型
                type: 'video',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this._initConfig();
            this.$el.html(_.template(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                videoConfig: this.attributes.videoConfig,
                editAble: this.editAble
            }));
            return this;
        },
        _initConfig: function() {
            var t = this;
            if (t.attributes.videoConfig && typeof(t.attributes.videoConfig) == 'string') {
                t.attributes.videoConfig = $nvwa.string.jsonStringToObject(t.attributes.videoConfig);
            }
        },
        supportAttribute: function() {
            return ['src', 'width', 'height', 'videoConfig'];
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
            var videoEle = t.$el.find('video');
            switch (attributeName) {

                default: return;
            }
        }
    });
    return ImageView;
});