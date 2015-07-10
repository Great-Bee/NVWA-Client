define([
	'backbone', 'js/core/element/view/text',
	'tags_input',
	'css!bower_components/bootstrap-tagsinput/build/bootstrap-tagsinput'
], function(Backbone, TextView) {
	var TagsView = TextView.extend({
		events: {},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;
			TextView.prototype.initialize.apply(t, arguments);
			t.$el.find("input").tagsinput();
		},
		supportAttribute: function() {
			return ['helpLabel', 'placeholder', 'feedback', 'validateConfig'];
		}
	});
	return TagsView;
});