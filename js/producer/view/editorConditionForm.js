define([
    'backbone',

    'text!js/producer/template/conditionForm.tpl',
    'js/util/api/producer',
    'js/util/api/oi',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/ui/view/fieldSelection',
    'js/util/dictionary',
    'js/util/string',
    'js/core/element/view/select'
], function(Backbone, formTpl, Producer, OI, MC, Modal, Message, DropButtonView, FieldSelectionView, Dictionary, StringUtil, SelectView) {
    var ConditionFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent',
            'loadSessionValueDataComplete': 'setDropList',
            'initListControlComplete': 'loadData'
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
            t.reloadData();
            t.formInitEvent();
        },
        //重新加载
        reloadData: function(objectId) {
            var t = this;
            if (objectId && objectId > 0) {
                t.config.objectId = objectId;
            }
            // t.setDropList();
            t.loadSessionValueData();
            t.setFieldSelection();
            // t.loadData();
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
                        if (k == 'conditionFieldValueType') {
                            t.conditionFieldValueType.setValue(data[k]);
                            if (data[k] && data[k] == 'request') {
                                t.$el.find('.conditionFieldValueContainer').hide();
                            } else {
                                t.$el.find('.conditionFieldValueContainer').show();
                            }
                            if (data[k] && data[k] == 'session') {
                                t.$el.find('.conditionFieldValueSelectContainer').removeClass('hidden');
                                t.$el.find('.conditionFieldValueTextContainer').addClass('hidden');
                            } else {
                                t.$el.find('.conditionFieldValueSelectContainer').addClass('hidden');
                                t.$el.find('.conditionFieldValueTextContainer').removeClass('hidden');
                            }
                        } else if (k == 'conditionType') {
                            t.conditionType.setValue(data[k]);
                        } else if (k == 'conditionFieldValue') {
                            if (data['conditionFieldValueType'] && data['conditionFieldValueType'] == 'request') {
                                //不赋值
                            } else if (data['conditionFieldValueType'] && data['conditionFieldValueType'] == 'session') {
                                t.sessionValue.setValue(data[k]);
                            } else {
                                t.$el.find('[fieldname="' + k + '"]').val(data[k]);
                            }
                        } else {
                            t.$el.find('[fieldname="' + k + '"]').val(data[k]);
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
            t.$el.find('[fieldname="conditionFieldValue"]').val('');
            t.$el.find('[fieldname="connectorPath"]').val('');
            t.$el.find('[fieldname="serialNumber"]').val('');
        },
        //表单初始化
        formInitEvent: function() {
            var t = this;
        },
        loadSessionValueData: function() {
            var t = this;

            t.sessionValueData = {
                datasource: {
                    datasource: "static",
                    data: []
                }
            };
            MC.sessionDataBeanPage(function(data) {
                if (data && data.currentRecords && data.currentRecords.length > 0) {
                    $.each(data.currentRecords, function(i, item) {
                        t.sessionValueData.datasource.data.push({
                            text: item['name'],
                            value: item['sessionKey']
                        });
                    });
                }
                t.$el.trigger('loadSessionValueDataComplete');
            }, {
                pagination_page: 1,
                pagination_pageSize: 999
            });
        },
        //设置下拉盒的属性
        setDropList: function() {
            var t = this;
            //条件字段值类型数据

            var conditionFieldValueTypeData = {
                datasource: {
                    datasource: "static",
                    data: []
                }
            };
            $.each(Dictionary.ConditionFieldValueType, function(k, v) {
                conditionFieldValueTypeData.datasource.data.push({
                    text: v,
                    value: k
                });
            });
            //条件字段值类型
            var defultConditionFieldValueType = 'constant';
            t.conditionFieldValueType = new SelectView({
                el: t.$el.find('.conditionFieldValueType')
            }, {}, conditionFieldValueTypeData);
            if (t.config && t.config.formType && t.config.formType == 'add') {
                t.conditionFieldValueType.setAttribute('disabled', false);
            } else {
                t.conditionFieldValueType.setAttribute('disabled', true);
            }
            t.conditionFieldValueType.setValue(defultConditionFieldValueType);
            t.conditionFieldValueType.setEvent({
                onSelect: function(value, text) {
                    if ($nvwa.string.isVerify(value)) {
                        if (value == 'request') {
                            t.$el.find('.conditionFieldValueContainer').hide();
                        } else {
                            t.$el.find('.conditionFieldValueContainer').show();
                        }

                        if (value == 'session') {
                            t.$el.find('.conditionFieldValueSelectContainer').removeClass('hidden');
                            t.$el.find('.conditionFieldValueTextContainer').addClass('hidden');

                        } else {
                            t.$el.find('.conditionFieldValueSelectContainer').addClass('hidden');
                            t.$el.find('.conditionFieldValueTextContainer').removeClass('hidden');
                        }
                    }
                }
            });

            //session value select
            t.sessionValue = new SelectView({
                el: t.$el.find('.conditionFieldValueSelectContainer')
            }, {}, t.sessionValueData);
            if (t.config && t.config.formType && t.config.formType == 'add') {
                t.sessionValue.setAttribute('disabled', false);
            } else {
                t.sessionValue.setAttribute('disabled', true);
            }
            t.$el.trigger('initListControlComplete');

            //条件类型


            var conditionTypeData = {
                datasource: {
                    datasource: "static",
                    data: []
                }
            };
            $.each(Dictionary.ConditionType, function(k, v) {
                conditionTypeData.datasource.data.push({
                    text: v,
                    value: k
                });
            });
            var defultconditionType = 'eq';
            t.conditionType = new SelectView({
                el: t.$el.find('.conditionType')
            }, {}, conditionTypeData);
            if (t.config && t.config.formType && t.config.formType == 'add') {
                t.conditionType.setAttribute('disabled', false);
            } else {
                t.conditionType.setAttribute('disabled', true);
            }
            t.conditionType.setValue(defultconditionType);
        },
        setFieldSelection: function() {
            var t = this;
            if (!t.fieldSelectionView || t.fieldSelectionView == null) {
                t.fieldSelectionView = new FieldSelectionView({
                    el: t.$el.find('.conditionFieldName')
                }, {
                    identified: t.config.containerBean['oi'],
                    connPathTextFieldName: 'connPath',
                    fieldNameTextFieldName: 'conditionFieldName',
                    fieldSerialNumberFieldName: 'fieldSerialNumber',
                    btnWidth: 4,
                    textWidth: 8
                });
            }
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
                saveData['conditionType'] = t.conditionType.getValue();
                saveData['conditionFieldValueType'] = t.conditionFieldValueType.getValue();
                if ($nvwa.string.isVerify(saveData['conditionFieldValueType']) && saveData['conditionFieldValueType'] == 'session') {
                    saveData['conditionFieldValue'] = t.sessionValue.getValue();
                }
            });
            if (update) {
                var confirmContnet = '是否更新条件?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加条件？';
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
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

        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        }
    });
    return ConditionFormView;
});