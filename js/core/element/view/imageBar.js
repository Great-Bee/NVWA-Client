define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/imageBar.html'
], function(_, BaseElementView, StringUtil, Tpl) {
    var ImageBarView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                src: null, //图片的路径
                width: null, //宽度
                height: null, //高度
                datasource: null,
                //元素类型
                type: 'image',
            };
            var t = this;

            BaseElementView.prototype.bindEvents.apply(this, arguments);
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.$el.on('afterLoadData', function() {
                t.render();
            });
            this.loadData();
        },
        render: function() {
            this.$el.html(_.template(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble,
                data: this.data
            }));
            this.initControl();
            return this;
        },
        initControl: function() {
            var t = this;
            $('#img-' + t.eleBean.serialNumber).carousel({
                interval: 2000,
                pause: 'hover'
            })
        },
        supportAttribute: function() {
            return ['datasource'];
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
        getDatasourceSchemaList: function() {
            return [{
                name: "图片地址",
                schema: "imageUrl"
            }]
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var navEle = $('#img-' + t.eleBean.serialNumber);
            switch (attributeName) {

                default: return;
            }
        }
    });
    return ImageBarView;
});