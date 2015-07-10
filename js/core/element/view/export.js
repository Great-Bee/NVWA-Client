define([
		'js/core/element/view/button', 'js/util/api/file', 'achy/widget/ui/message', 'js/util/ui/view/cover',
	],
	function(ButtonView, FileAPI, Message, Cover) {
		var ExportBtnView = ButtonView.extend({
			events: {
				'click button': '_click'
			},
			initialize: function(options, eleBean, attributes, eves, editAble) {
				ButtonView.prototype.initialize.apply(this, arguments);
				this._initDownloadImportTemploadBtnControl();
			},
			_initDownloadImportTemploadBtnControl: function() {
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
				_log('_click');
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
						var cover = new Cover({
							el: $(document.body)
						}, {
							text: '正在导出......'
						});
						cover.show();
						FileAPI.exportFileData(pageAlias, containerAlias,
							function(response) {
								cover.hiden();
								if (response && $nvwa.string.isVerify(response.storeName)) {
									_log(response.storeName);
									var downloadTempURL = window.nvwaClientApi.downloadTemp() + '/' + response.storeName;
									t.downloadFile(downloadTempURL);
								}
							},
							function() {
								cover.hiden();
								t._error('导出数据出现异常!');
							});
					}
				} else {
					t._error('请配置数据源!');
				}
			},
			downloadFile: function(url) {
				try {
					var elemIF = document.createElement("iframe");
					elemIF.src = url;
					elemIF.style.display = "none";
					document.body.appendChild(elemIF);
				} catch (e) {

				}
			},
			getDefaultAttribute: function() {
				return {
					datasource: null,
					text: '导出数据'
				};
			}
		});
		return ExportBtnView;
	});