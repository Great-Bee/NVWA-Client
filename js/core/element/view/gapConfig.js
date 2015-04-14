define([
	'underscore',
	'js/core/element/view/base_element',
	'text!js/core/element/template/gapConfig.html',
	'js/core/element/view/text'
], function(_, BaseElementView, Tpl, TextView) {
	var GapConfigView = BaseElementView.extend({
		events: {
			"click .debug": "debug"
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			this.defaultAttributes = this.defaultAttributes || {};
			this.defaultAttributes = $.extend({}, this.defaultAttributes, {
				//是否禁用
				disabled: false,
				//是否只读
				readonly: false,
				//元素类型
				type: 'config'
			});
			BaseElementView.prototype.initialize.apply(this, arguments);
			attributes = $.extend({}, this.defaultAttributes, attributes);
			this.attributes = attributes;
			this.render();
			this.initControl();
			BaseElementView.prototype.bindEvents.apply(this, arguments);
		},
		render: function() {
			this.$el.html(_.template(Tpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			return this;
		},
		initControl: function() {
			var t = this;
			var columnGapEl = t.$el.find('.columnGapValue');
			var rowGapEl = t.$el.find('.rowGapValue');
			t.columnGapView = new TextView({
				el: columnGapEl
			}, {}, {
				placeholder: '列间距'
			});

			t.rowGapView = new TextView({
				el: rowGapEl
			}, {}, {
				placeholder: '行间距'
			});
		},
		supportEventNames: function() {
			return ['keyup', 'keydown', 'keypress'];
		},
		supportServerEventNames: function() {
			return [];
		},
		setValue: function(value) {
			var t = this;
			value = value || '{}';
			if ($nvwa.string.isVerify(value)) {
				var config = $nvwa.string.jsonStringToObject(value);
				if (config) {
					if (config.rowGap) {
						if (t.rowGapView && t.rowGapView.setValue) {
							t.rowGapView.setValue(config.rowGap);
						}
					}
					if (config.columnGap) {
						if (t.columnGapView && t.columnGapView.setValue) {
							t.columnGapView.setValue(config.columnGap);
						}
					}
				} else {
					_log('no config');
				}
			} else {
				_log('no value');
			}
		},
		getValue: function() {
			var t = this;
			if (t.columnGapView && t.rowGapView) {
				var columnGap = t.columnGapView.getValue();
				var rowGap = t.rowGapView.getValue();
				var config = $nvwa.string.objectToJsonString({
					columnGap: columnGap,
					rowGap: rowGap
				});
				return config;
			} else {
				_log('no view');
				return null;
			}
		},
		//debug
		debug: function() {
			var t = this;
			var value = t.getValue();
			_log('getValue');
			_log(value);
		}
	});
	return GapConfigView;
});