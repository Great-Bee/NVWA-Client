define([
	'backbone', 'underscore',
	'text!js/core/container/util/template/attribute.html',
	'js/util/api/mc',
	'js/util/dictionary',
	'js/util/ui/view/modal',
	'js/util/ui/view/iconSelection',
	'js/core/element/view/select',
	'js/core/element/view/checkbox',
	'js/core/element/view/color_picker',
	'js/core/element/view/datasource',
	'js/core/element/view/chart_config',
	'js/core/element/view/validate_config',
	'js/core/element/view/videoConfig',
	'js/core/element/view/thumbnailConfig',
	'js/util/ui/view/fieldSelection',
	'js/util/ui/view/editorEvent',
	'js/util/ui/control',
	'js/util/ui/view/columnFormat',
	'datetimepicker', 'datetimepicker_lang', 'css!bower_components/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min'
], function(
	Backbone,
	_,
	AttributeTpl,
	MC,
	Dictionary,
	Modal,
	IconSelectionView,
	SelectView,
	CheckboxView,
	ColorPickerView,
	DatasourceView,
	ChartConfigView,
	ValidateConfigView,
	VideoConfigView,
	ThumbnailConfigView,
	FieldSelectionView,
	EventView,
	ControlUtil,
	ColumnFormatView
) {
	var AttributeView = Backbone.View.extend({
		events: {
			"click .btn-cancel": "onClose",
			"click .btn-deleteElement": "removeElement",
			"click .btn-clean": "cleanElement",
			"click .btn-width": "settingWidth",
		},
		initialize: function(options, attributes, containerBean, element, layoutEvents) {
			var t = this;
			if (!t.serialNumber) {
				t.serialNumber = $nvwa.string.randomSN();
			}
			t.element = element; //用于查询客户端事件以及服务器事件使用
			t.containerBean = containerBean; //用于查询服务器属性的字段所使用			
			attributes = $.extend({
				supportAttribute: [], //属性数组
				clientAtttributes: {}, //客户端属性
				serverAtttributes: {}, //服务器属性
			}, attributes);
			t.layoutEvents = $.extend({
				callbackEvent: function() {}, //返回按钮的回调
				setClientAttribute: function(attributeName, attributeValue) {}, //设置属性的方法
				setClientAttributes: function(saveData) {}, //保存所有属性的回调
				setServerAttributes: function(saveData) {},
				rollbackClientAttr: function(originClientAttributes) {},
				remove: function() {}, //删除元素的时候触发的回调函数
				clean: function() {}, //清除元素的时候触发的回调函数
				setWidth: function(width) {}, //设置元素宽度的时候触发的回调函数
				toLeft: function() {},
				toRight: function() {},
			}, layoutEvents);
			t.attributes = attributes;
			t.originClientAttributes = t.attributes.clientAtttributes;
			t.originServerAttributes = t.attributes.serverAtttributes;
			t.datasourceSchemaList = t.attributes.datasourceSchemaList;
			t.datasourceConfig = t.attributes.datasourceConfig;
			t.render();
			t.bindEvent();
			_log('init attributes pencal');
			_log(t.attributes);
		},
		bindEvent: function() {
			var t = this;
			t.initControl();
			t.loadAttribute();
			t.showControl();
			t.initCallbackEvent();
			t.initListener();
		},
		render: function() {
			$(_.template(AttributeTpl, {
				attributes: this.attributes,
				serialNumber: this.serialNumber,
				eleId: this.element.id
			})).appendTo(this.$el);
			return this;
		},
		//获取属性值
		getAttribute: function(attributeName) {
			return this.attributes[attributeName];
		},
		//获取属性对象
		getAttributes: function() {
			return this.attributes;
		},
		initControl: function() {
			var t = this;
			var config = {
				loadData: MC.iconPage
			};
			_log(t.attributes.clientAtttributes);
			t.iconSelection = new IconSelectionView({
				el: t.$el.find('.iconSelectionContainer')
			}, config);
			config['fieldName'] = 'feedback';
			t.feedbackSelection = new IconSelectionView({
				el: t.$el.find('.feedbackSelectionContainer')
			}, config);
			config['fieldName'] = 'dataOffIconClass';
			t.dataOffIconSelection = new IconSelectionView({
				el: t.$el.find('.dataOffIconClassSelectionContainer')
			}, config);
			config['fieldName'] = 'dataOnIconClass';
			t.dataOnIconSelection = new IconSelectionView({
				el: t.$el.find('.dataOnIconClassSelectionContainer')
			}, config);

			t.readonly = new CheckboxView({
				el: t.$el.find('.readonlyContainer')
			}, {}, {});
			t.disabled = new CheckboxView({
				el: t.$el.find('.disabledContainer')
			}, {}, {});
			t.reverse = new CheckboxView({
				el: t.$el.find('.reverseContainer')
			}, {}, {});

			var sizeAttr = {
				datasource: {
					datasource: "static",
					data: [{
						text: '大',
						value: 'lg'
					}, {
						text: '中',
						value: 'sm'
					}, {
						text: '小',
						value: 'xs'
					}]
				}
			};
			t.size = new SelectView({
				el: t.$el.find('.sizeSelectionContainer')
			}, {}, sizeAttr);
			var colorAttr = {
				datasource: {
					datasource: "static",
					data: [{
						text: 'default',
						value: 'default'
					}, {
						text: '黄色',
						value: 'primary'
					}, {
						text: '绿色',
						value: 'success'
					}, {
						text: '蓝色',
						value: 'info'
					}, {
						text: '棕色',
						value: 'warning'
					}, {
						text: '红色',
						value: 'danger'
					}]
				}
			};
			var radioColorAttr = {
				datasource: {
					datasource: "static",
					data: []
				}
			};
			$.each(Dictionary.RadioColorType, function(color, colorName) {
				var radioColorItem = {
					text: colorName,
					value: color
				};
				radioColorAttr.datasource.data.push(radioColorItem);
			});
			//data off color select
			t.dataOffColor = new SelectView({
				el: t.$el.find('.dataOffColorSelectionContainer')
			}, {}, colorAttr);
			//data on color select
			t.dataOnColor = new SelectView({
				el: t.$el.find('.dataOnColorSelectionContainer')
			}, {}, colorAttr);
			//radio color select
			t.radioColor = new SelectView({
				el: t.$el.find('.radioColorSelectionContainer')
			}, {}, radioColorAttr);
			//font family style select
			t.fontFamily = new SelectView({
				el: t.$el.find('.fontContainer')
			}, {}, {
				datasource: {
					datasource: "static",
					data: [{
						text: '宋体',
						value: 'SimSun'
					}, {
						text: '楷体',
						value: 'SimKai'
					}, {
						text: '黑体',
						value: 'SimHei'
					}, {
						text: '隶书',
						value: 'SimLi'
					}, {
						text: '新罗马',
						value: 'times new roman'
					}]
				}
			});

			//font size style select
			t.fontSize = new SelectView({
				el: t.$el.find('.fontSizeContainer')
			}, {}, {
				datasource: {
					datasource: "static",
					data: [{
						text: 'Large',
						value: 'large'
					}, {
						text: 'Larger',
						value: 'larger'
					}, {
						text: 'Medium',
						value: 'medium'
					}, {
						text: 'Small',
						value: 'small'
					}, {
						text: 'Smaller',
						value: 'smaller'
					}, {
						text: 'X-large',
						value: 'x-large'
					}, {
						text: 'X-small',
						value: 'x-small'
					}, {
						text: 'XX-large',
						value: 'xx-large'
					}, {
						text: 'XX-small',
						value: 'xx-small'
					}]
				}
			});
			//font blod style select
			t.fontWeight = new SelectView({
				el: t.$el.find('.fontWeightContainer')
			}, {}, {
				datasource: {
					datasource: "static",
					data: [{
						text: 'Normal',
						value: 'normal'
					}, {
						text: 'Bold',
						value: 'bold'
					}, {
						text: 'Bolder',
						value: 'bolder'
					}, {
						text: 'Lighter',
						value: 'lighter'
					}]
				}
			});

			t.fontStyle = new SelectView({
				el: t.$el.find('.fontStyleContainer')
			}, {}, {
				datasource: {
					datasource: "static",
					data: [{
						text: 'Italic',
						value: 'italic'
					}, {
						text: 'Normal',
						value: 'normal'
					}, {
						text: 'Oblique',
						value: 'oblique'
					}]
				}
			});

			t.textAlign = new SelectView({
				el: t.$el.find('.textAlignContainer')
			}, {}, {
				datasource: {
					datasource: "static",
					data: [{
						text: '左对齐',
						value: 'left'
					}, {
						text: '右对齐',
						value: 'right'
					}]
				}
			});

			if (t.containerBean && t.containerBean['oi']) {
				t.setFieldSelection();
			}
			//init color picker
			t.fontColor = new ColorPickerView({
				el: t.$el.find('.fontColorContainer')
			}, {}, {}, [], false);
			t.bgColor = new ColorPickerView({
				el: t.$el.find('.bgColorContainer')
			}, {}, {}, [], false);
			//init event grid view
			t.setElementEventView();
			//Start Date & End Date
			t.$el.find('[fieldName="startDate"]').datetimepicker({
				autoclose: true,
				language: 'zh-CN',
				todayHighlight: true,
				todayBtn: true,
				format: 'yyyy-mm-dd'
			});
			t.$el.find('[fieldName="endDate"]').datetimepicker({
				autoclose: true,
				language: 'zh-CN',
				todayHighlight: true,
				todayBtn: true,
				format: 'yyyy-mm-dd'
			});

			//Init datasource
			t.datasource = new DatasourceView({
				el: t.$el.find(".datasourceContainer")
			}, {}, {
				schemaList: t.datasourceSchemaList,
				datasourceConfig: t.datasourceConfig
			}, [], false);

			//Init chart config
			t.chartConfig = new ChartConfigView({
				el: t.$el.find(".chartConfigContainer")
			}, {}, {}, [], false);

			//Init validate config
			t.validateConfig = new ValidateConfigView({
				el: t.$el.find(".validateConfigContainer")
			}, {}, {}, [], false);

			//init video config
			t.videoConfig = new VideoConfigView({
				el: t.$el.find(".videoConfigContainer")
			}, {}, {}, [], false);
			//inti Thumbnail Config
			t.thumbnailConfig = new ThumbnailConfigView({
				el: t.$el.find(".thumbnailConfigContainer")
			}, {}, {}, [], false);
			//Init columnFormat config
			t.columnFormat = new ColumnFormatView({
				el: t.$el.find(".columnFormatContainer")
			}, {}, {}, [], false);
		},
		initListener: function() {
			var t = this;
			var saveClientAttr = function(attrName, attrValue) {
				var saveClientAttributes = {};
				saveClientAttributes[attrName] = attrValue;
				t.layoutEvents.setClientAttribute(attrName, attrValue);
				t.layoutEvents.setClientAttributes(saveClientAttributes);
			};
			var __saveClientAttr = function(e) {
				var value = $(e.target).val();
				var fieldName = $(e.target).attr('fieldName');
				saveClientAttr(fieldName, value);
			};
			//监听所有 input input的keyup事件
			$('input[fieldName]').on('keyup', function(e) {
				__saveClientAttr(e);
			});
			//监听所有text input的change事件
			$('input[fieldName]').on('change', function(e) {
				__saveClientAttr(e);
			});
			//监听所有 textarea input的keyup事件
			$('textarea[fieldName]').on('keyup', function(e) {
				__saveClientAttr(e);
			});
			//监听所有 textarea input的keyup事件
			$('textarea[fieldName]').on('change', function(e) {
				__saveClientAttr(e);
			});

			//监听所有select的change事件
			t.size.setEvent({
				onSelect: function(value, text) {
					saveClientAttr('size', value);
				}
			});
			t.dataOffColor.setEvent({
				onSelect: function(value, text) {
					saveClientAttr('dataOffColor', value);
				}
			});
			t.dataOnColor.setEvent({
				onSelect: function(value, text) {
					saveClientAttr('dataOnColor', value);
				}
			});
			t.radioColor.setEvent({
				onSelect: function(value, text) {
					saveClientAttr('radioColor', value);
				}
			});
			//监听所有图标选择器的change事件
			t.iconSelection.setEvent({
				onSelect: function(value) {
					saveClientAttr('glyphicon', value);
				}
			});
			t.feedbackSelection.setEvent({
				onSelect: function(value) {
					saveClientAttr('feedback', value);
				}
			});
			t.dataOffIconSelection.setEvent({
				onSelect: function(value) {
					saveClientAttr('dataOffIconClass', value);
				}
			});
			t.dataOnIconSelection.setEvent({
				onSelect: function(value) {
					saveClientAttr('dataOnIconClass', value);
				}
			});
			t.fontFamily.setEvent({
				onSelect: function(value) {
					saveClientAttr('font', value);
				}
			});
			t.fontSize.setEvent({
				onSelect: function(value) {
					saveClientAttr('fontSize', value);
				}
			});
			t.fontWeight.setEvent({
				onSelect: function(value) {
					saveClientAttr('fontWeight', value);
				}
			});
			t.fontStyle.setEvent({
				onSelect: function(value) {
					saveClientAttr('fontStyle', value);
				}
			});
			t.textAlign.setEvent({
				onSelect: function(value) {
					saveClientAttr('textAlign', value);
				}
			});
			//listen checkbox select event
			//listen read only select event
			t.$el.find('.readonlyContainer').on('select', function(e, data) {
				saveClientAttr('readonly', data);
			});
			//listen disable select event
			t.$el.find('.disabledContainer').on('select', function(e, data) {
				saveClientAttr('disabled', data);
			});
			//listen reverse select event
			t.$el.find('.reverseContainer').on('select', function(e, data) {
				saveClientAttr('reverse', data);
			});
			//listen color select event
			t.$el.find('.fontColorContainer').on('element.color.select', function(e, data) {
				saveClientAttr('color', data);
			});
			//listen color select event
			t.$el.find('.bgColorContainer').on('element.color.select', function(e, data) {
				saveClientAttr('bgColor', data);
			});
			//监听所有服务器属性字段的选择
			if (t.fieldSelectionView) {
				t.fieldSelectionView.setEvent({
					onSelect: function(fieldName, connPath, fieldSerialNumber) {
						var saveServerAttributes = {
							fieldName: fieldName,
							fieldValue: t.getFormValue('fieldValue'),
							connectorPath: connPath,
							fieldSerialNumber: fieldSerialNumber
						};
						t.layoutEvents.setServerAttributes(saveServerAttributes);
					}
				});
			}
			var initDropEvent = function() {
				$('#' + t.serialNumber + '-move').draggable({
					appendTo: "body",
					helper: "clone",
					revert: "invalid",
					cursor: "move"
				});
				$('#' + t.serialNumber + '-clone').draggable({
					appendTo: "body",
					helper: "clone",
					revert: "invalid",
					cursor: "move"
				});
			}
			initDropEvent();

			//Datasource container change
			t.$el.find(".datasourceContainer").on("change", function() {
				var v = t.datasource.getValue();
				if (v) {
					saveClientAttr('datasource', v);
				}
			});

			//Chartconfig change
			t.$el.find(".chartConfigContainer").on("change", function() {
				var v = t.chartConfig.getValue();
				if (v) {
					saveClientAttr('chartConfig', v);
				}
			});

			//Validate Config change
			t.$el.find(".validateConfigContainer").on("change", function() {
				var v = t.validateConfig.getValue();
				if (v) {
					saveClientAttr('validateConfig', v);
				}
			});

			//columeFormat Config change
			t.$el.find(".columnFormatContainer").on("change", function() {
				var v = t.columnFormat.getValue();
				if (v) {
					saveClientAttr('columnConfig', v);
				}
			});

			//Video Config change
			t.$el.find(".videoConfigContainer").on("change", function() {
				var v = t.videoConfig.getValue();
				if (v) {
					saveClientAttr('videoConfig', v);
				}
			});

			t.$el.find(".thumbnailConfigContainer").on("change", function() {
				var v = t.thumbnailConfig.getValue();
				if (v) {
					saveClientAttr('thumbnailConfig', v);
				}
			});
		},
		setFieldSelection: function() {
			var t = this;
			if (!t.fieldSelectionView || t.fieldSelectionView == null) {
				t.fieldSelectionView = new FieldSelectionView({
					el: $('.serverFieldSelection')
				}, {
					currentContainerId: t.containerBean.id,
					identified: t.containerBean['oi'],
					connPathTextFieldName: 'connectorPath',
					fieldNameTextFieldName: 'fieldName',
					fieldSerialNumberFieldName: 'fieldSerialNumber',
					btnWidth: 4,
					textWidth: 8
				});
			}
		},
		showControl: function() {
			var t = this;
			//show client attribute
			ControlUtil.showControl(t.$el, t.attributes.supportAttribute);
			//show server attribute
			ControlUtil.showControl(t.$el, t.attributes.supportServerAttribute);
		},
		loadAttribute: function() {
			var t = this;
			//load client attr
			if (t.attributes.supportAttribute && t.attributes.supportAttribute.length > 0) {
				//遍历 support attribute
				$.each(t.attributes.supportAttribute, function(i, item) {
					if (typeof(t.attributes.clientAtttributes[item]) == 'string' || typeof(t.attributes.clientAtttributes[item]) == 'boolean' || typeof(t.attributes.clientAtttributes[item]) == 'number') {
						t.setFormValue(item, t.attributes.clientAtttributes[item]);
					} else if (typeof(t.attributes.clientAtttributes[item]) == 'object') {
						t.setFormValue(item, $nvwa.string.objectToJsonString(t.attributes.clientAtttributes[item]));
					}
				});
			}
			//load server attr
			if (t.attributes.serverAtttributes) {
				t.setFormValue('fieldName', t.attributes.serverAtttributes['fieldName']);
				t.setFormValue('fieldValue', t.attributes.serverAtttributes['fieldValue']);
				t.setFormValue('connectorPath', t.attributes.serverAtttributes['connectorPath']);
			}

		},
		initCallbackEvent: function() {
			var t = this;
			//返回
			$('#' + t.serialNumber + '-back').on('click', function(e) {
				$('#elementSettings').hide();
				$('#containerSettings').show();
				t.layoutEvents.callbackEvent();
			});
			//删除元素
			$('#' + t.serialNumber + '-deleteElement').on('click', function(e) {
				t.layoutEvents.remove();
			});
			//清除元素
			$('#' + t.serialNumber + '-clean').on('click', function(e) {
				t.layoutEvents.clean();
			});
			//向左
			$('#' + t.serialNumber + '-to-left').on('click', function(e) {
				t.layoutEvents.toLeft();
			});
			//向右
			$('#' + t.serialNumber + '-to-right').on('click', function(e) {
				t.layoutEvents.toRight();
			});
			//设置宽度
			$('.' + t.serialNumber + '-width').on('click', function(e) {
				t.layoutEvents.setWidth($(e.target).html());
			});

			//回滚所有客户端属性
			$('#' + t.serialNumber + '-client-rollback').on('click', function(e) {
				t.layoutEvents.rollbackClientAttr(t.originClientAttributes);
				t.attributes.clientAtttributes = t.originClientAttributes;
				t.layoutEvents.setClientAttributes(t.attributes.clientAtttributes);
				$.each(t.attributes.clientAtttributes, function(attrName, attrValue) {
					t.setFormValue(attrName, attrValue);
				});
			});
		},
		disableServerAttribute: function() {
			var t = this;
			_log('disable Server Attribute');
			t.$el.find('[tab="serverAttribute"]').hide();
			t.$el.find('[tab="layout"]').hide();
		},
		onClose: function() {
			var t = this;
			t.layoutEvents.callbackEvent();
		},
		getFormValue: function(attributeName) {
			var t = this;
			switch (attributeName) {
				case 'readonly':
					return t.readonly.getValue();
					break;
				case 'disabled':
					return t.disabled.getValue();
					break;
				case 'reverse':
					return t.reverse.getValue();
					break;
				case 'size':
					return t.size.getValue();
					break;
				case 'dataOffColor':
					return t.dataOffColor.getValue();
					break;
				case 'color':
					return t.fontColor.getValue();
					break;
				case 'bgColor':
					return t.bgColor.getValue();
					break;
				case 'font':
					return t.fontFamily.getValue();
					break;
				case 'fontSize':
					return t.fontSize.getValue();
					break;
				case 'fontWeight':
					return t.fontWeight.getValue();
					break;
				case 'fontStyle':
					return t.fontStyle.getValue();
					break;
				case 'datasource':
					return t.datasource.getValue();
					break;
				case 'chartConfig':
					return t.chartConfig.getValue();
					break;
				case 'validateConfig':
					return t.validateConfig.getValue();
					break;
				case 'columnFormat':
					return t.columnFormat.getValue();
					break;
				case 'textAlign':
					return t.textAlign.getValue();
					break;
				default:
					return t.$el.find('[fieldName="' + attributeName + '"]').val();
			}
		},
		setFormValue: function(attributeName, attributeValue) {
			var t = this;
			_log('attributeName -> ' + attributeName);
			_log('attributeValue -> ' + attributeValue);
			switch (attributeName) {
				case 'readonly':
					_log('set readonly');
					t.readonly.setValue(attributeValue);
					break;
				case 'disabled':
					t.disabled.setValue(attributeValue);
					break;
				case 'reverse':
					t.reverse.setValue(attributeValue);
					break;
				case 'size':
					t.size.setValue(attributeValue);
					break;
				case 'dataOffColor':
					t.dataOffColor.setValue(attributeValue);
					break;
				case 'dataOnColor':
					t.dataOnColor.setValue(attributeValue);
					break;
				case 'radioColor':
					t.radioColor.setValue(attributeValue);
				case 'color':
					t.fontColor.setValue(attributeValue);
					break;
				case 'bgColor':
					t.bgColor.setValue(attributeValue);
					break;
				case 'feedback':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.feedbackSelection.setValue(attributeValue);
					}
					break;
				case 'feedback':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.feedbackSelection.setValue(attributeValue);
					}
					break;
				case 'glyphicon':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.iconSelection.setValue(attributeValue);
					}
					break;
				case 'dataOffIconClass':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.dataOffIconSelection.setValue(attributeValue);
					}
					break;
				case 'dataOnIconClass':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.dataOnIconSelection.setValue(attributeValue);
					}
					break;
				case 'font':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.fontFamily.setValue(attributeValue);
					}
					break;
				case 'fontSize':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.fontSize.setValue(attributeValue);
					}
					break;
				case 'fontWeight':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.fontWeight.setValue(attributeValue);
					}
					break;
				case 'fontStyle':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.fontStyle.setValue(attributeValue);
					}
					break;
				case 'datasource':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.datasource.setValue(attributeValue);
					}
					break;
				case 'chartConfig':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.chartConfig.setValue(attributeValue);
					}
					break;
				case 'validateConfig':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.validateConfig.setValue(attributeValue);
					}
					break;
				case 'columnFormat':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.columnFormat.setValue(attributeValue);
					}
					break;
				case 'videoConfig':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.videoConfig.setValue(attributeValue);
					}
					break;
				case 'thumbnailConfig':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.thumbnailConfig.setValue(attributeValue);
					}
					break;
				case 'textAlign':
					if (attributeValue && typeof(attributeValue) == 'string') {
						t.textAlign.setValue(attributeValue);
					}
					break;
				default:
					t.$el.find('[fieldName="' + attributeName + '"]').val(attributeValue);
					break;
			}
		},
		//setting event
		setElementEventView: function() {
			var t = this;
			var targetId = t.element.id;
			new EventView({
				el: t.$el.find('.elementEvent')
			}, {
				target: Dictionary.EventTargetType.element,
				targetId: targetId,
				supportEventNames: t.attributes.supportEventNames,
				supportServerEventNames: t.attributes.supportServerEventNames
			});
		}
	});
	return AttributeView;
});