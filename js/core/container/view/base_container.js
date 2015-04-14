define([
	'backbone', 'underscore'
], function(Backbone, _) {
	var BaseContainerView = Backbone.View.extend({
		initialize: function(options, containerBean, attributes, eves, elements, elementLayout, editAble) {
			var t = this;
			if (t.defaultClientAttribute) {
				attributes = $.extend({}, t.defaultClientAttribute, attributes);
			}
			t.containerBean = containerBean || {};
			t.attributes = attributes;
			t.eves = eves || [];
			t.elements = elements || [];
			t.elementLayout = elementLayout;
			t.editAble = editAble || false;
		},

		render: function() {
			return this;
		},

		/**
		 * 获取容器对象
		 * @return {Object} 容器对象
		 */
		getContainerBean: function() {
			return this.containerBean;
		},

		setAttribute: function(attributeName, attributeValue) {},
		//获取属性值
		getAttribute: function(attributeName) {
			return this.attributes[attributeName];
		},

		_elementMap: {},
		setElement: function(key, element) {
			this._elementMap[key] = element;
		},
		getElement: function(key) {
			return this._elementMap[key];
		},
		//get all views in this form
		getElements: function() {
			return this._elementMap;
		},

		//Load Data
		loadData: function(condition) {},

		//Read all the elements values
		getData: function() {
			return null;
		},

		//获取属性对象
		getAttributes: function() {
			return this.attributes;
		},
		getDefaultAttribute: function() {
			return {};
		},

		supportAttribute: function() {
			return [];
		},
		supportServerAttribute: function() {
			return [];
		},
		supportEventNames: function() {
			return ['click'];
		},
		supportServerEventNames: function() {
			return ['beforeSave', 'afterSave', 'beforeGrid', 'afterGrid', 'beforeDelete', 'afterDelete'];
		}
	});
	return BaseContainerView;
});