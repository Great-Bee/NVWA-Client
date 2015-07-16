define('js/core/element/view/datetime_picker', [
	'js/core/element/view/text',
	'datetimepicker', 'datetimepicker_lang',
	//	'text!bower_components/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css'
], function(TextView) {
	var DatetimePickerView = TextView.extend({
		events: {},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			var addCss = function(cssurl) {
				var link = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				link.href = cssurl;
				document.getElementsByTagName("head")[0].appendChild(link);
			}
			addCss('js/bower_components/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css');

			t.defaultAttributes = t.defaultAttributes || {};
			t.defaultAttributes = $.extend({}, t.defaultAttributes, {
				startDate: null,
				endDate: null,
				dateFormat: 'yyyy-mm-dd hh:ii'
			});
			TextView.prototype.initialize.apply(t, arguments);

			window._log(t.attributes);
			t.$el.find('input').datetimepicker({
				autoclose: true,
				language: 'zh-CN',
				todayHighlight: true,
				todayBtn: true,
				startDate: t.attributes.startDate,
				endDate: t.attributes.endDate,
				format: t.attributes.dateFormat
			});
		},
		supportAttribute: function() {
			var t = this;
			var attrs = TextView.prototype.supportAttribute.apply(t, arguments);
			attrs.push("startDate");
			attrs.push("endDate");
			attrs.push("dateFormat");
			return attrs;
		},
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			TextView.prototype.setAttribute.apply(t, arguments);
			_log('attributeName=' + attributeName + ',attributeValue=' + attributeValue);
			var t = this;
			t.attributes[attributeName] = attributeValue;
			var editor = t.$el.find('input');
			switch (attributeName) {
				case 'startDate':
				case 'endDate':
				case 'dateFormat':
				default:
					return;
			}
		},
		//Get Value
		getValue: function() {
			var t = this;
			var value = TextView.prototype.getValue.apply(t, arguments);
			if (value && value.length > 0) {
				return new Date(value).format("yyyy-MM-dd hh:mm:ss");
			} else {
				return value;
			}
		}
	});
	return DatetimePickerView;
});