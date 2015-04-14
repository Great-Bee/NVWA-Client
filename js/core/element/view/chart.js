//highcharts图表控件
define([
	'underscore', 'js/core/element/view/base_element', 'highcharts'
], function(_, BaseElementView) {
	var ChartView = BaseElementView.extend({
		events: {},
		//初始化
		initialize: function(options, eleBean, attributes, eves, editAble) {
			var t = this;

			t.defaultAttributes = t.defaultAttributes || {};
			t.defaultAttributes = $.extend({}, t.defaultAttributes, {});
			BaseElementView.prototype.initialize.apply(t, arguments);

			t.render();
		},
		//支持的客户端属性
		supportAttribute: function() {
			var t = this;
			var attrs = BaseElementView.prototype.supportAttribute.apply(t, arguments);
			attrs.push('datasource');
			attrs.push('chartConfig');
			return attrs;
		},
		//支持的客户端事件
		supportEventNames: function() {
			return [];
		},
		//支持的服务器事件
		supportServerEventNames: function() {
			return [];
		},
		//渲染
		render: function() {
			var t = this;
			if (t.editAble) {
				t.$el.html("请设置图表参数");
			} else {
				// _log("render chart");
				// _log(t.attributes);
				var chartConfig = {};
				var datasource = {};
				try {
					if (t.attributes['chartConfig'] && typeof t.attributes['chartConfig'] == 'string') {
						chartConfig = eval("(" + t.attributes['chartConfig'] + ")");
					}
					if (t.attributes['datasource'] && typeof t.attributes['datasource'] == 'string') {
						datasource = eval("(" + t.attributes['datasource'] + ")");
					}
				} catch (e) {
					_log(e);
				}

				_log('chartConfig:');
				_log(chartConfig);
				_log('datasource:');
				_log(datasource);

				if (datasource['datasource'] == 'static') {
					var xAxis_categories = [];
					var datas = [];

					$.each(datasource.data, function(i, d) {
						xAxis_categories.push(d['xAxis']);
						if (d['name']) {
							datas.push({
								y: parseFloat(d['data']),
								name: d['name']
							});
						} else {
							datas.push(parseFloat(d['data']));
						}
					});

					chartConfig['xAxis']['categories'] = xAxis_categories;
					chartConfig['series'] = [{
						data: datas
					}];
				}

				t.$el.highcharts(chartConfig);
			}
		},
		//设置schema属性的结构
		getDatasourceSchemaList: function() {
			return [{
				name: "横坐标",
				schema: "xAxis"
			}, {
				name: "名称",
				schema: "name"
			}, {
				name: "数据",
				schema: "data"
			}]
		},
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
		},
		//设置控件值
		setValue: function(value) {
			var t = this;
		},
		//获取当前控件值
		getValue: function() {
			var t = this;
		}
	});
	return ChartView;
});