define([
		'underscore', 'js/core/element/view/upload', 'js/util/api/file', 'achy/widget/ui/message'
	],
	function(_, UploadView, FileAPI, Message) {
		var ImportView = UploadView.extend({
			events: {},
			initialize: function(options, eleBean, attributes, eves, editAble) {
				var t = this;
				t.defaultAttributes = {
					datasource: null
				};
				UploadView.prototype.initialize.apply(t, arguments);
				t._initImportControl();
			},
			_initImportControl: function() {
				var t = this;
				t.$el.find('.progress').hide();
				t.$el.find('table').hide();
				t.$el.find('.fileinput-button').find('span').html(' 请选择导入的文件');
				t.$el.find('.btn').css('margin-right', '5px');
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
				return ['datasource'];
			},
			supportServerAttribute: function() {
				return [];
			},
			_appendItems: function(data) {
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
					} else if ($nvwa.array.isVerify(data)) {
						$.each(data, function(i, item) {
							//执行导入请求
							FileAPI.importFileData(pageAlias, containerAlias, item.storeName,
								function(response) {
									_log('import success!');
									_log(response);
									if (response && response.success) {
										t._info(response.success + '条记录,导入成功!', 3500);
									}
									if (response && response.error) {
										t._error(response.error + '条记录,导入失败!', 3500);
									}
								},
								function(response) {
									_log('import error!');
									_log(response);
								});
						});
					}
				} else {
					t._error('请配置数据源!');
				}
			}
		});
		return ImportView;
	});