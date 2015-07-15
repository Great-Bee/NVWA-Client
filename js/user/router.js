/**
 * Router for User
 * Date:2015-01-28
 */
define('js/user/router', [
	"js/user/view/user"
], function(UserLayoutView) {
	var Router = Backbone.Router.extend({
		routes: {
			//User home page
			"": "index",
			"index": "index",
			"login": "userLogin",
			"page/view/:id": "viewPageLayout",
			"error": "error"
		},

		//initialize
		initialize: function() {},

		//initialize
		_init: function() {
			this.layout_view = new UserLayoutView({
				el: document.body
			});

			this.layout_view.render();
		},

		//index
		index: function() {
			this._init();
		},

		//login
		userLogin: function() {
			requirejs(["js/user/view/entrance"], function(EntranceView) {
				var entranceView = new EntranceView({
					el: document.body
				});
				entranceView.render();
			});
		},
		viewPageLayout: function(pageAlias) {
			var t = this;
			t._init();
			_log(pageAlias);
			var container = $(".container");
			requirejs(["js/user/view/viewPage"], function(ViewPageLayoutView) {
				var viewPageLayoutView = new ViewPageLayoutView({
					el: container,
					routes: t
				}, {
					pageAlias: pageAlias
				});
				t.layout_view.setBarActive('page');
			});
		},

		//error page
		error: function() {
			requirejs(["js/user/view/error"], function(ErrorView) {
				var errorView = new ErrorView({
					el: document.body
				})
				errorView.render();
			});

		}
	});

	return Router;
});