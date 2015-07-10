define([
	'backbone',
	'js/core/module/nvwaUser',
	'achy/widget/ui/message'
], function(Backbone, NvwaUserAPI, Message) {
	var BaseElementView = Backbone.View.extend({
		initialize: function(options, eleBean, attributes, eves, editAble) {
			this.defaultAttributes = this.defaultAttributes || {};
			if (this.defaultAttributes) {
				attributes = $.extend({}, this.defaultAttributes, attributes);
			}
			var serialNumber = eleBean['serialNumber'];
			if (!serialNumber) {
				eleBean['serialNumber'] = $nvwa.string.randomSN();
			}
			this.eleBean = eleBean;
			this.attributes = attributes;
			this.eves = eves || [];
			this.editAble = editAble;
		},
		render: function() {
			return this;
		},
		setAttribute: function(attributeName, attributeValue) {},
		getAttribute: function(attributeName) {
			return this.attributes[attributeName];
		},
		getAttributes: function() {
			return this.attributes;
		},
		getDefaultAttribute: function() {
			return this.defaultAttributes;
		},
		getDatasourceSchemaList: function() {
			return [{
				name: "名称",
				schema: "name"
			}, {
				name: "值",
				schema: "value"
			}];
		},
		getDatasourceConfig: function() {
			return {
				staticEnble: true,
				dynamicEnble: true,
				dynamicFieldEnble: true
			};
		},
		addEvent: function(event) {},
		removeEvent: function(eventName) {},
		setValue: function(value) {},
		getValue: function() {},
		isValid: function() {
			return true;
		},
		//support client attribute
		supportAttribute: function() {
			return [];
		},
		//support server attribute
		supportServerAttribute: function() {
			return [];
		},
		supportEventNames: function() {
			return ['click', 'dblclick', 'mouseover', 'mouseleave', 'select', 'keyup', 'keydown', 'keypress'];
		},
		supportServerEventNames: function() {
			return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate', 'beforeGrid', 'afterGrid', 'beforeDelete', 'afterDelete'];
		}, //绑定事件
		bindEvents: function() {
			var t = this;
			$nvwa.events._fire(t);
		},
		//加载数据源
		loadData: function() {
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
					NvwaUserAPI.nvwaPage(function(response) {
						//load data
						if (response && response.currentRecords) {
							t.data = [];
							$.each(response.currentRecords, function(i, item) {
								var dataItem = {};
								$.each(schema, function(name, columnName) {
									dataItem[name] = item[columnName];
								});
								//解析数据源
								t.data.push(t.loadItem(dataItem));
							});
							//load data complate
							t.$el.trigger('afterLoadData');
						} else {
							_log('no list data');
						}
					}, {
						pageAlias: pageAlias,
						container: containerAlias
					});
				} else if ($nvwa.string.isVerify(datasourceType) && datasourceType == 'static') {
					//加载静态数据源
					if ($nvwa.array.isVerify(data)) {
						t.data = data;
						//解析数据源
						$.each(t.data, function(i, item) {
							t.data[i] = t.loadItem(item);
						});
						//load data complate
						t.$el.trigger('afterLoadData');
					}
				} else {
					//数据源不合法
					_log('数据源不合法');
				}
			}
		},
		//解析数据源
		loadItem: function(item) {
			return item;
		},
		on: function(e, handler) {
			var t = this;
			if ($nvwa.string.isVerify(e)) {
				handler = handler || function() {};
				t.$el.on(e, handler);
			}
		},
		afterRender: function() {

		},
		_info: function(message, timeout) {
			timeout = timeout || 1500;
			if ($nvwa.string.isVerify(message)) {
				new Message({
					type: 'info',
					msg: message,
					timeout: timeout
				});
			}
		},
		_error: function(message, timeout) {
			timeout = timeout || 1500;
			if ($nvwa.string.isVerify(message)) {
				new Message({
					type: 'error',
					msg: message,
					timeout: timeout
				});
			}
		}
	});
	return BaseElementView;
});