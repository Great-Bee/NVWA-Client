define([

	'js/core/element/view/base_element',
	'text!js/core/element/template/videoConfig.tpl',
	'js/core/element/view/text',
	'js/core/element/view/checkbox'
], function(BaseElementView, Tpl, TextView, CheckBoxView) {
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
			this.$el.html(tpl(Tpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			return this;
		},
		initControl: function() {
			var t = this;
			var autoplayEl = t.$el.find('.autoplayContainer');
			var controlsEl = t.$el.find('.controlsContainer');
			var loopEl = t.$el.find('.loopContainer');

			t.autoplay = new CheckBoxView({
				el: autoplayEl
			}, {}, {});
			t.controls = new CheckBoxView({
				el: controlsEl
			}, {}, {});
			t.loop = new CheckBoxView({
				el: loopEl
			}, {}, {});

		},
		setValue: function(value) {
			var t = this;
			value = value || '{}';
			if ($nvwa.string.isVerify(value)) {
				var config = $nvwa.string.jsonStringToObject(value);
				if (config) {
					if (config.autoplay) {
						if (t.autoplay && t.autoplay.setValue) {
							t.autoplay.setValue(config.autoplay);
						}
					}
					if (config.controls) {
						if (t.controls && t.controls.setValue) {
							t.controls.setValue(config.controls);
						}
					}
					if (config.loop) {
						if (t.loop && t.loop.setValue) {
							t.loop.setValue(config.loop);
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
			if (t.autoplay && t.controls && t.loop) {
				var config = $nvwa.string.objectToJsonString({
					autoplay: t.autoplay.getValue(),
					controls: t.controls.getValue(),
					loop: t.loop.getValue(),
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