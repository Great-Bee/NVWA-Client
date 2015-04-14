define([
	'backbone', 'underscore',
	'js/core/element/view/base_element',
	'text!js/core/element/template/validate_config.html'
], function(Backbone, _, BaseElementView, tpl) {
	var HtmlView = BaseElementView.extend({
		events: {
			"change .type": "_typeChoose",
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			BaseElementView.prototype.initialize.apply(t, arguments);
			this.defaultAttributes = {}
			this.attributes = $.extend({}, this.defaultClientAttribute, attributes);
			t.render();
		},
		render: function() {
			var t = this;
			this.$el.html(_.template(tpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			return this;
		},
		supportAttribute: function() {
			return [];
		},
		supportEventNames: function() {
			return [];
		},
		supportServerEventNames: function() {
			return [];
		},
		_typeChoose: function() {
			var t = this;
			var type = t.$el.find(".type").val();
			if (type == 'number') {
				t.$el.find(".digitContainer").removeClass("hidden");
			} else {
				t.$el.find(".digitContainer").addClass("hidden");
			}
		},

		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			t.attributes[attributeName] = attributeValue;
		},
		setValue: function(value) {
			var t = this;
			t.$el.find(".type").val("");
			t.$el.find(".digit").val("0");
			if (value && typeof value == 'string' && value.length > 0) {
				value = eval("(" + value + ")");
				var type = value['type'];
				t.$el.find(".type").val(type);
				if (type == 'number') {
					t.$el.find(".digit").val(value['digit']);
				}
				t._typeChoose();
			}
		},
		getValue: function() {
			var t = this;
			var type = t.$el.find(".type").val();
			var value = {};
			value['type'] = type;
			if (type == 'number') {
				value['digit'] = t.$el.find(".digit").val();
			}
			return JSON.stringify(value);
		}
	});
	return HtmlView;
});