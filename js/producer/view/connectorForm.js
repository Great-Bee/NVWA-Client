define([
    'backbone',
    'underscore',
    'text!js/producer/template/connectorForm.html',
    'js/util/api/producer',
    'js/util/api/oi',
    'js/util/ui/view/modal',
    'js/util/ui/view/dropButton',
    'achy/widget/ui/message',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(Backbone, _, formTpl, Producer, OI, Modal, DropButtonView, Message, Dictionary, StringUtil, ConvertUtil) {
    var ConnectorFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent',
            'keyup [fieldname="alias"]': 'uniqueFormEvent',
            'keyup [fieldname]': 'inputFormEvent'
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
                afterAddEvent: function() {}, //创建之后执行的event
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
            t.loadData();
            t.setDroupBox();
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
                        t.$el.find('*[fieldname="' + k + '"]').val(data[k]);
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
            t.$el.html(_.template(formTpl, {
                options: t.options,
                config: t.config
            }));
            t.initForm();
            t.reloadData();
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
            if (t.config.formType == 'add') {
                //add mode
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        inputFormEvent: function(e) {
            var t = this;
            //解除红底样式
            $(e.target).removeClass("alert-danger");
        },
        //设置下拉盒的控件
        setDroupBox: function() {
            var t = this;
            var readonly = false;
            if (t.config.formType != 'add') {
                readonly = true;
            }
            //设置下拉框            
            var __loadFieldData = function(fieldBox, identified) {
                OI.fieldList(function(data) {
                    if (data && data['currentRecords'] && data['currentRecords'].length > 0) {
                        var list = data['currentRecords'];
                        var fieldData = {};
                        $.each(list, function(i, item) {
                            fieldData[item['fieldName']] = item['name'];
                        });
                        fieldBox.setListData(fieldData);
                    }
                }, {
                    conditions: [{
                        fieldName: 'oiIdentified',
                        fieldValue: identified
                    }]
                });
            };
            var __loadComboBoxFormData = function() {
                var formData = t.config.formData;
                if (formData) {
                    if (formData['fromField']) {
                        t.fromField.setListData(null, formData['fromField']);
                    }
                    if (formData['toOI']) {
                        t.toOI.setListData(null, formData['toOI']);
                        //载入toField的list
                        __loadFieldData(t.toField, formData['toOI']);
                        setTimeout(function() {
                            if (formData['toField']) {
                                t.toField.setListData(null, formData['toField']);
                            }
                        }, 500);
                    }
                }
            };
            t.toOI = new DropButtonView({
                el: $('.toOI')
            }, {
                containerId: 'toOI',
                fieldName: 'toOI',
                readonly: readonly,
                onChangeEvent: function(data) {
                    //级联加载
                    __loadFieldData(t.toField, data);
                }
            });
            t.toField = new DropButtonView({
                el: $('.toField')
            }, {
                containerId: 'toField',
                fieldName: 'toField',
                readonly: readonly
            });
            t.fromOI = new DropButtonView({
                el: $('.fromOI')
            }, {
                containerId: 'fromOI',
                readonly: true,
                fieldName: 'fromOI'
            });
            t.fromField = new DropButtonView({
                el: $('.fromField')
            }, {
                containerId: 'fromField',
                fieldName: 'fromField',
                readonly: readonly
            });
            //关系ComboBOX
            t.relation = new DropButtonView({
                el: $('.relation')
            }, {
                containerId: 'relation',
                fieldName: 'relation',
                readonly: readonly
            });
            var defultRelation = 'otm';
            t.relation.setListData(Dictionary.RelationType, defultRelation);
            //获取下拉盒的数据
            var droupOIData = {};
            OI.oiList(function(data) {
                if (data) {
                    var list = data.currentRecords;
                    $.each(list, function(i, item) {
                        droupOIData[item['identified']] = item['name'];
                    });
                    //设置fromOI的选项和默认值
                    t.fromOI.setListData(droupOIData, t.config.fromIdentified);
                    //设置toOI的选项
                    t.toOI.setListData(droupOIData);
                    //获得toOI默认的选项
                    var toOIDefultValue = t.toOI.getValue();
                    __loadFieldData(t.toField, toOIDefultValue);
                    //获得fromOI的默认选项
                    var fromOIDefultValue = t.fromOI.getValue();
                    __loadFieldData(t.fromField, fromOIDefultValue);
                    setTimeout(__loadComboBoxFormData, 500);
                }
            });
        },
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
            if (!update) {
                new Message({
                    type: 'warn',
                    msg: '无字段更新',
                    timeout: 1500
                });
            } else if (t.verify(saveData, {
                    //skip验证的字段
                    description: true
                })) {
                var confirmContnet = '是否更新连接器?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加连接器？';
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
                                    t.config.afterAddEvent(data);
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
        //验证表单的字段是否为空
        verify: function(saveData, skip) {
            var t = this;
            skip = skip || {};
            var isPass = true;
            //验证表单上的别名是否和数据库中的数据重复
            if (t.$el.find('[fieldname="alias"]').hasClass('alert-danger')) {
                new Message({
                    type: 'error',
                    msg: '别名已重复,请重新填写',
                    timeout: 1500
                });
                isPass = false;
            }
            if (isPass) {
                //判断有没有表单是空的
                for (k in saveData) {
                    //判断这个字段是否要忽略检测
                    if (!skip[k]) {
                        if (!saveData[k]) {
                            t.$el.find('[fieldname="' + k + '"]').addClass("alert-danger");
                            isPass = false;
                        } else {
                            t.$el.find('*[fieldname="' + k + '"]').removeClass("alert-danger");
                        }
                    }
                }
                if (!isPass) {
                    new Message({
                        type: 'warn',
                        msg: '表单请填写完整',
                        timeout: 1500
                    });
                }
            }
            return isPass;
        },
        uniqueFormEvent: function() {
            var t = this;
            t.checkUnique($(e.target).val());
        },
        checkUnique: function(alias) {
            var t = this;
            var fieldName = 'alias';
            OI.connectorUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        }
    });
    return ConnectorFormView;
});