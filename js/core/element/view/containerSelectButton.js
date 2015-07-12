define('js/core/element/view/containerSelectButton', [
	'js/util/string',
	'js/util/ui/view/modal',
	'js/util/api/mc',
	'js/core/element/view/button',
	'js/util/ui/view/containerPaginationSelection'
], function(StringUtil, Modal, MC, ButtonView, ContainerPaginationSelectionView) {
	var ContainerSelectButtonView = ButtonView.extend({
		events: {
			'click button': '_click',
			'selectedContainer': 'onSelect'
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			attributes['text'] = '请选择容器';
			ButtonView.prototype.initialize.apply(this, arguments);
			var t = this;
			t._setWidthToMax();
		},
		_setWidthToMax: function() {
			var t = this;
			t.$el.find('button').css('width', '100%');
		},
		_click: function() {
			var t = this;
			t.selectionView = [];
			t.selectionView.container = $('<div></div>');
			t.selectionView.dialog = new Modal({
				title: '选择容器',
				content: t.selectionView.container
			});
			new ContainerPaginationSelectionView({
				el: t.selectionView.container
			}, {});
			t.selectionView.container.on('selectedContainer', function(e, data) {
				//关闭选择器
				$(t.selectionView.dialog).modal('hide');
				if (data && data.alias) {
					t.setValue(data.alias);
					t.$el.trigger('selectedContainer', [data]);
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
				MC.readContainerByAlias(value, function(data) {
					if (data) {
						if ($nvwa.string.isVerify(data.name)) {
							t.setAttribute('text', data.name);
						} else {
							_log('no name,object=');
							_log(data);
						}
					} else {
						_log('no container object response,alias=' + value);
					}
				});
			} else {
				_log('no value to setValue');
			}
		}
	});
	return ContainerSelectButtonView;
});