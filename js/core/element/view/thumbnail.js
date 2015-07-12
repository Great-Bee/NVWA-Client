define('js/core/element/view/thumbnail', [

    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/thumbnail.tpl'
], function(BaseElementView, StringUtil, Tpl) {
    var ThumbnailView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                src: null, //图片的路径
                width: null, //宽度
                height: null, //高度
                datasource: null,
                thumbnailConfig: null,
                //元素类型
                type: 'text',
            };
            var t = this;
            BaseElementView.prototype.initialize.apply(this, arguments);
            BaseElementView.prototype.bindEvents.apply(this, arguments);
            this.$el.on('afterLoadData', function() {
                t.render();
            });
            this.loadData();
            // t.render();
        },
        render: function() {
            this._initConfig();
            this.$el.html(tpl(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble,
                data: this.data,
                thumbnailConfig: this.attributes.thumbnailConfig
            }));
            return this;
        },
        _initConfig: function() {
            var t = this;
            if (t.attributes.thumbnailConfig && typeof(t.attributes.thumbnailConfig) == 'string') {
                t.attributes.thumbnailConfig = $nvwa.string.jsonStringToObject(t.attributes.thumbnailConfig);
            }
        },
        supportAttribute: function() {
            return ['datasource', 'thumbnailConfig'];
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
            }, {
                name: "标题",
                schema: "title"
            }, {
                name: "内容",
                schema: "content"
            }]
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;

            switch (attributeName) {

                default: return;
            }
        }
    });
    return ThumbnailView;
});