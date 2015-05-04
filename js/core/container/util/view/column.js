define([
	'backbone', 'underscore',
	'js/util/string',
	'text!js/core/container/util/template/column.html',
	'js/util/api/mc',
	'js/util/ui/view/modal',
	'achy/widget/ui/message',
	'js/core/container/util/view/attribute',
	'js/bower_components/jQuery-Collapse/src/jquery.collapse',
	'js/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
	'css!js/bower_components/jQuery-contextMenu/src/jquery.contextMenu',
], function(Backbone, _, StringUtil, ColumnTpl, MC, Modal, Message, AttributeView, CollapseView) {
	var ColumnView = Backbone.View.extend({
		events: {
			"click .hiddenClean": "_resetAttr",
			"click .column-mask": "_settingAttribute"
		},
		initialize: function(options, attributes, elementView, layoutEvents, containerObject) {
			var t = this;
			if (!t.serialNumber) {
				t.serialNumber = StringUtil.randomSN();
			}
			t.defaultAttribute = {
				componentAlias: null,
				elementClientAttribute: {},
				elementServerAttribute: {}, //produce环境的设置界面用
				columnWidth: 3 //col-md-x
			};
			attributes = $.extend({}, t.defaultAttribute, attributes);
			t.attributes = attributes;
			t.layoutEvents = $.extend({
				saveLayout: function() {},
				reloadLayout: function(handler) {},
				columnLeft: function(e) {},
				columnRight: function(e) {},
			}, layoutEvents);

			t.elementView = elementView;
			t.element = elementView['element'] || {};

			t.containerObject = containerObject;

			t.render();
		},
		_bindEvent: function() {
			var t = this;
			//dorp
			$('#' + t.serialNumber + '-col').droppable({
				drop: function(event, ui) {
					var isEmpty = true;
					if (t.componentView) {
						isEmpty = false;
					}
					if (isEmpty) {
						//防止将该元素上已经存在的组件移除掉
						$('#' + t.serialNumber + '-col').removeClass('alert');
						$('#' + t.serialNumber + '-col').removeClass('alert-success');
						$('#' + t.serialNumber + '-col').html('');
					}
					var operationType = $(ui.draggable).attr('type');
					if (operationType == 'add' && isEmpty) {
						//type=add is adding a component
						t.attributes.componentAlias = $(ui.draggable).attr('alias');
						var defaultAttribute = '';
						var elementid = t.$el.attr('elementid');
						t.initComponent(function(component) {
							//update component alias
							MC.updateElement({
								id: elementid,
								componentAlias: t.attributes.componentAlias
							}, function(response) {
								if (response && response.ok) {
									//更新元素成功
								}
							});
							//update client attr						
							t._saveClientAttributes(component.getDefaultAttribute());
							$.each(component.getDefaultAttribute(), function(attrName, attrValue) {
								component.setAttribute(attrName, attrValue);
							});
							//弹出属性面板
							t._settingAttribute($('#' + t.serialNumber + '-settings'));
						});
					} else if (operationType == 'move' && isEmpty) {
						//type=move is moving other component to this column
						if (!t.componentView) {
							var tragerEleId = t.$el.attr('elementid');
							//将elementId赋值到Dom结构上
							var moveEleId = $(ui.draggable).attr('elementid');
							var tragerEle = $('[elementid="' + tragerEleId + '"][containerId]');
							var moveEle = $('[elementid="' + moveEleId + '"][containerId]');
							var tag = $('<div class="temp-tag"><div>').insertAfter(moveEle);
							tragerEle.after(moveEle);
							tag.after(tragerEle);
							tag.remove();
							t.layoutEvents.saveLayout(function(response) {
								if (response && response.ok) {
									new Message({
										type: 'info',
										msg: '移动元素成功',
										timeout: 1500
									});
								} else {
									new Message({
										type: 'error',
										msg: '移动元素失败',
										timeout: 1500
									});
								}
							});

						} else {
							new Message({
								type: 'error',
								msg: '当前元素已经有其他组件了',
								timeout: 1500
							});
						}
					} else if (operationType == 'clone' && isEmpty) {
						//type=clone is clone other component to this column
						if (!t.componentView) {
							var tragerEleId = t.$el.attr('elementid');
							//将elementId赋值到Dom结构上
							var cloneEleId = $(ui.draggable).attr('elementid');
							t.layoutEvents.getElement(cloneEleId, function(view) {
								//拿到被克隆对象后立刻实例化一个组件
								t.attributes.componentAlias = view['element']['componentAlias'];
								var clientAttr = view['elementClientAttribute'];
								t.initComponent(function(cloneComponent) {
									//然后set客户端属性
									var supportAttr = cloneComponent.supportAttribute();
									$.each(supportAttr, function(i, attrName) {
										cloneComponent.setAttribute(attrName, clientAttr[attrName]);
									});
									//将数据更新到服务器
									MC.updateElement({
										id: t.attributes['element']['id'],
										componentAlias: t.attributes.componentAlias
									}, function(response) {
										if (response && response.ok) {
											//更新元素成功
										}
									});
									clientAttr['elementId'] = t.attributes['element']['id'];
									//update client attr
									t._saveClientAttributes(clientAttr);
								});
							});
						} else {
							new Message({
								type: 'error',
								msg: '当前元素已经有其他组件了',
								timeout: 1500
							});
						}
					}
				}
			});
			//init context menu
			t._initContextMenu();
		},
		initComponent: function(handler) {
			var t = this;
			if (t.attributes.componentAlias && t.attributes.componentAlias.length > 0 && t.attributes.componentAlias != 'none') {
				require(["js/core/element/view/" + t.attributes.componentAlias],
					function(ComponentView) {
						//初始化之前设置的客户端属性
						var clientAtttributes = t.attributes.elementClientAttribute
						var eleBean = {
							element: t.element
						};
						var attributes = {};
						if (clientAtttributes) {
							attributes = $.extend(attributes, clientAtttributes);
						}
						t.componentView = new ComponentView({
							el: $('#' + t.serialNumber + '-col')
						}, eleBean, attributes, t.elementView['clientEvents'], t.containerObject.editAble);

						$('#' + t.serialNumber + '-col').removeClass('def');;
						var supportAttribute = t.componentView.supportAttribute();
						//set mask
						t._settingMaskArea();
						setTimeout(function() {
							//回调
							if (handler && handler != null) {
								handler(t.componentView);
							}
							//将view写入缓存,以备读取表单的时候使用
							t.containerObject.setElement(t.element['serialNumber'], t.componentView);
						}, 100);
					}
				);
			} else {
				if (handler && handler != null) {
					handler(null);
					_log('initComponent is null');
				}
			}
		},
		//setting mask area's width and height
		_settingMaskArea: function() {
			var t = this;
			var maskBody = $('.' + t.serialNumber + '-mask');
			var controlArea = $('#' + t.serialNumber + '-col');
			var maskWidth = controlArea.width() || 200; //default value is 200px
			var maskHeight = controlArea.height() || 34; //default value is 34px
			maskBody.width(maskWidth);
			maskBody.height(maskHeight);
		},
		_initContextMenu: function() {
			var t = this;
			//init context menu
			$.contextMenu({
				selector: '.' + t.serialNumber + '-mask',
				callback: function(key, options) {
					switch (key) {
						case 'toLeft':
							t.layoutEvents.columnLeft(t);
							break;
						case 'toRight':
							t.layoutEvents.columnRight(t);
							break;
						case 'delete':
							//触发delete
							//Confirm to delete
							/*
							new Modal.Confirm({
								title: '删除',
								content: '是否删除该元素',
								yes: function() {
									t.remove();
									$('#elementSettings').hide();
									$('#containerSettings').show();
								}
							});
							*/
							t.remove();
							$('#elementSettings').hide();
							$('#containerSettings').show();
							break;
						case 'clean':
							//触发 clean
							//将之前实例化的elementView置空
							t.componentView = null;
							//还原CSS
							$('#' + t.serialNumber + '-col').html('');
							$('#' + t.serialNumber + '-col').addClass('def');
							//将本地的客户端属性置空
							t.attributes.elementClientAttribute = {};
							//更新服务器上的客户端属性
							MC.updateElement({
								id: t.attributes['element']['id'],
								componentAlias: 'none'
							}, function(response) {
								if (response && response.ok) {
									//更新元素成功
									$('#elementSettings').hide();
									$('#containerSettings').show();
									new Message({
										type: 'info',
										msg: '清除元素成功',
										timeout: 1500
									});
								} else {
									new Message({
										type: 'error',
										msg: '更新元素失败',
										timeout: 1500
									});
								}
							});
							break;
						case 'c1':
							t.setWidth(1);
							break;
						case 'c2':
							t.setWidth(2);
							break;
						case 'c3':
							t.setWidth(3);
							break;
						case 'c4':
							t.setWidth(4);
							break;
						case 'c5':
							t.setWidth(5);
							break;
						case 'c6':
							t.setWidth(6);
							break;
						case 'c7':
							t.setWidth(7);
							break;
						case 'c8':
							t.setWidth(8);
							break;
						case 'c9':
							t.setWidth(9);
							break;
						case 'c10':
							t.setWidth(10);
							break;
						case 'c11':
							t.setWidth(11);
							break;
						case 'c12':
							t.setWidth(12);
							break;
						default:
							break;
					}
				},
				items: {
					toLeft: {
						name: "向左",
						icon: "copy"
					},
					toRight: {
						name: "向右",
						icon: "copy"
					},
					delete: {
						name: "删除",
						icon: "delete"
					},
					clean: {
						name: "清除",
						icon: "copy"
					},
					c1: {
						name: "1栏",
						icon: "copy"
					},
					c2: {
						name: "2栏",
						icon: "copy"
					},
					c3: {
						name: "3栏",
						icon: "copy"
					},
					c4: {
						name: "4栏",
						icon: "copy"
					},
					c5: {
						name: "5栏",
						icon: "copy"
					},
					c6: {
						name: "6栏",
						icon: "copy"
					},
					c7: {
						name: "7栏",
						icon: "copy"
					},
					c8: {
						name: "8栏",
						icon: "copy"
					},
					c9: {
						name: "9栏",
						icon: "copy"
					},
					c10: {
						name: "10栏",
						icon: "copy"
					},
					c11: {
						name: "11栏",
						icon: "copy"
					},
					c12: {
						name: "12栏",
						icon: "copy"
					}
				}
			});
		},
		remove: function() {
			var t = this;
			//删除UI上的元素
			t.$el.remove();
			//联动数据库删除element
			var element = t.getAttributes().element;
			MC.deleteElement(element, function(response) {
				if (response && response.ok) {
					//layout同步到数据库
					t.layoutEvents.saveLayout();
				}
			});
		},
		render: function() {
			var t = this;
			$(_.template(ColumnTpl, {
				formBean: this.formBean,
				attributes: this.attributes,
				editAble: this.containerObject.editAble,
				serialNumber: this.serialNumber
			})).appendTo(this.$el);

			t._settingMaskArea();
			if (t.containerObject.editAble) {
				t._bindEvent();
			}
			if (t.element && t.element['componentAlias'] && t.element['componentAlias'].length > 0) {
				t.attributes.componentAlias = t.element['componentAlias'];
				t.initComponent();
			}
			return this;
		},
		_settingAttribute: function(e) {
			var t = this;
			//get support attribute
			var __getSupportAttribute = function() {
				debugger;
				if (t.componentView && t.componentView.supportAttribute &&
					t.componentView.supportAttribute()) {
					return t.componentView.supportAttribute();
				} else {
					return [];
				}
			};
			//get defaule datasource schema list
			var __getDatasourceSchemaList = function() {
				debugger;
				if (t.componentView && t.componentView.getDatasourceSchemaList &&
					t.componentView.getDatasourceSchemaList()) {
					return t.componentView.getDatasourceSchemaList();
				} else {
					return [];
				}
			};
			var __getDatasourceConfig = function() {
				debugger;
				if (t.componentView && t.componentView.getDatasourceConfig &&
					t.componentView.getDatasourceConfig()) {
					return t.componentView.getDatasourceConfig();
				} else {
					return [];
				}
			};
			var __getSupportServerAttribute = function() {
				if (t.componentView && t.componentView.supportServerAttribute &&
					t.componentView.supportServerAttribute()) {
					return t.componentView.supportServerAttribute();
				} else {
					return [];
				}
			};
			var __getSupportEventNames = function() {
				if (t.componentView && t.componentView.supportEventNames &&
					t.componentView.supportEventNames()) {
					return t.componentView.supportEventNames();
				} else {
					return [];
				}
			};
			var __getSupportServerEventNames = function() {
				if (t.componentView && t.componentView.supportServerEventNames &&
					t.componentView.supportServerEventNames()) {
					return t.componentView.supportServerEventNames();
				} else {
					return [];
				}
			}

			//hidden掉所有的右边面板
			$('[data-collapse]').hide();
			//显示属性面板
			$('#elementSettings').html('');
			t.elementSettings = new AttributeView({
				el: $('#elementSettings')
			}, {
				clientAtttributes: t.attributes.elementClientAttribute || {}, //client attribute
				serverAtttributes: t.attributes.elementServerAttribute || {}, //server attribute
				datasourceSchemaList: __getDatasourceSchemaList(),
				datasourceConfig: __getDatasourceConfig(),
				supportAttribute: __getSupportAttribute(), //support client attribute
				supportServerAttribute: __getSupportServerAttribute(), //support server attribute
				supportEventNames: __getSupportEventNames(), //support client event name
				supportServerEventNames: __getSupportServerEventNames() //support server event name
			}, t.containerObject.getContainerBean(), t.element, {
				callbackEvent: function() {
					//销毁窗口			
					$('#' + t.serialNumber + '-settings').removeClass('btn-select');
					$('#' + t.serialNumber + '-settings').addClass('btn-primary');
				},
				setClientAttribute: function(attributeName, attributeValue) {
					if (t.componentView) {
						t.componentView.setAttribute(attributeName, attributeValue);
					}
				},
				setClientAttributes: function(saveData) {
					t._saveClientAttributes(saveData);
				},
				setServerAttributes: function(saveData) {
					t._saveServerAttributes(saveData);
					new Message({
						type: 'info',
						msg: '保存当前元素服务器属性设置',
						timeout: 1500
					});
				},
				rollbackClientAttr: function(clientAttr) {
					$.each(clientAttr, function(k, attr) {
						t.componentView.setAttribute(k, attr);
					});
					new Message({
						type: 'info',
						msg: '回滚当前元素客户端属性设置',
						timeout: 1500
					});
				}
			});
			//激活控件
			t.collapse = new jQueryCollapse($("#elementSettings"));
			//默认打开第一和第二个tab
			if (__getSupportAttribute() && __getSupportAttribute().length > 0) {
				//说明当前元素上已经有组件,默认打开客户端属性和服务器属性这两个标签
				t.collapse.open(0);
				t.collapse.open(1);
			}
			//显示
			$('#elementSettings').show();
		},
		setWidth: function(width) {
			var t = this;
			var bodyClass = t.$el.attr('class');
			var bodyClassArray = bodyClass.split(" ");
			$.each(bodyClassArray, function(i, item) {
				if (item.indexOf('col') > -1) {
					t.$el.removeClass(item);
				}
			});
			t.$el.addClass('col-md-' + width);
			t.attributes.columnWidth = width;
			t.initComponent(function(component) {
				//update client attr
				var saveData = {};
				if (component) {
					saveData = component.getAttributes();
				}
				saveData['columnWidth'] = width;
				t._saveClientAttributes(saveData);
			});
		},
		_saveClientAttributes: function(saveData) {
			var t = this;
			var clientAttr = {
				elementId: t['element']['id'],
				columnWidth: t.attributes.columnWidth
			}
			clientAttr = $.extend(clientAttr, t.attributes.elementClientAttribute, saveData);
			t.attributes.elementClientAttribute = clientAttr;
			MC.updateElementClientAttribute(clientAttr);
		},
		_saveServerAttributes: function(saveData) {
			var t = this;
			var serverAttr = {
				elementId: t['element']['id']
			}
			serverAttr = $.extend(serverAttr, saveData);
			t.attributes.elementServerAttribute = serverAttr;
			MC.updateElementServerAttribute(serverAttr);
		},
		//获取属性值
		getAttribute: function(attributeName) {
			return this.attributes[attributeName];
		},
		//获取属性对象
		getAttributes: function() {
			return this.attributes;
		},
		_resetAttr: function(e, eleId) {
			var t = this;
			t.attributes = t.defaultAttribute;
			t.componentView = null;
			// t.attributes['element']['id'] = eleId;
			t.element.id = eleId;
		},
		getValue: function() {
			var t = this;
			if (t.componentView && t.componentView.getValue) {
				return t.componentView.getValue();
			}
		}
	});
	return ColumnView;
});