define([
        'backbone',

        'text!js/util/ui/template/clientEventForm.tpl',
        'text!js/util/ui/template/parametersRow.tpl',
        'js/util/api/producer',
        'js/util/api/oi',
        'js/util/api/mc',
        'js/util/ui/view/modal',
        'achy/widget/ui/message',
        'js/util/ui/view/dropButton',
        'js/util/dictionary',
        'js/util/string',
        'js/util/map',
        'js/core/element/view/scriptSelectButton'
    ],
    function(Backbone, formTpl, ParametersRowTpl, Producer, OI, MC, Modal, Message, DropButtonView, Dictionary, StringUtil, MapUtil, ScriptSelectButtonView) {
        var ClientEventFormView = Backbone.View.extend({
            events: {
                'keydown [fieldname="name"]': 'checkNameKeyUp',
                'click .btn-cancel': 'cancelFormEvent',
                'click .btn-save': 'saveFormEvent',
            },
            initialize: function(options, config) {
                var t = this;
                t.options = options;
                // t.$el = options.$el;
                config = $.extend({
                    //编辑器类型
                    type: 'form',
                    //=============form 属性=========
                    objectId: 0,
                    formType: 'add', //表单类型 add update view
                    title: '', //标题
                    showTitle: false, //是否显示标题
                    formData: null, //表单数据
                    target: null,
                    targetId: 0,
                    loadDataEvent: function() {}, //加载表单数据的event
                    saveDataEvent: function() {}, //保存表单数据的event
                    updateDataEvent: function() {}, //更新表单数据的event
                    afterUpdateEvent: function() {}, //更新之后执行的event
                    callbackEvent: function() {}, //取消返回的event
                    supportEventNames: []
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
                t.beforeLoadingData();
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
                            if (k == 'eventName') {
                                t.eventType.setListData(null, data[k]);
                            } else if (k == 'alias') {
                                t.alias.setValue(data[k]);
                                if ($nvwa.string.isVerify(data[k])) {
                                    t._loadingParameters(data[k]);
                                }
                            } else {
                                t.$el.find('[fieldname="' + k + '"]').val(data[k]);
                            }
                        }
                        t._loadingArguments();
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
            //设置下拉盒的属性
            beforeLoadingData: function() {
                var t = this;
                t._initEventNameSelectView();
                t._initScriptSelectButtonView();
            },
            _initEventNameSelectView: function() {
                var t = this;
                t.eventType = new DropButtonView({
                    el: t.$el.find('.eventName')
                }, {
                    containerId: 'eventName',
                    fieldName: 'eventName'
                });
                var ClientEventTypeData = {};
                if (t.config && t.config.supportEventNames && Dictionary.ClientEventType) {
                    ClientEventTypeData = MapUtil.filter(Dictionary.ClientEventType, t.config.supportEventNames) || {};
                }
                t.eventType.setListData(ClientEventTypeData);
            },
            _initScriptSelectButtonView: function() {
                var t = this;
                //设置脚本选择器
                t.alias = new ScriptSelectButtonView({
                    el: t.$el.find('.alias')
                }, {}, {
                    conditions: t._getScriptConditions()
                }, []);
                t.$el.find('.alias').on('selectedScript', function(e, data) {
                    if (data && $nvwa.string.isVerify(data.alias)) {
                        t._loadingParameters(data.alias);
                    }
                });
            },
            _getScriptConditions: function() {
                return [{
                    fieldName: 'type',
                    fieldValue: 'javascript'
                }];
            },
            //清空表单的数据
            initForm: function() {
                var t = this;
                t.$el.find('[fieldname="eventName"]').val('');
            },
            //读取参数
            _loadingParameters: function(alias) {
                var t = this;
                if ($nvwa.string.isVerify(alias)) {
                    //loading 参数 list
                    MC.customScriptsParametersPage(function(data) {
                        t._cleanParameters();
                        if (data && $nvwa.array.isVerify(data.currentRecords)) {
                            t._appendParameters(data.currentRecords);
                        }
                    }, {
                        page: 1,
                        pageSize: 100,
                        conditions: [{
                            fieldName: 'scriptAlias',
                            fieldValue: alias
                        }]
                    });
                }
            },
            _cleanParameters: function() {
                var t = this;
                t.$el.find('.table-parameters').find('tbody').html('');
            },
            _appendParameters: function(data) {
                var t = this;
                if ($nvwa.array.isVerify(data)) {
                    $.each(data, function(i, item) {
                        t._appendParameter(item);
                    });
                }
                t._fillingArguments();
            },
            _appendParameter: function(data) {
                var t = this;
                $(tpl(ParametersRowTpl, {
                    name: data.name,
                    alias: data.alias
                })).appendTo(t.$el.find('.table-parameters').find('tbody'));
            },
            _loadingArguments: function() {
                var t = this;
                if (t.config && t.config.formData) {
                    var data = t.config.formData;
                    data.arguments = data.arguments || '{}';
                    //string to object
                    var arguments = $nvwa.string.jsonStringToObject(data.arguments);
                    $.each(arguments, function(k, item) {
                        t.$el.find('[arguments="' + k + '"]').val(item);
                    });
                }
            },
            _fillingArguments: function() {
                var t = this;
                var argumentBoxs = t.$el.find('[arguments]');
                var argumentsJSON = t.$el.find('[fieldname="arguments"]').val() || "{}";
                var argumentsData = $nvwa.string.jsonStringToObject(argumentsJSON);
                if ($nvwa.array.isVerify(argumentBoxs)) {
                    $.each(argumentBoxs, function(i, item) {
                        var key = $(item).attr('arguments');
                        var value = argumentsData[key];
                        $(item).val(value);
                    });
                }
            },
            _argumentsToJson: function() {
                var t = this;
                var argumentBoxs = t.$el.find('[arguments]');
                var argumentsData = {};
                if ($nvwa.array.isVerify(argumentBoxs)) {
                    $.each(argumentBoxs, function(i, item) {
                        var key = $(item).attr('arguments');
                        var value = $(item).val();
                        argumentsData[key] = value;
                    });
                }
                return $nvwa.string.objectToJsonString(argumentsData);
            },
            //表单初始化
            formInitEvent: function() {
                var t = this;
                if (t.config.formType != 'add') {
                    t.$el.find('[fieldname="alias"]').attr('readonly', 'readonly');
                }
            },
            //save事件
            saveFormEvent: function() {
                var t = this;
                var config = t.config;
                t.$el.find('[fieldname="arguments"]').val(t._argumentsToJson());
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
                saveData['alias'] = t.alias.getValue();
                if (config.formType == 'update' && saveData['alias'] != config.formData['alias']) {
                    update = true;
                }
                if (update) {
                    var confirmContnet = null;
                    if (config.formType == 'add') {
                        confirmContnet = '是否添加事件？';
                        new Modal.Confirm({
                            title: '提示',
                            content: confirmContnet,
                            yes: function() {
                                config.saveDataEvent(saveData, function(data) {
                                    if (data) {
                                        if (data.ok) {
                                            //添加成功以后   
                                            t._info('更新事件成功');
                                        } else {
                                            t._error('更新事件失败');
                                            _log(data.message);
                                        }
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        });
                    } else if (config.formType == 'update') {
                        confirmContnet = '是否更新事件?';
                        new Modal.Confirm({
                            title: '提示',
                            content: confirmContnet,
                            yes: function() {
                                config.updateDataEvent(saveData, function(data) {
                                    if (data && data.ok) {
                                        if (data.ok) {
                                            //添加field成功以后                                               
                                            t._info('更新事件成功');
                                        } else {
                                            t._error('更新事件失败');
                                            _log(data.message);
                                        }
                                    }
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        });
                    }
                }
            },
            //checking name key up value
            checkNameKeyUp: function(e) {
                var t = this;
                StringUtil.nameTextVerification(e, Message);
            },
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
        return ClientEventFormView;
    });