define([
    'backbone',
    'underscore',
    'text!js/producer/template/appResourceForm.html',
    'js/util/api/producer',
    'js/util/ui/view/modal',
    'js/util/api/mc',
    'achy/widget/ui/message',
    'js/util/string'
], function(Backbone, _, formTpl, Producer, Modal, MC, Message, StringUtil) {
    var AppResourceFormView = Backbone.View.extend({
        events: {
            // 'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent'
        },
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                appAlias: null,
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                formType: 'add', //表单类型 add update view
                title: '资源表单', //标题
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
            t.reloadData();
        },
        //重新加载
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
                    for (k in data) {
                        //给表单赋值                        
                        $('[fieldname="' + k + '"]').val(data[k]);
                    }
                });
            }

            if (t.config.appAlias) {
                $('[fieldname="appAlias"]').val(t.config.appAlias);
            }
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(_.template(formTpl, {
                options: t.options,
                config: t.config
            }));
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
            if (update) {
                var confirmContnet = '是否更新资源?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加资源？';
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
                                    var alertText = '添加资源失败';
                                    var alertShow = false;
                                    if (data && data.ok) {
                                        if (data.ok) {
                                            //添加field成功以后                                                
                                        } else {
                                            alertText = data.message;
                                            alertShow = true;
                                        }
                                    }
                                    if (alertShow) {
                                        new Modal.Alert({
                                            title: '提示',
                                            content: alertText
                                        });
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            } else if (config.formType == 'update' && config.updateDataEvent) {
                                config.updateDataEvent(saveData, function(data) {
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        }
                    }
                });
            }
        }
    });
    return AppResourceFormView;
});