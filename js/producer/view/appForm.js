define([
    'backbone',

    'text!js/producer/template/appForm.tpl',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(Backbone, formTpl, MC, Modal, Message, DropButtonView, Dictionary, StringUtil, ConvertUtil) {
    var AppFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-save': 'saveFormEvent',
            'click .btn-cancel': 'cancelFormEvent',
            'keyup [fieldname="alias"]': 'uniqueAliasEvent'
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
                    for (k in data) {
                        //给表单赋值                        
                        $('[fieldname="' + k + '"]').val(data[k]);
                        if (k == 'type') {
                            t.pageType.setListData(null, data[k]);
                        }
                    }
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
            t.pageType = new DropButtonView({
                el: $('.appType')
            }, {
                containerId: 'appType',
                fieldName: 'appType'
            });
            var defultPageType = 'web';
            t.pageType.setListData(Dictionary.AppType, defultPageType);
        },
        //save事件
        saveFormEvent: function() {
            var t = this;
            var config = t.config;
            //保存按钮的事件
            var fieldList = $('[fieldname]');
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
            if ($('[fieldname="alias"]').hasClass('alert-danger')) {
                new Message({
                    type: 'error',
                    msg: '别名已重复,请重新填写',
                    timeout: 1500
                });
                update = false;
            }
            if (update) {
                var confirmContnet = '是否更新App?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加App？';
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
                                                msg: '添加App成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            new Modal.Alert({
                                                title: '提示-添加App失败',
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
                                                msg: '更新App成功',
                                                timeout: 1500
                                            });
                                        } else {
                                            new Modal.Alert({
                                                title: '提示-更新App失败',
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
        uniqueAliasEvent: function(e) {
            var t = this;
            t.checkUnique($(e.target).val());
        },
        checkUnique: function(alias) {
            var fieldName = 'alias';
            MC.appUnique(alias, function(response) {
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
    return AppFormView;
});