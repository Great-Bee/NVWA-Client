//高级导入控件
define([
		'js/core/element/view/button',
		'js/core/element/view/import',
		'js/core/element/view/downloadImportTemplate',
		'js/util/api/file',
		'achy/widget/ui/message',
		'js/util/ui/view/cover',
		'js/util/ui/view/modal',
	],
	function(ButtonView, ImportBtnView, DownloadImportTemplateBtnView, FileAPI, Message, Cover, Modal) {
		var AdvancedImportBtnView = ButtonView.extend({
			events: {
				'click button': '_click'
			},
			initialize: function(options, eleBean, attributes, eves, editAble) {
				ButtonView.prototype.initialize.apply(this, arguments);
				this._initAdvancedImportBtnView();
			},
			_initAdvancedImportBtnView: function() {
				var t = this;
				if (t.attributes.datasource && typeof(t.attributes.datasource) == 'string') {
					t.attributes.datasource = $nvwa.string.jsonStringToObject(t.attributes.datasource);
				}
			},
			getDatasourceConfig: function() {
				return {
					staticEnble: false,
					dynamicEnble: true,
					dynamicFieldEnble: false
				};
			},
			supportAttribute: function() {
				return ['text', 'datasource'];
			},
			supportServerAttribute: function() {
				return [];
			},
			_click: function(e, data) {
				var t = this;
				if (t.attributes.datasource) {
					var pageAlias = t.attributes.datasource.pageAlias;
					var containerAlias = t.attributes.datasource.containerAlias;
					if (!$nvwa.string.isVerify(pageAlias)) {
						_log('pageAlias error,pageAlias=' + pageAlias);
						t._error('请配置页面的数据源!');
					} else if (!$nvwa.string.isVerify(containerAlias)) {
						_log('containerAlias error,containerAlias=' + containerAlias);
						t._error('请配置容器的数据源!');
					} else {
						//loading
						//弹出高级导入菜单
						t.importModal = [];
						t.importModal.container = $('<div></div>');

						t.importModal.dialog = new Modal({
							title: '导入数据',
							content: t.importModal.container,
							width: '20%'
						});
						$('<div>前两行数据请不要修改</div><div class="importBtn margin-top-l"></div><div class="templateBtn margin-top-l"></div>').appendTo(t.importModal.container);
						t.importBtn = new ImportBtnView({
							el: t.importModal.container.find('.importBtn')
						}, {}, {
							datasource: t.attributes.datasource
						}, {});
						t.templateBtn = new DownloadImportTemplateBtnView({
							el: t.importModal.container.find('.templateBtn')
						}, {}, {
							datasource: t.attributes.datasource,
							text: '下载数据导入模板',
							glyphicon: 'download-alt'
						}, {});
					}
				} else {
					t._error('请配置数据源!');
				}
			},
			getDefaultAttribute: function() {
				return {
					datasource: null,
					text: '导入数据'
				};
			}
		});
		return AdvancedImportBtnView;
	});