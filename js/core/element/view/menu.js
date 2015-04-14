define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/menu.html'
], function(_, BaseElementView, StringUtil, Tpl) {
    var MenuView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                src: null, //图片的路径
                width: null, //宽度
                height: null, //高度
                datasource: null,
                //元素类型
                type: 'video',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            var t = this;
            this.$el.on('afterLoadData', function() {
                t.render();
            });
            this.loadData();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            this.$el.html(_.template(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble,
                data: this.data
            }));
            return this;
        },
        //解析数据源
        loadItem: function(item) {
            if (item && $nvwa.string.isVerify(item.isActive) && item.isActive == 'true') {
                item['isActive'] = true;
            } else {
                item['isActive'] = false;
            }
            return item;
        },
        supportAttribute: function() {
            return ['title', 'link', 'datasource'];
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
                name: "标题",
                schema: "title"
            }, {
                name: "链接",
                schema: "link"
            }, {
                name: "是否激活",
                schema: "isActive"
            }]
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var navEle = t.$el.find('nav');
            switch (attributeName) {

                default: return;
            }
        }
    });
    return MenuView;
});