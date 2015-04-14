define([
	'backbone', 'underscore',
	'js/util/api/mc',
	'js/util/dictionary',
	'js/util/string',
	'js/core/container/util/view/row'
], function(Backbone, _, MC, Dictionary, StringUtil, RowView) {
	var LayoutView = Backbone.View.extend({
		events: {},
		initialize: function(options, containerBean, containerObject, layoutType) {
			var t = this;
			this.containerBean = containerBean || {};
			this.containerObject = containerObject;
			this.layoutType = layoutType;

			this.elementLayoutFromServer = t.containerObject.elementLayout;
			this.elementLayout = t.containerObject.elementLayout || [];

			this.initLayout();
		},
		initLayout: function() {
			var t = this;
			var elementLayouts = t.elementLayoutFromServer['layouts'] || '{}';
			t.elementLayout = eval("(" + elementLayouts + ")");
			var rowCounts = -1;
			var elementViewsMap = {};
			if (t.containerObject.elements && t.containerObject.elements.length > 0) {
				$.each(t.containerObject.elements, function(i, item) {
					if (item && item['element']) {
						item['container'] = t.containerBean;
						elementViewsMap[item['element']['id']] = item;
					}
				});
			}
			if (t.elementLayout && t.elementLayout[t.layoutType] && t.elementLayout[t.layoutType].length > 0) {
				$.each(t.elementLayout[t.layoutType], function(rowIndex, rowItem) {
					//创建行
					var row = t.initRow(t.containerBean);
					if (t.layoutType == Dictionary.ElementLayoutType.Buttons) {
						// row.$el.find('.tips-label').html('这里可以部署按钮');
						row.$el.find('.btn-clone').hide();
						row.$el.find('.btn-row-delete').hide();
					}
					if (rowItem && rowItem.length > 0) {
						$.each(rowItem, function(columnIndex, columnItem) {
							//创建列
							var columnView = row.initColumn(elementViewsMap[columnItem], {
								x: 0,
								y: rowIndex,
								z: columnIndex
							});
						});
					}
				});
			} else {
				//没有行
				_log('no row');
			}
		},
		reloadLayout: function() {
			var t = this;
			t.$el.empty();
			t.initLayout();
		},
		//添加行
		addRow: function() {
			var t = this;
			var row = t.initRow(t.containerBean);
			row.addColumn();
			t.saveLayout();
		},
		initRow: function(containerAttr) {
			var t = this;
			var container = $('<div></div>').appendTo(t.$el);
			var row = new RowView({
				el: container
			}, t.containerBean, {}, {
				//将回调事件装入row对象
				saveLayout: function(handler) {
					t.saveLayout(handler);
				},
				reloadLayout: function(handler) {
					t.reloadLayout();
				},
				rowUP: function(e) {
					t.rowUP(e);
				},
				rowDown: function(e) {
					t.rowDown(e);
				},
				columnLeft: function(e) {
					t.columnLeft(e);
				},
				columnRight: function(e) {
					t.columnRight(e);
				},
				getElement: function(id, handler) {
					//调用保存布局方法把最新的element属性拉下来
					t.saveLayout(function() {
						if (t.elementViewsMap) {
							if (handler && handler != null) {
								handler(t.elementViewsMap[id]);
							}
						}
					})
				}
			}, t, t.containerObject);
			//刷新按钮(刷新上一行)
			t.refreshBtn();
			return row;
		},
		saveLayout: function(handler) {
			var t = this;
			var list = t.$el.children();
			//从数据库获取当前最新的布局
			MC.readContainerLayoutForPreview(t.containerBean['alias'], function(response) {
				var layoutConfig = null;
				if (response['dataMap'] && response['dataMap']['container'] && response['dataMap']['container']['elementLayout'] && response['dataMap']['container']['elementLayout']['layouts']) {
					layoutConfig = response['dataMap']['container']['elementLayout']['layouts'];
				}
				if (response['dataMap']['container']['elementViews'] && response['dataMap']['container']['elementViews'].length > 0) {
					var elementViews = response['dataMap']['container']['elementViews'];
					t.elementViewsMap = {};
					$.each(elementViews, function(i, item) {
						t.elementViewsMap[item['element']['id']] = item;
					});
				}
				var layoutConfigObject = {};
				if (layoutConfig) {
					//json字符串反序列化
					layoutConfigObject = StringUtil.jsonStringToObject(layoutConfig);
				}
				//组织数据结构
				var layouts = $.extend({
					rows: [
						[]
					],
					buttons: [
						[]
					]
				}, layoutConfigObject);
				//将要保存的数据结构置空
				layouts[t.layoutType] = [];
				//将界面上的布局读取出来并装入保存数据的数组
				$.each(list, function(rowIndex, rowItem) {
					var elements = [];
					var eleItems = $(rowItem).find('[elementid]');
					$.each(eleItems, function(columnIndex, columnItem) {
						var elementId = $(columnItem).attr('elementid');
						elements.push(elementId);
					});
					layouts[t.layoutType].push(elements);
				});
				//t.attributes.elementLayouts = layouts;
				MC.updateElementLayout({
					containerAlias: t.containerBean['alias'],
					layouts: StringUtil.objectToJsonString(layouts)
				}, function(response) {
					if (response && response.ok) {
						//保存元素布局成功
						if (handler && handler != null) {
							handler(response);
						}
					} else {
						//保存元素布局失败
					}
				});
			});
		},
		getRowIndex: function(e, sn) {
			var list = this.$el.children();
			var index = -1;
			$.each(list, function(i, item) {
				var id = $(item).children().attr('id');
				if (id == sn) {
					index = i;
				}
			});
			return index;
		},
		rowUP: function(e) { //TODO：实现复杂，待改进
			var t = this;
			var target = $(e.target).parent().parent().parent().parent();
			var sn = $(e.target).parent().parent().parent().attr('id');
			var list = t.$el.children();
			var index = t.getRowIndex(e, sn);
			if (index > 0) {
				$(list[index - 1]).before(target);
			}
			t.refreshBtn();
			t.saveLayout();
		},
		rowDown: function(e) { //TODO：实现复杂，待改进
			var t = this;
			var target = $(e.target).parent().parent().parent().parent();
			var sn = $(e.target).parent().parent().parent().attr('id');
			var list = t.$el.children();
			var index = t.getRowIndex(e, sn);
			if (index < list.length) {
				$(list[index + 1]).after(target);
			}
			t.refreshBtn();
			t.saveLayout();
		},
		columnLeft: function(e) {
			var t = this;
			var prev = e.$el.prev('div');
			prev.before(e.$el);
			t.saveLayout();
		},
		columnRight: function(e) {
			var t = this;
			var next = e.$el.next('div');
			next.after(e.$el);
			t.saveLayout();
		},
		setAttribute: function(e) {
			var t = this;
			var target = $(e.target).parent().parent().parent().parent();
		},
		refreshBtn: function() {
			var list = this.$el.children();
			$.each(list, function(i, item) {
				if (i == 0) {
					$(item).find('.btn-rowUP').hide();
				} else {
					$(item).find('.btn-rowUP').show();
				}
				if (i == list.length - 1) {
					$(item).find('.btn-rowDown').hide();
				} else {
					$(item).find('.btn-rowDown').show();
				}
			});
		}
	});
	return LayoutView;
});