define('js/core/element/view/tags', [
	'backbone', 'js/core/element/view/text',
	'tags_input',
	//'text!bower_components/bootstrap-tagsinput/build/bootstrap-tagsinput.css'
], function(Backbone, TextView) {
	var TagsView = TextView.extend({
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
            addCss('js/bower_components/bootstrap-tagsinput/build/bootstrap-tagsinput.css');
			TextView.prototype.initialize.apply(t, arguments);
			t.$el.find("input").tagsinput();
		},
		supportAttribute: function() {
			return ['helpLabel', 'placeholder', 'feedback', 'validateConfig'];
		}
	});
	return TagsView;
});