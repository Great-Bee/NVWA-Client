define('js/producer/view/oiForm', [
    'text!js/producer/template/oiForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/producer',
    'js/util/api/oi',
    'js/util/ui/view/modal',
    'js/bower_components/achy/message',
    'js/producer/view/field',
    'js/producer/view/connector',
    'js/producer/view/log',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(formTpl, BaseProducerForm, Producer, OI, Modal, Message, FieldView, ConnectorView, LogsGridView, Dictionary, StringUtil, ConvertUtil) {
    var OiFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keydown [fieldname="tableName"]': 'checkUniqueKeyUp',
            'keydown [fieldname="identified"]': 'checkUniqueKeyUp',
            'change [fieldname="identified"]': 'checkUniqueKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent',
            'click .btn-logs': 'openLogModal',
            'click .btn-connectorSettings': 'openConnecterModal',
            'click .btn-fieldSettings': 'openFieldModal'
        }),
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                formType: 'add', //表单类型 add update view
                title: 'this is a form', //标题
                showTitle: false, //是否显示标题
                formData: null, //表单数据
                formTpl: formTpl,
                loadDataEvent: null, //加载表单数据的event
                saveDataEvent: null, //保存表单数据的event
                updateDataEvent: null, //更新表单数据的event
                confirmAddContnet: '是否添加存储',
                confirmUpdateContnet: '是否更新存储'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                //add mode
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="identified"]'));
            } else {
                //如果不是添加模式,tableName和identified的输入框变成只读属性
                t.$el.find('[fieldname="tableName"]').attr('readonly', 'readonly');
                t.$el.find('[fieldname="identified"]').attr('readonly', 'readonly');
            }
        },
        fillFormField: function(name, value) {
            var t = this;
            if (name == 'status') {
                t.$el.find('[fieldname="status"]').val(Dictionary.OIStatus[value]);
            } else {
                t.$el.find('[fieldname="' + name + '"]').val(value);
            }

        },
        requiredsError: function(fieldName) {
            switch (fieldName) {
                case 'name':
                    new Message({
                        type: 'error',
                        msg: '请填写存储名称',
                        timeout: 1500
                    });
                    break;
                case 'identified':
                    new Message({
                        type: 'error',
                        msg: '请填写Identified',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        uniqueError: function(fieldName) {
            switch (fieldName) {
                case 'tableName':
                    new Message({
                        type: 'error',
                        msg: '数据库表名重复',
                        timeout: 1500
                    });
                    break;
                case 'identified':
                    new Message({
                        type: 'error',
                        msg: 'Identified重复',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            var isSync = $('#isSyncSchema').prop('checked');
            if (isSync) {
                saveData['isSyncSchema'] = true;
            }
            return saveData;
        },
        createSuccess: function(saveData) {
            var url = '#oi/update/' + saveData['id'];
            this.options.routes.navigate(url, {
                trigger: true
            });
        },
        createError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-添加存储失败',
                timeout: 1500
            });
        },
        updateSuccess: function(saveData) {
            var url = '#oi';
            this.options.routes.navigate(url, {
                trigger: true
            });
        },
        updateError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-更新存储失败',
                timeout: 1500
            });
        },
        checkUniqueKeyUp: function(e) {
            var t = this;
            var target = $(e.target);
            setTimeout(function() {
                //get target input text
                var value = target.val();
                var fieldname = target.attr('fieldname');
                if (value) {
                    if (value.length < 16) {
                        //verification
                        if (StringUtil.oiStringVerification(value)) {
                            //check Unique
                            t.checkFieldUnique(fieldname, target);
                            t.$el.find('[fieldname="' + fieldname + '"]').removeClass('alert-danger');
                        } else {
                            t.$el.find('[fieldname="' + fieldname + '"]').addClass("alert-danger");
                            new Message({
                                type: 'error',
                                msg: '请不要填写中文和特殊符号!',
                                timeout: 1500
                            });
                        }
                    } else {
                        t.$el.find('[fieldname="' + fieldname + '"]').addClass("alert-danger");
                        new Message({
                            type: 'error',
                            msg: '请控制输入的内容在16个字符以内!'
                        });
                    }
                }
            }, 50);
        },
        checkFieldUnique: function(fieldName, box) {
            var t = this;
            var identified = '';
            var tablename = '';
            if (fieldName == 'identified') {
                identified = box.val();
            } else if (fieldName == 'tableName') {
                tablename = box.val();
            }
            if ((identified && identified.length > 0) || (tablename && tablename.length > 0)) {
                OI.oiUnique(identified, tablename, function(response) {
                    if (response && !response.ok) {
                        if (response.dataMap && response.dataMap.fieldName) {
                            t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                        }
                    } else {
                        t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                    }
                });
            }
        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        },
        openFieldModal: function() {
            var t = this;
            t.fildSettings = [];
            t.fildSettings.container = $('<div></div>');
            t.fildSettings.dialog = new Modal({
                title: '字段设置',
                content: t.fildSettings.container
            });
            t.fieldGrid = new FieldView({
                el: t.fildSettings.container
            }, {
                conditions: [{
                    fieldName: 'oiIdentified',
                    fieldValue: t.config.formData['identified']
                }],
                identified: t.config.formData['identified']
            });
        },
        openConnecterModal: function() {
            var t = this;
            t.connectorSettings = [];
            t.connectorSettings.container = $('<div></div>');
            t.connectorSettings.dialog = new Modal({
                title: '连接器设置',
                content: t.connectorSettings.container
            });
            t.connectorGrid = new ConnectorView({
                el: t.connectorSettings.container
            }, {
                conditions: [{
                    fieldName: 'fromOI',
                    fieldValue: t.config.formData['identified']
                }],
                fromIdentified: t.config.formData['identified']
            });
        },
        openLogModal: function() {
            var t = this;
            t.logs = [];
            t.logs.container = $('<div></div>');
            t.logs.dialog = new Modal({
                title: '日志',
                content: t.logs.container
            });

            t.logsGrid = new LogsGridView({
                el: t.logs.container
            }, {
                conditions: [{
                    fieldName: 'logIdentified',
                    fieldValue: t.config.formData['identified']
                }],
                fromIdentified: t.config.formData['identified']
            });
        }

    });
    return OiFormView;
});