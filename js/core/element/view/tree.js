define('js/core/element/view/tree', [

	'js/core/element/view/base_element',
	'text!js/core/element/template/tree.tpl',
	'js/core/module/nvwaUser',
	'js/bower_components/bootstrap-treeview/src/js/bootstrap-treeview',
//	'text!bower_components/bootstrap-treeview/src/css/bootstrap-treeview.css'
], function(BaseElementView, TreeTpl, NvwaUserAPI, TreeGridView) {
	var TreeView = BaseElementView.extend({
		events: {
			'afterLoadData': 'render'
		},
		initialize: function(options, eleBean, attributes, eves, editAble) {
			this.defaultAttributes = {
				//元素类型
				type: 'tree',
				datasource: null,
				title: null,
				color: '#428bca',
				bgColor: '#ffcb2f'
			};
            var addCss = function(cssurl) {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = cssurl;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            addCss('js/bower_components/bootstrap-treeview/src/css/bootstrap-treeview.css');
			BaseElementView.prototype.initialize.apply(this, arguments);
			this.render();
			this._loadData();
			BaseElementView.prototype.bindEvents.apply(this, arguments);
		},
		render: function() {
			var t = this;
			this.$el.html(tpl(TreeTpl, {
				eleBean: this.eleBean,
				attributes: this.attributes,
				editAble: this.editAble
			}));
			if (!this.editAble) {
				t._initControl();
			}
			return this;
		},
		_initControl: function() {
			var t = this
			if ($nvwa.array.isVerify(t.data)) {
				if (t.attributes && $nvwa.string.isVerify(t.attributes.title)) {
					t.data = [{
						text: t.attributes.title,
						nodes: t.data
					}]
				}
				var treeData = {
					data: t.data
				};
				if (t.attributes && $nvwa.string.isVerify(t.attributes.color)) {
					treeData['color'] = '#' + t.attributes.color;
				}
				if (t.attributes && $nvwa.string.isVerify(t.attributes.bgColor)) {
					treeData['onhoverColor'] = '#' + t.attributes.bgColor;
				}
				t.$el.find('.treeview').treeview(treeData);
			} else {
				_log('找不到加载的数据');
			}
		},
		_loadData: function() {
			var t = this;
			//对象转换
			if (t.attributes.datasource && typeof(t.attributes.datasource) == 'string') {
				t.attributes.datasource = $nvwa.string.jsonStringToObject(t.attributes.datasource);
			}
			var dataSource = t.attributes.datasource;
			if (dataSource) {
				var datasourceType = dataSource.datasource;
				var data = dataSource.data;
				if ($nvwa.string.isVerify(datasourceType) && datasourceType == 'dynamic') {
					//加载动态数据源
					var containerAlias = dataSource.containerAlias;
					var pageAlias = dataSource.pageAlias;
					var schema = dataSource.schema;
					var __getItem = function(data_tree) {
						var resultData = [];
						$.each(data_tree, function(i, item) {
							var dataItem = {};
							$.each(schema, function(name, columnName) {
								dataItem[name] = item[columnName];
							});
							if ($nvwa.array.isVerify(item.children)) {
								dataItem['nodes'] = __getItem(item.children);
							}
							//解析数据源
							resultData.push(t.loadItem(dataItem));
						});
						return resultData;
					};
					NvwaUserAPI.nvwaTree(pageAlias, containerAlias, function(response) {
						if (response && response.data_tree) {
							t.data = __getItem(response.data_tree);
							//load data complate

							t.$el.trigger('afterLoadData');
						} else {
							_log('no list data');
						}
					});
				} else if ($nvwa.string.isVerify(datasourceType) && datasourceType == 'static') {
					_log('该控件不支持静态数据源');
				} else {
					//数据源不合法
					_log('数据源不合法');
				}
			}
		},
		supportAttribute: function() {
			return ['title', 'datasource', 'color', 'bgColor'];
		},
		supportServerAttribute: function() {
			return [];
		},
		supportEventNames: function() {
			return [];
		},
		supportServerEventNames: function() {
			return [];
		},
		getDefaultAttribute: function() {
			return this.defaultAttributes;
		},
		getDatasourceSchemaList: function() {
			return [{
				name: "文本",
				schema: "text"
			}, {
				name: "值",
				schema: "value"
			}]
		},
		//设置属性
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			t.attributes[attributeName] = attributeValue;
			switch (attributeName) {
				default: return;
			}
		},

		setValue: function(value) {
			var t = this;
			t.$el.find('input').val(value);
		},
		getValue: function() {
			var t = this;
			return t.$el.find('input').val();
		},
	});
	return TreeView;
});