define([
	'backbone', 'underscore',
	'js/util/string',
	'js/core/element/view/base_element',
	'text!js/core/element/template/namevaluepair.html'
], function(Backbone, _, StringUtil, BaseElementView, NamevaluepairTpl) {
	var NamevaluepairView = BaseElementView.extend({
		events: {
			"click .add": "_add",
			"click .remove": "_remove",
			"click .up": "_up",
			"click .down": "_down"
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			BaseElementView.prototype.initialize.apply(t, arguments);
			t.render();
			t._add();
		},

		_add: function(eve, name, value) {
			var t = this;
			var afterRow = null;
			if (eve) {
				afterRow = $(eve.currentTarget).parent().parent();
			}

			var rowHtml = [];
			rowHtml.push('<tr>');
			rowHtml.push('<td><input type="text" class="form-control input-sm"/></td>');
			rowHtml.push('<td><input type="text" class="form-control input-sm"/></td>');
			rowHtml.push('<td>');
			rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-plus add"></a>');
			rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-minus remove"></a>');
			// rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-hand-up up"></a>');
			// rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-hand-down down"></a>');
			rowHtml.push('</td>');
			rowHtml.push('</tr>');

			var targetRow = null;
			if (afterRow) {
				targetRow = afterRow.after(rowHtml.join(''));
			} else {
				targetRow = $(rowHtml.join('')).appendTo(t.$el.find("tbody"));
			}

			if (name) {
				$($(targetRow).find("input").eq(0)).val(name);
			}
			if (value) {
				$($(targetRow).find("input")).eq(1).val(value);
			}
		},
		_remove: function(eve) {
			var t = this;
			if (eve) {
				var num = t.$el.find("tbody").find("tr").length;
				if (num > 1) {
					var currentTarget = $(eve.currentTarget);
					currentTarget.parent().parent().remove();
				} else {
					alert('不能删除');
				}
			}
		},
		_up: function() {},
		_down: function() {},

		render: function() {
			var t = this;
			this.$el.html(_.template(NamevaluepairTpl, {
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
			return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
		},
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			t.attributes[attributeName] = attributeValue;
		},
		setValue: function(value) {
			var t = this;
			t.$el.find("tbody").empty();
			if (value && value.length > 0) {
				try {
					var list = eval(value) || [];
					if (list.length > 0) {
						$.each(list, function(i, obj) {
							t._add(null, obj['name'], obj['value']);
						});
					}
				} catch (e) {
					_log(e);
				}
			}
		},
		getValue: function() {
			var t = this;
			var values = [];
			var rows = t.$el.find("tbody").find("tr");
			$.each(rows, function(i, row) {
				var inputs = $(row).find("input");
				var name = $(inputs[0]).val();
				var value = $(inputs[1]).val();
				if ((name && name.length > 0) || (value && value.length > 0)) {
					values.push({
						name: name,
						value: value
					});
				}
			});
			return JSON.stringify(values);
		}
	});
	return NamevaluepairView;
});