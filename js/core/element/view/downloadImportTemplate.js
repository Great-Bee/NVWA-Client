define('js/core/element/view/downloadImportTemplate', [
		'js/core/element/view/button', 'js/util/api/file', 'js/bower_components/achy/message'
	],
	function(ButtonView, FileAPI, Message) {
		var DownloadImportTemploadBtnView = ButtonView.extend({
			events: {
				'click button': '_click'
			},
			initialize: function(options, eleBean, attributes, eves, editAble) {
				var t = this;
				ButtonView.prototype.initialize.apply(t, arguments);
				t._initDownloadImportTemploadBtnControl();
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
						FileAPI.downloadImportTemplate(pageAlias, containerAlias,
							function(response) {
								if (response && $nvwa.string.isVerify(response.storeName)) {
									_log(response.storeName);
									var downloadTempURL = window.nvwaClientApi.downloadTemp() + '/' + response.storeName;
									t.downloadFile(downloadTempURL);
								}
							},
							function() {
								t._error('下载模板出现异常!');
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
					text: '下载数据导入模板'
				};
			}
		});
		return DownloadImportTemploadBtnView;
	});