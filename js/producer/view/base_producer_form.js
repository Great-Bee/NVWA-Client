define([
    'backbone',

    'js/util/api/oi',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(Backbone, OI, MC, Modal, Message, DropButtonView, Dictionary, StringUtil, ConvertUtil) {
    var BaseFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent',
        },
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                formType: 'add', //表单类型 add update view
                title: '', //标题
                showTitle: false, //是否显示标题
                formData: null, //表单数据
                loadDataEvent: function() {}, //加载表单数据的event
                saveDataEvent: function() {}, //保存表单数据的event
                updateDataEvent: function() {}, //更新表单数据的event
                afterUpdateEvent: function() {}, //更新之后执行的event
                callbackEvent: function() {}, //取消返回的event
                afterFromRender: function(formType) {}, //form init callback
                confirmAddContnet: null,
                confirmUpdateContnet: null,
                formTpl: null
            }, config);
            this.config = config;
            this.render();
        },
        reloadData: function(objectId) {
            var t = this;
            if (objectId && objectId > 0) {
                t.config.objectId = objectId;
            }
            t.loadData();
        },
        /**
         * 加载数据
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        loadData: function(config) {
            var t = this;
            config = $.extend(t.config, config);
            t.config = config;
            if (t.config.loadDataEvent && t.config.loadDataEvent != null && t.config.objectId > 0) {
                t.config.loadDataEvent(t.config.objectId, function(data) {
                    t.config.formData = data;
                    $.each(data, function(name, value) {
                        t.fillFormField(name, value);
                    });
                    t.afterFillFormData(data);
                });
            } else {
                t.afterFillFormData();
            }
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            if (t.config.formTpl) {
                t.$el.html(tpl(t.config.formTpl, {
                    options: t.options,
                    config: t.config
                }));
                if ($nvwa.string.isVerify(t.config.formType)) {
                    t.afterFromRender(t.config.formType);
                }
                t.reloadData();
            } else {
                _log('can not find form template to render!');
            }
            return t;
        },
        cancelFormEvent: function() {
            //取消按钮的事件
            var t = this;
            if (t.config.callbackEvent && t.config.callbackEvent != null) {
                t.config.callbackEvent(t);
            }
        },
        //清空表单的数据
        initForm: function() {
            var t = this;
            t.$el.find('[fieldname]').val('');
        },
        getFormFieldValue: function(fieldName) {
            var t = this;
            var value = null;
            if ($nvwa.string.isVerify(fieldName)) {
                value = t.$el.find('[fieldname="' + fieldName + '"]').val();
            }
            return value;
        },
        //save事件
        saveFormEvent: function() {
            var t = this;
            var config = t.config;
            //保存按钮的事件
            var fieldList = t.$el.find('[fieldname]');
            var saveData = {};
            if (config.formData && config.formData['id'] && config.formData['id'] > 0) {
                saveData['id'] = config.formData['id'];
            }
            var update = false;
            $.each(fieldList, function(i, fieldNode) {
                var fieldName = $(fieldNode).attr('fieldname');
                var fieldFormValue = $(fieldNode).val();
                var fieldOldValue = null;
                if (config.formData && config.formData != null) {
                    fieldOldValue = config.formData[fieldName];
                }
                if (config.formType == 'add') {
                    saveData[fieldName] = fieldFormValue;
                    update = true;
                } else if (config.formType == 'update' && fieldOldValue != fieldFormValue) {
                    saveData[fieldName] = fieldFormValue;
                    update = true;
                }
            });
            //check alias
            update = t.beforeSaveForm(saveData);
            update = t.checkUnique();
            //check requireds
            var requireds = t.$el.find('[required="true"]');
            $.each(requireds, function(i, requiredInput) {
                var inputName = $(requiredInput).attr('fieldname');
                var inputValue = $(requiredInput).val();
                if (!inputValue && inputValue.length < 1) {
                    update = false;
                    t.requiredsError(inputName);
                }
            });
            //updating
            if (update) {
                var confirmContnet = t.config.confirmUpdateContnet;
                if (config.formType == 'add') {
                    confirmContnet = t.config.confirmAddContnet;
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
                                    if (data && data.ok && data.dataMap) {
                                        saveData['id'] = data.dataMap.id;
                                        t.createSuccess(saveData);
                                    } else {
                                        t.createError(saveData);
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            } else if (config.formType == 'update' && config.updateDataEvent) {
                                config.updateDataEvent(saveData, function(data) {
                                    if (data && data.ok) {
                                        t.updateSuccess(saveData);
                                    } else {
                                        t.updateError(saveData);
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        }
                    }
                });
            } else {
                _log('update error,update=false');
            }
        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        },
        checkUnique: function() {
            var t = this;
            var checkList = t.$el.find('[fieldname]');
            var result = true;
            $.each(checkList, function(i, item) {
                if ($(item).hasClass('alert-danger')) {
                    t.uniqueError($(item).attr('fieldname'));
                    result = false;
                }
            });
            return result;
        },
        //event interface
        requiredsError: function(name) {
            var t = this;
        },
        uniqueError: function(name) {
            var t = this;
        },
        afterFromRender: function() {
            var t = this;
        },
        afterFillFormData: function(data) {
            var t = this;
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            return saveData;
        },
        fillFormField: function(name, value) {
            this.$el.find('[fieldname="' + name + '"]').val(value);
        },
        createSuccess: function() {},
        createError: function() {},
        updateSuccess: function() {},
        updateError: function() {},
        //common util
        _error: function(message, timeout) {
            this._message(message, 'error', timeout);
        },
        _info: function(message, timeout) {
            this._message(message, 'info', timeout);
        },
        _message: function(message, type, timeout) {
            timeout = timeout || 1500;
            type = type || 'info';
            if ($nvwa.string.isVerify(message)) {
                new Message({
                    type: type,
                    msg: message,
                    timeout: timeout
                });
            }
        }
    });
    return BaseFormView;
});