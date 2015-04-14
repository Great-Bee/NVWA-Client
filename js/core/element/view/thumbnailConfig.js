define([
	'underscore',
	'js/core/element/view/base_element',
	'text!js/core/element/template/thumbnailConfig.html',
	'js/core/element/view/text',
	'js/core/element/view/select',
], function(_, BaseElementView, Tpl, TextView, SelectView) {
	var VideoConfigView = BaseElementView.extend({
		events: {
			"click .debug": "debug",
			"change": "onChange"
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
			var columnWidthEl = t.$el.find('.columnWidthContainer');
			var columnGapValueEl = t.$el.find('.columnGapValueContainer');
			//列间距空隙
			t.columnGapValue = new TextView({
				el: columnGapValueEl
			}, {}, {
				placeholder: '间距(像素)'
			});
			//列宽度
			t.columnWidth = new SelectView({
				el: columnWidthEl
			}, {}, {});
			var selectData = [];
			//造选项数据
			for (var i = 1; i < 13; i++) {
				selectData.push({
					text: i + '格宽度',
					value: i
				});
			}
			//append
			t.columnWidth.appendItems(selectData);
			//init events		
			columnGapValueEl.on('keyup', function(e) {
				t.$el.trigger('change');
			})
		},
		setValue: function(value) {
			var t = this;
			value = value || '{}';
			if ($nvwa.string.isVerify(value)) {
				var config = $nvwa.string.jsonStringToObject(value);
				if (config) {
					if (config.columnGapValue) {
						if (t.columnGapValue && t.columnGapValue.setValue) {
							t.columnGapValue.setValue(config.columnGapValue);
						}
					}
					if (config.columnWidth) {
						if (t.columnWidth && t.columnWidth.setValue) {
							t.columnWidth.setValue(config.columnWidth);
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
			if (t.columnWidth && t.columnGapValue) {
				var config = $nvwa.string.objectToJsonString({
					columnWidth: t.columnWidth.getValue(),
					columnGapValue: t.columnGapValue.getValue()
				});
				return config;
			} else {
				_log('no view');
				return null;
			}
		},
		onChange: function() {
			_log('change');
		},
		//debug
		debug: function() {
			var t = this;
			var v = t.getValue();
			_log(v);
		}
	});
	return VideoConfigView;
});