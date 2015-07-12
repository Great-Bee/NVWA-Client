define('js/core/element/view/html', [
	'backbone',
	'js/core/element/view/base_element'
], function(Backbone, BaseElementView) {
	var HtmlView = BaseElementView.extend({
		events: {},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			BaseElementView.prototype.initialize.apply(t, arguments);
			this.defaultAttributes = {
				html: null
			}
			this.attributes = $.extend({}, this.defaultClientAttribute, attributes);
			t.render();
		},
		render: function() {
			var t = this;
			var html = this.attributes['html'];
			if (!(html && html.length > 0) && this.editAble) {
				html = "请设置HTML";
			}
			this.$el.html(tpl(html, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			return this;
		},
		supportAttribute: function() {
			return ["html"];
		},
		supportServerAttribute: function() {
			return ['dataField', 'dataValue'];
		},
		supportEventNames: function() {
			return [];
		},
		supportServerEventNames: function() {
			return [];
		},
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			t.attributes[attributeName] = attributeValue;
			t.render();
		},
		setValue: function(value) {
			var t = this;
		},
		getValue: function() {
			var t = this;
			return null;
		}
	});
	return HtmlView;
});