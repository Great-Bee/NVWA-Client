define([
	'backbone',
	'js/util/string',
	'text!js/core/container/util/template/row.tpl',
	'js/util/api/mc',
	'js/util/dictionary',
	'js/core/container/util/view/column'
], function(Backbone, StringUtil, RowTpl, MC, DictionaryUtil, ColumnView) {
	var RowView = Backbone.View.extend({
		events: {
			"click .btn-rowUP": "rowUP",
			"click .btn-rowDown": "rowDown",
			"click .btn-clone": "rowClone"
		},
		//初始化构造函数
		initialize: function(options, containerBean, attributes, layoutEvents, layoutObject, containerObject) {
			var t = this;
			t.containerBean = containerBean || {};
			if (!this.serialNumber) {
				this.serialNumber = StringUtil.randomSN();
			}
			attributes = $.extend({
				title: null,
				style: "panel-primary",
				columnViews: {},
				defaultColumnWidth: 3,
				container: {} //container属性
			}, attributes);
			t.attributes = attributes;

			t.layoutEvents = $.extend({
				saveLayout: function(handler) {},
				reloadLayout: function(handler) {},
				rowUP: function(e) {},
				rowDown: function(e) {},
				columnLeft: function(e) {},
				columnRight: function(e) {}
			}, layoutEvents);

			t.layoutObject = layoutObject;
			t.containerObject = containerObject;

			t.layoutConfig = [];
			t.render();
		},
		//绑定事件
		bindEvent: function() {
			var t = this;
			//添加一行的按钮
			$('#' + t.serialNumber + '-addRow').on('click', function(e) {
				t.addRow($(e.target).parent().parent().parent());
			});
			//添加一列的按钮
			$('#' + t.serialNumber + '-addColumn').on('click', function(e) {
				t.addColumn($(e.target).parent().parent().parent());
			});
			//删除一行的按钮
			$('#' + t.serialNumber + '-delete').on('click', function(e) {
				t.remove();
			});
		},
		//向下移动一行
		rowUP: function(e) {
			var t = this
			t.layoutEvents.rowUP(e);
		},
		//向上移动一行
		rowDown: function(e) {
			var t = this;
			t.layoutEvents.rowDown(e);
		},
		//复制当前行的布局
		rowClone: function(e) {
			var t = this;
			var container = $('<div></div>');
			$(e.target).parent().parent().parent().parent().after(container);
			var row = new RowView({
				el: container
			}, t.containerBean, {}, t.layoutEvents, t.layoutObject, t.containerObject);
			//刷新按钮(刷新上一行)
			// t.refreshBtn();
			//保存布局到数据库
			t.layoutEvents.saveLayout(function(response) {
				var columnViews = t.attributes.columnViews;
				var i = 0;
				$.each(columnViews, function(elementId, columnViewItem) {
					row.layoutConfig = t.layoutConfig;
					row.addColumn(null, function(ele, col) {
						col.setWidth(t.layoutConfig[i]);
						i++;
					}, null);
				});
			});
			return row;
		},
		//添加行
		addRow: function(e) {
			var t = this;
			var container = $('<div></div>');
			e.parent().after(container);
			new RowView({
				el: container
			}, t.containerBean, {}, t.layoutEvents, t.layoutObject, t.containerObject);
		},
		//添加一列
		addColumn: function(e, handler, columnWidth) {
			var t = this;
			if (!e) {
				e = t.$el.children();
			}
			//设置宽度的默认值
			columnWidth = columnWidth || t.attributes['defaultColumnWidth'];
			//获取containerId
			var containerId = t.containerBean['id'];
			//获取当前行
			var rowID = e.attr('id');
			var rowList = e.parent().parent().children();
			var rowIndex = t.getRowIndex(rowList, rowID);
			//获取当前列
			var newColumnIndex = t.getColumnCount(e);
			var element = {
				name: containerId + '-form',
				componentAlias: '',
				containerId: containerId
			};
			//请求数据库添加element
			MC.addElement(element, function(response) {
				if (response && response.ok) {
					var elementId = response['dataMap']['id'];
					element['id'] = elementId;
					//请求数据库添加element的客户端布局元素
					var elementLayout = {
						x: 0,
						y: rowIndex,
						z: newColumnIndex
					}
					var elementView = {
						element: element,
						clientEvents: {},
						serverEvents: {},
						elementClientAttribute: {
							columnWidth: columnWidth
						},
						elementServerAttribute: {},
						container: t.attributes.container
					};
					var columnView = t.initColumn(elementView, elementLayout, e);
					//save layout
					t.layoutEvents.saveLayout();
					MC.updateElementClientAttribute({
						elementId: element['id'],
						columnWidth: columnWidth
					}, function() {
						if (handler && handler != null) {
							handler(element, columnView);
						}
					});
				}
			});
		},
		//初始化列布局
		initColumn: function(elementView, elementLayout, e) {
			var t = this;
			//保证windows.container对象不为空			
			if (!e) {
				e = t.$el.children();
			}
			if (elementView) {
				var element = elementView['element'];
				//声明column
				var columnWidth = elementView['elementClientAttribute']['columnWidth'] || t.attributes['defaultColumnWidth'];
				var container = $('<div elementId="' + element['id'] + '" containerId="' + element['containerId'] + '" row="' + elementLayout['y'] + '" column="' + elementLayout['z'] + '"></div>').appendTo(e);
				if (t.layoutObject.layoutType == DictionaryUtil.ElementLayoutType.Forms) {
					container.addClass('col-md-' + columnWidth);
				} else {
					container.addClass(t.layoutObject.layoutType + 'Layout');
				}
				var columnView = new ColumnView({
					el: container
				}, {
					element: element,
					elementLayout: elementLayout,
					elementClientAttribute: elementView['elementClientAttribute'],
					elementServerAttribute: elementView['elementServerAttribute'],
					columnWidth: columnWidth
				}, elementView, t.layoutEvents, t.containerObject);
				t.attributes.columnViews[element['id']] = columnView;
				t.layoutConfig.push(columnView.attributes.columnWidth);
				//隐藏帮助文档
				t.$el.find('.tips-label').hide();
				if (elementView['element'] && elementView['element']['serialNumber']) {
					//将将init好的columnView放入window对象中
				}
				return columnView;
			}
		},
		//获取当前行的index值
		getRowIndex: function(rowList, rowID) {
			var index = -1;
			$.each(rowList, function(i, item) {
				var id = $(item).children().attr('id');
				if (id == rowID) {
					index = i;
				}
			});
			return index;
		},
		//获取当前行有多少个元素
		getColumnCount: function(e) {
			return e.children().length - 1;
		},
		//删除这一行布局
		remove: function() {
			var t = this;
			//删除该行上的所有元素
			_log(t.attributes.columnViews);
			$.each(t.attributes.columnViews, function(k, v) {
				v.remove();
			});
			t.$el.remove();
			// //同步布局到数据库
			t.layoutEvents.saveLayout();
		},
		//渲染
		render: function() {
			$(tpl(RowTpl, {
				attributes: this.attributes,
				editAble: this.containerObject.editAble,
				serialNumber: this.serialNumber
			})).appendTo(this.$el);
			//bind event
			this.bindEvent();
			return this;
		}
	});
	return RowView;
});