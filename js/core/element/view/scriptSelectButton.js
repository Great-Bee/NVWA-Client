define([

	'js/util/string',
	'js/util/ui/view/modal',
	'js/util/api/mc',
	'js/core/element/view/pageSelectButton',
	'js/util/ui/view/scriptPaginationSelection'
], function(StringUtil, Modal, MC, PageSelectButtonView, ScriptPaginationSelection) {
	var ScriptSelectButtonView = PageSelectButtonView.extend({
		events: PageSelectButtonView.prototype.events,
		initialize: function(options, eleBean, attributes, eves, editAble) {
			PageSelectButtonView.prototype.initialize.apply(this, arguments);
		},
		_getButtonText: function() {
			return '请选择脚本';
		},
		_click: function() {
			var t = this;
			var conditions = t.attributes.conditions || [];
			t.selectionView = [];
			t.selectionView.container = $('<div></div>');
			t.selectionView.dialog = new Modal({
				title: '选择脚本',
				content: t.selectionView.container
			});
			new ScriptPaginationSelection({
				el: t.selectionView.container
			}, {
				conditions: conditions
			});
			t.selectionView.container.on('selectedScript', function(e, data) {
				//关闭选择器
				$(t.selectionView.dialog).modal('hide');
				if (data && data.alias) {
					t.$el.trigger('selectedScript', [data]);
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
				MC.readCustomScriptsByAlias(value, function(data) {
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
	return ScriptSelectButtonView;
});