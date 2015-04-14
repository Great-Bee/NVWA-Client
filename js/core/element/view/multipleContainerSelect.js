define([
	'underscore',
	'js/util/string',
	'js/util/ui/view/modal',
	'js/util/api/mc',
	'js/core/element/view/containerSelectButton',
	'text!js/core/element/template/multipleContainerSelect.html',
	'text!js/core/element/template/multipleContainerSelectRow.html'
], function(_, StringUtil, Modal, MC, ContainerSelectButtonView, MultipleContainerSelectTpl, MultipleContainerSelectRowTpl) {
	var MultipleContainerSelectView = ContainerSelectButtonView.extend({
		events: $.extend(ContainerSelectButtonView.prototype.events, {
			'click .btn-remove': '_delete',
			'selectedContainer': 'onChange',
			'click [debug="setValue"]': '_debugSet',
			'click [debug="getValue"]': '_debugGet',
		}),
		initialize: function(options, eleBean, attributes, eves, editAble) {
			// attributes['size'] = '';
			ContainerSelectButtonView.prototype.initialize.apply(this, arguments);
		},
		_render: function() {
			var t = this;
			$(_.template(MultipleContainerSelectTpl, {
				eleBean: t.eleBean,
				attributes: t.attributes,
				editAble: t.editAble
			})).appendTo(t.$el);
			return t;
		},
		afterRender: function() {
			var t = this;
			t._render();
		},
		_delete: function(e) {
			var t = this;
			var target = $(e.target).parent().parent();
			target.remove();
			t.onChange();
		},
		_append: function(alias) {
			var t = this;
			var body = t.$el.find('tbody');
			var tr = t.$el.find('tbody').find('tr') || [];
			var index = tr.length;
			$(_.template(MultipleContainerSelectRowTpl, {
				alias: alias
			})).appendTo(body);
		},
		getValue: function() {
			var t = this;
			var valueBodys = t.$el.find('td[value]');
			var values = [];
			$.each(valueBodys, function(i, item) {
				values.push($(item).attr('value'));
			});
			return values.join(',');
		},
		setValue: function(value) {
			var t = this;
			if (value) {
				var v = value.split(',');
				if (v) {
					$.each(v, function(i, item) {
						t._append(item);
					});
				} else {
					_log('no v');
				}
			} else {
				_log('no value to set');
			}
		},
		_debugSet: function() {
			var t = this;
			_log(t.setValue('123,345,asdfasd,df,asd,fasdf,asd,fasd,asdf'));
		},
		_debugGet: function() {
			_log(this.getValue());
		},
		onChange: function() {
			var t = this;
			t.$el.trigger('containerSelectedChange');
		}
	});
	return MultipleContainerSelectView;
});