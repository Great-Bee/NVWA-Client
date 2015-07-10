define([
    'backbone'
], function(Backbone) {
    var BasePageView = Backbone.View.extend({
        initialize: function(options, pageBean, pageClientAttribute, pageclientEvents, pageElementViews, editAble) {
            var t = this;
            if (t.defaultClientAttribute) {
                pageClientAttribute = $.extend({}, t.defaultClientAttribute, pageClientAttribute);
            }
            t.pageBean = pageBean || {};
            t.pageClientAttribute = pageClientAttribute || {};
            t.pageclientEvents = pageclientEvents || [];
            t.pageElementViews = pageElementViews || [];
            t.editAble = editAble || false;
            t.containerViews = {};
        },
        render: function() {
            return this;
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {},
        //获取属性值
        getAttribute: function(attributeName) {
            return this.pageClientAttribute[attributeName];
        },
        //获取属性对象
        getAttributes: function() {
            return this.pageClientAttribute;
        },
        //获取容器的默认客户端属性
        getDefaultAttribute: function() {
            return {};
        },
        supportAttribute: function() {
            return [];
        },
        supportServerAttribute: function() {
            return ['containerAliasList'];
        },
        supportEventNames: function() {
            return ['click'];
        },
        supportServerEventNames: function() {
            return ['beforeSave', 'afterSave', 'beforeGrid', 'afterGrid', 'beforeDelete', 'afterDelete'];
        },
        //set container view
        setContainer: function(container) {
            var t = this;
            if (t.containerViews) {
                if (container && container.containerBean && $nvwa.string.isVerify(container.containerBean.alias)) {
                    t.containerViews[container.containerBean.alias] = container;
                } else {
                    _log('containers is null');
                }
            } else {
                _log('t.containerViews is not exist');
            }
        },
        //get container view by alias
        getContainer: function(alias) {
            var t = this;
            if (t.containerViews) {
                return t.containerViews[alias];
            } else {
                _log('t.containerViews is not exist');
                return null;
            }
        },
        //get all container view
        getContainers: function() {
            var t = this;
            if (t.containerViews) {
                return t.containerViews;
            } else {
                _log('t.containerViews is not exist');
                return null;
            }
        }
    });
    return BasePageView;
});