define([
	'underscore',
	'js/util/string',
	'js/util/ui/view/modal',
	'js/util/api/mc',
	'js/core/element/view/button',
	'js/util/ui/view/pagePaginationSelection'
], function(_, StringUtil, Modal, MC, ButtonView, PagePaginationSelectionView) {
	var PageSelectButtonView = ButtonView.extend({
		events: {
			'click button': '_click',
			'selectedPage': 'onSelect'
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			attributes['text'] = this._getButtonText();
			ButtonView.prototype.initialize.apply(this, arguments);
			var t = this;
			t._setWidthToMax();
		},
		_setWidthToMax: function() {
			var t = this;
			t.$el.find('button').css('width', '100%');
		},
		_getButtonText: function() {
			return '请选择页面';
		},
		_click: function() {
			var t = this;
			t.selectionView = [];
			t.selectionView.container = $('<div></div>');
			t.selectionView.dialog = new Modal({
				title: '选择页面',
				content: t.selectionView.container
			});
			new PagePaginationSelectionView({
				el: t.selectionView.container
			}, {});
			t.selectionView.container.on('selectedPage', function(e, data) {
				//关闭选择器
				$(t.selectionView.dialog).modal('hide');
				if (data && data.alias) {
					t.$el.trigger('selectedPage', [data]);
					t.setValue(data.alias);
				} else {
					_log('no select data!');
				}
			});
		},
		supportAttribute: function() {
			return [];
		},
		//support server attribute
		supportServerAttribute: function() {
			return ['dataField', 'dataValue'];
		},
		onSelect: function(e, data) {
			_log('select page object');
			_log(data);
		},
		getValue: function() {
			return this.value;
		},
		setValue: function(value) {
			var t = this;
			this.value = value;
			if ($nvwa.string.isVerify(value)) {
				MC.readPageByAlias(value, function(data) {
					if (data) {
						if ($nvwa.string.isVerify(data.name)) {
							t.setAttribute('text', data.name);
						} else {
							_log('no name,object=');
							_log(data);
						}
					} else {
						_log('no page object response,alias=' + value);
					}
				});
			} else {
				_log('no value to setValue');
			}
		}
	});
	return PageSelectButtonView;
});