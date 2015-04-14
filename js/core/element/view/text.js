define([
	'underscore',
	'js/core/element/view/base_element',
	'text!js/core/element/template/text.html'
], function(_, BaseElementView, TextTpl) {
	var TextView = BaseElementView.extend({
		events: {},
		initialize: function(options, eleBean, attributes, eves, editAble) {

			this.defaultAttributes = this.defaultAttributes || {};
			this.defaultAttributes = $.extend({}, this.defaultAttributes, {
				//帮助文案
				helpLabel: null,
				//前缀
				prefix: null,
				//是否禁用
				disabled: false,
				//是否只读
				readonly: false,
				//表单大小
				size: null,
				//PlaceHolder
				placeholder: null,
				//元素类型
				type: 'text',
				//Feedback
				feedback: null,
				//Validate Config
				validateConfig: null
			});
			BaseElementView.prototype.initialize.apply(this, arguments);
			attributes = $.extend({}, this.defaultAttributes, attributes);
			this.attributes = attributes;
			this.render();
			BaseElementView.prototype.bindEvents.apply(this, arguments);
		},
		//Valid Events
		_validEvents: function() {
			var t = this;
			var validateConfig = t.attributes['validateConfig'];
			if (validateConfig && typeof validateConfig == 'string' && validateConfig.length > 0) {
				var inputEl = t.$el.find("input");
				validateConfig = eval("(" + validateConfig + ")");
				var type = validateConfig['type'];
				if (type == 'number') {
					inputEl.on("blur", function() {
						if (!$nvwa.string.isNumber(inputEl.val())) {
							inputEl.val("");
						} else {
							var number = parseFloat(inputEl.val());
							number = number.toFixed(validateConfig['digit'] || 0);
							inputEl.val(number);
						}
					}).on("keyup", function(e) {
						//TODO
					});
				} else if (type == 'url') {
					inputEl.on("blur", function() {
						if (!$nvwa.string.isUrl(inputEl.val())) {
							inputEl.val("http://");
						}
					});
				} else if (type == 'email') {
					inputEl.on("blur", function() {
						if (!$nvwa.string.isEmail(inputEl.val())) {
							inputEl.val("");
						}
					});
				}
			}
		},
		render: function() {
			var t = this;
			this.$el.html(_.template(TextTpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			t._validEvents();
			return this;
		},
		supportAttribute: function() {
			return ['helpLabel', 'readonly', 'placeholder', 'feedback', 'validateConfig'];
		},
		supportServerAttribute: function() {
			return ['dataField', 'dataValue'];
		},
		supportEventNames: function() {
			return ['keyup', 'keydown', 'keypress'];
		},
		supportServerEventNames: function() {
			return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
		},
		getDefaultAttribute: function() {
			return this.defaultAttributes;
		},
		//设置属性
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			t.attributes[attributeName] = attributeValue;
			var editor = t.$el.find('input');
			switch (attributeName) {
				case 'helpLabel':
					var helpBlock = t.$el.find('.help-block');
					if (attributeValue) {
						//如果没有show属性则加上
						if (!helpBlock.hasClass('show')) {
							helpBlock.addClass('show');
						}
						//如果有隐藏属性则去掉
						if (helpBlock.hasClass('hidden')) {
							helpBlock.removeClass('hidden');
						}
						helpBlock.html(attributeValue);
					} else {
						helpBlock.removeClass('show');
						helpBlock.addClass('hidden');
					}
					break;
				case 'disabled':
					if (attributeValue) {
						editor.addClass('disabled');
					} else {
						editor.removeClass('disabled');
					}
					break;
				case 'readonly':
					if (attributeValue) {
						editor.attr('readonly', 'readonly');
					} else {
						editor.removeAttr('readonly');
					}
					break;
				case 'placeholder':
					if (attributeValue) {
						editor.attr('placeholder', attributeValue);
					} else {
						editor.removeAttr('placeholder');
					}
					break;
				case 'feedback':
					if (attributeValue) {
						t.$el.find('span').attr('class', 'glyphicon form-control-feedback glyphicon-' + attributeValue);
						t.$el.find('span').removeClass('hidden');
						t.$el.find('span').addClass('show');
					} else {
						t.$el.find('span').removeClass('show');
						t.$el.find('span').addClass('hidden');
					}
					break;
				default:
					return;
			}
		},

		setValue: function(value) {
			var t = this;
			t.$el.find('input').val(value);
		},
		getValue: function() {
			var t = this;
			return t.$el.find('input').val();
		},
		isValid: function() {
			var t = this;
			var validateConfig = t.attributes['validateConfig'];
			var value = t.$el.find("input").val();
			if (validateConfig && typeof validateConfig == 'string' && validateConfig.length > 0 && value && value.length > 0) {
				validateConfig = eval("(" + validateConfig + ")");
				var type = validateConfig['type'];
				if (type == 'number') {
					return $nvwa.string.isNumber(value);
				} else if (type == 'url') {
					return $nvwa.string.isUrl(value);
				} else if (type == 'email') {
					return $nvwa.string.isEmail(value);
				}
			}
			return true;
		}
	});
	return TextView;
});