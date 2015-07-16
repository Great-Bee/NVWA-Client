define('js/core/element/view/color_picker', [
	'js/util/string',
	'js/core/element/view/text',
	'js/bower_components/colpick/js/colpick',
//	'text!bower_components/colpick/css/colpick.css'
], function(StringUtil, TextView) {
	var ColorPickerView = TextView.extend({
		events: {},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			TextView.prototype.initialize.apply(this, arguments);
			var t = this;
            var addCss = function(cssurl) {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = cssurl;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            addCss('js/bower_components/colpick/css/colpick.css');

			t.$el.find('input').colpick({
				layout: 'hex',
				submit: 0,
				colorScheme: 'dark',
				onChange: function(hsb, hex, rgb, el, bySetColor) {
					if (!bySetColor) {
						$(el).val(hex);
						//Trigger on select color event
						t.$el.trigger('element.color.select', [hex]);
					}
				}
			}).keyup(function() {
				$(this).colpickSetColor(this.value);
			});
		}
	});
	return ColorPickerView;
});