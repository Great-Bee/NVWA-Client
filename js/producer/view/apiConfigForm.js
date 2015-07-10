define([
    'backbone',
    'text!js/producer/template/apiConfigForm.tpl',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(Backbone, formTpl, MC, Modal, Message, DropButtonView, Dictionary, StringUtil, ConvertUtil) {
    var ApiConfigFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelEvent',
            'click .btn-save': 'saveEvent',
            'keyup [fieldname="alias"]': 'aliasKeyupEvent'
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
                callbackEvent: function() {} //取消返回的event
            }, config);
            t.unique = true;
            t.config = config;
            t.render();
        },
        //重新加载
        reloadData: function(objectId) {
            var t = this;
            if (objectId && objectId > 0) {
                t.config.objectId = objectId;
            }
            t.setDropList();
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
                    $.each(data, function(k, v) {
                        //给表单赋值                        
                        $('[fieldname="' + k + '"]').val(data[k]);
                        if (k == 'appType') {
                            t.appType.setListData(null, data[k]);
                        }
                    });
                });
            }
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(tpl(formTpl, {
                options: t.options,
                config: t.config
            }));
            t.reloadData();
            t.formInitEvent();
            return t;
        },
        //cancel click event
        cancelEvent: function() {
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
        //表单初始化
        formInitEvent: function() {
            var t = this;
            if (this.config.formType != 'add') {

            } else {
                //add mode
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        //设置下拉盒的属性
        setDropList: function() {
            var t = this;
            t.appType = new DropButtonView({
                el: $('.appType')
            }, {
                containerId: 'appType',
                fieldName: 'appType'
            });
            var defultPageType = 'web';
            t.appType.setListData(Dictionary.AppType, defultPageType);
        },
        //on saving event
        saveEvent: function() {
            var t = this;
            var config = t.config;
            var fieldList = $('[fieldname]');
            var saveData = {};
            if (config.formData && config.formData['id'] && config.formData['id'] > 0) {
                saveData['id'] = config.formData['id'];
            }
            var update = false;
            //check update value
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
            //check requireds
            var requireds = $('[required="true"]');
            $.each(requireds, function(i, requiredInput) {
                var inputName = $(requiredInput).attr('fieldname');
                var inputValue = $(requiredInput).val();
                if (!inputValue && inputValue.length < 1) {
                    update = false;
                    switch (inputName) {
                        case 'name':
                            new Message({
                                type: 'error',
                                msg: '请填写名称',
                                timeout: 1500
                            });
                            break;
                        case 'alias':
                            new Message({
                                type: 'error',
                                msg: '请填写别名',
                                timeout: 1500
                            });
                            break;
                        default:
                            break;
                    }
                }
            });
            //update
            if (update) {
                var confirmContnet = '是否更新API配置?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加API配置？';
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
                                    if (data && data.ok) {
                                        if (data.ok) {
                                            //添加field成功以后   
                                            new Message({
                                                type: 'info',
                                                msg: '添加API配置成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            new Modal.Alert({
                                                title: '提示-添加API配置失败',
                                                content: data.message
                                            });
                                        }
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            } else if (config.formType == 'update' && config.updateDataEvent) {
                                config.updateDataEvent(saveData, function(data) {
                                    if (data && data.ok) {
                                        if (data.ok) {
                                            //添加field成功以后   
                                            new Message({
                                                type: 'info',
                                                msg: '更新API配置成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            new Modal.Alert({
                                                title: '提示-更新API配置失败',
                                                content: data.message
                                            });
                                        }
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        }
                    }
                });
            }
        },
        //alias keyup event
        aliasKeyupEvent: function(e) {
            var t = this;
            t.checkUnique($(e.target).val());
        },
        //check unique
        checkUnique: function(alias) {
            var fieldName = 'alias';
            MC.apiConfigUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        $('[fieldname="' + fieldName + '"]').addClass("alert-danger");

                    }
                } else {
                    $('[fieldname="' + fieldName + '"]').removeClass('alert-danger');

                }
            });
        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        }
    });
    return ApiConfigFormView;
});