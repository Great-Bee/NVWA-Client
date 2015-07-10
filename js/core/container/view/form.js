define([
	'js/core/container/view/base_container',
	'text!js/core/container/template/form.tpl',
	'js/util/api/mc',
	'js/core/module/nvwaUser',
	'js/util/dictionary',
	'js/util/string',
	'js/util/ui/view/modal',
	'js/core/container/util/view/layout'
], function(BaseContainerView, FormTpl, MC, NVWAUserAPI, Dictionary, StringUtil, Modal, LayoutView) {
	var FormView = BaseContainerView.extend({
		events: {
			"click .btnAddRow": "_addRow",
			"click .btnCreate": "_createData",
			"click .btnSave": "_updateData",
			"click .btnSearch": "_searchData",
			"click .btnCancel": "_closeForm",
			"click .column-mask": "_selectMask"
		},
		initialize: function(options, containerBean, attributes, eves, elements, elementLayout, editAble) {
			var t = this;
			//data map bean
			t.beanData = {};
			t.defaultClientAttribute = {
				style: "primary"
			};
			BaseContainerView.prototype.initialize.apply(this, arguments);
			t.options = options;
			t.$el = t.options.el;

			t.render();
		},

		//Render UI
		render: function() {
			var t = this;

			if (!t.elementLayout) {
				t.elementLayout = {
					containerAlias: t.containerBean['alias'],
					layouts: '{"rows":[[]],"buttons":[[]]}'
				}
			}

			this.$el.html(tpl(FormTpl, {
				formBean: t.containerBean,
				attributes: t.attributes,
				editAble: t.editAble,
				elementLayout: t.elementLayout,
				defaultClientAttribute: t.defaultClientAttribute
			}));

			//Init Form Body
			t.layoutForm = new LayoutView({
				el: t.$el.find(".panel-body")
			}, t.containerBean, t, Dictionary.ElementLayoutType.Forms);

			//Init Button Body
			t.layoutButtons = new LayoutView({
				el: t.$el.find('.buttons')
			}, t.containerBean, t, Dictionary.ElementLayoutType.Buttons);

			//Init Attribute
			if (t.attributes && typeof(t.attributes) == 'object') {
				//setting client attribute to form container
				$.each(t.attributes, function(attrName, attrValue) {
					t.setAttribute(attrName, attrValue);
				});
			}
			return this;
		},
		//设置属性
		setAttribute: function(attributeName, attributeValue) {
			var t = this;
			//setting button to enable
			var ____enable = function(btnClass) {
				t.$el.find(btnClass).removeClass('hidden');
			};
			//setting button to disable
			var ____disable = function(btnClass) {
				t.$el.find(btnClass).addClass('hidden');
			};
			//setting footer button enable attribute(create,update,search,cancel)
			var ____settingBtnEnableAttribute = function(btnClass, value) {
				if (typeof(value) == 'string') {
					if (value && value == 'true') {
						____enable(btnClass);
					} else if (value && value == 'false') {
						____disable(btnClass);
					}
				} else {
					if (value) {
						____enable(btnClass);
					} else {
						____disable(btnClass);
					}
				}
			};
			t.attributes['attributeName'] = attributeValue;
			//setting attribute
			switch (attributeName) {
				case 'title':
					t.$el.find('.panel-title').html(attributeValue);
					break;
				case 'width':
					if (StringUtil.strToInt(attributeValue)) {
						t.$el.find('[container="form"]').css('width', attributeValue + 'px');
					}
					break;
				case 'style':
					t.$el.children('div').attr('class', 'panel panel-' + attributeValue);
					break;
				case 'createAble':
					var btnClass = '.btnCreate';
					____settingBtnEnableAttribute(btnClass, attributeValue);
					break;
				case 'updateAble':
					var btnClass = '.btnSave';
					____settingBtnEnableAttribute(btnClass, attributeValue);
					break;
				case 'searchAble':
					var btnClass = '.btnSearch';
					____settingBtnEnableAttribute(btnClass, attributeValue);
					break;
				case 'cancelAble':
					var btnClass = '.btnCancel';
					____settingBtnEnableAttribute(btnClass, attributeValue);
					break;
				case 'gapConfig':
					attributeValue = attributeValue || '{}';
					if ($nvwa.string.isVerify(attributeValue)) {
						var config = $nvwa.string.jsonStringToObject(attributeValue);
						if (config) {
							if (config.columnGap) {
								//setting column gap 
								t.$el.find('[column]').css('padding-right', config.columnGap + 'px');
								t.$el.find('[column]').css('padding-left', '0px');
							}
							if (config.rowGap) {
								//setting row gap
								t.$el.find('.row').css('margin-top', config.rowGap + 'px');
								t.$el.find('.row').css('margin-bottom', '0px');
								t.$el.find('.form-group').removeClass('form-group');
							}
						}
					}
					break;
				default:
					return;
			}
		},
		//change select mask color
		_selectMask: function(e) {
			var t = this;
			//remove all select css
			$('.column-mask-select').removeClass('column-mask-select');
			$(e.target).addClass('column-mask-select');
			_log(e);
		},
		//添加行
		_addRow: function() {
			var t = this;
			t.layoutForm.addRow();
		},
		//close form
		_closeForm: function() {
			var t = this;
			//trigger close event
			t.$el.trigger('container.form.close', [t.containerBean]);
		},
		//create data
		_createData: function() {
			var t = this;
			var page = null;
			//get container alias
			var containerAlias = t.containerBean.alias;
			//Confirm
			new Modal.Confirm({
				title: '添加',
				content: '是否添加数据',
				yes: function() {
					//sending data to server side
					NVWAUserAPI.create(page, t.containerBean.alias, t._getFormValue(), function(dataMap) {
						//do success
						//trigger after create event
						t.$el.trigger('container.form.afterCreate', [t.containerBean]);
					}, function(errorCode, errorMessage) {
						//do error
						_log('create data error');
						_log(errorCode);
						_log(errorMessage);
					});
				}
			});
		},
		//update data
		_updateData: function() {
			var t = this;
			//trigger after update event
			//get id;
			var id = t.$el.attr('objectId');
			//get page alias
			var page = $('[pageAlias]').attr('pageAlias');
			//get container alias
			var containerAlias = t.containerBean.alias;
			//Confirm
			new Modal.Confirm({
				title: '更新',
				content: '是否更新数据',
				yes: function() {
					//sending data to server side
					NVWAUserAPI.updateById(page, t.containerBean.alias, id, t._getFormValue(), function(dataMap) {
						//do success
						//trigger after create event
						t.$el.trigger('container.form.afterUpdate', [t.containerBean]);
					}, function(errorCode, errorMessage) {
						//do error
						_log('update data error');
						_log(errorCode);
						_log(errorMessage);
					});
				}
			});
		},
		//search data
		_searchData: function() {
			var t = this;
			//trigger search event
			t.$el.trigger('container.form.search', [t.containerBean]);
		},

		//get form value
		_getFormValue: function() {
			var t = this;
			//get form element views
			var formViews = t.getData();
			var saveData = {};
			$.each(formViews, function(i, formView) {
				if (formView && formView.component &&
					formView.component.getValue &&
					formView.element &&
					$nvwa.string.isVerify(formView.element.serialNumber)) {
					//get key
					var key = formView.element.serialNumber;
					//get value from get value
					var value = formView.component.getValue();
					//set value
					saveData[key] = value;
				}
			});
			return saveData;
		},
		//reading data by id
		loadData: function(id) {
			var t = this;
			t.$el.attr('objectId', id);
			//loading data form database
			NVWAUserAPI.readById(null, t.containerBean.alias, id, function(dataMap) {
				//loading data success
				t.beanData = dataMap.bean;
				//Filling Data
				var formViews = t.getData();
				$.each(formViews, function(i, formView) {
					if (formView && formView.component && formView.component.setValue && formView.element && $nvwa.string.isVerify(formView.element.serialNumber)) {
						//get key
						var key = formObject.eleBean.element.serialNumber;
						//get value from form data
						var value = t.beanData[key];
						//set value
						formView.component.setValue(value);
					}
				});
			}, function(errorCode, errorMessage) {
				//loading data error
				alert("读取数据失败.errorCode:" + errorCode + ",errorMessage:" + errorMessage);
				_log("reading data error,error info:")
				_log('errorCode=' + errorCode);
				_log('errorMessage=' + errorMessage);
			});
		},
		//get form data
		getData: function() {
			var t = this;
			_log('get element values');
			var formObjects = t.getElements();
			var data = [];
			$.each(formObjects, function(k, formObject) {
				if (formObject && formObject.eleBean && formObject.eleBean.element &&
					$nvwa.string.isVerify(formObject.eleBean.element.serialNumber) &&
					$nvwa.string.isVerify(formObject.eleBean.element.fieldSerialNumber)) {
					data.push({
						element: formObject.eleBean.element,
						component: formObject,
						value: formObject.getValue()
					});
				}
			});
			_log('getData form');
			_log(data);
			return data;
		},
		supportAttribute: function() {
			return ['width', 'title', 'style', 'createAble', 'updateAble', 'searchAble', 'cancelAble', 'gapConfig'];
		},
		supportServerAttribute: function() {
			return [];
		},
		supportEventNames: function() {
			return ['click'];
		},
		supportServerEventNames: function() {
			return ['beforeSave', 'afterSave'];
		}
	});
	return FormView;
});