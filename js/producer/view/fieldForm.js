define([
    'text!js/producer/template/fieldForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/producer',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/util/api/oi',
    'js/util/string'
], function(formTpl, BaseProducerForm, Producer, Modal, Message, DropButtonView, Dictionary, OI, StringUtil) {
    var FieldFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keyup [fieldname="fieldName"]': 'uniqueFormEvent'
        }),
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                identified: null,
                formType: 'add', //表单类型 add update view
                title: '', //标题
                showTitle: false, //是否显示标题
                formData: null, //表单数据
                formTpl: formTpl,
                loadDataEvent: function() {}, //加载表单数据的event
                saveDataEvent: function() {}, //保存表单数据的event
                updateDataEvent: function() {}, //更新表单数据的event
                afterUpdateEvent: function() {}, //更新之后执行的event
                callbackEvent: function() {}, //取消返回的event,
                confirmAddContnet: '是否添加字段',
                confirmUpdateContnet: '是否更新字段'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
            // t.config = config;
            // t.render();
            // t.$el.find('.decimalLengthBox').hide();
            // t.formInitEvent();
            // t.reloadData();
        },
        fillFormField: function(name, value) {
            var t = this;
            if (name == 'dataTypeField' && t.dataTypeField) {
                t.dataTypeField.setListData(null, data[k]);
            } else if (name == 'notNull') {
                t.$el.find('[fieldname="' + k + '"]').prop('checked', !value);
            } else {
                t.$el.find('[fieldname="' + name + '"]').val(value);
            }
        },
        afterFillFormData: function(data) {
            var t = this;
            if (data && data['dataTypeField'] && data['dataTypeField'] == 'DOUBLE') {
                //if dataTypeField=='DOUBLE'
                t.$el.find('.decimalLengthBox').show();
            } else {
                t.$el.find('.decimalLengthBox').hide();
            }
            t.setDropList();
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {

            }
        },
        requiredsError: function(fieldName) {
            switch (fieldName) {
                case 'name':
                    new Message({
                        type: 'error',
                        msg: '请填写名称',
                        timeout: 1500
                    });
                    break;
                case 'fieldName':
                    new Message({
                        type: 'error',
                        msg: '请填写数据字段',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        uniqueError: function(fieldName) {
            switch (fieldName) {
                case 'fieldName':
                    new Message({
                        type: 'error',
                        msg: '数据字段重复',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            saveData['notNull'] = !$('[fieldname="notNull"]').prop('checked');
            saveData['isSyncSchema'] = $('#isSyncSchema').prop('checked');
            if ($nvwa.string.isVerify(t.config.identified)) {
                saveData['identified'] = t.config.identified;
            }
            return saveData;
        },
        //设置下拉盒的属性
        setDropList: function(formData) {
            var t = this;
            //容器类型下拉菜单
            t.dataTypeField = new DropButtonView({
                el: t.$el.find('.dataTypeField')
            }, {
                containerId: 'dataTypeField',
                fieldName: 'dataTypeField',
                onChangeEvent: function(data) {
                    //select change event
                    if (data && data == 'DOUBLE') {
                        t.$el.find('.decimalLengthBox').show();
                    } else {
                        t.$el.find('.decimalLengthBox').hide();
                    }
                }
            });
            var defultDataTypeField = 'VARCHAR';
            if (formData && formData['dataTypeField']) {
                defultDataTypeField = formData['dataTypeField'];
                _log('dataTypeField->' + defultDataTypeField);
            }
            t.dataTypeField.setListData(Dictionary.DataFieldType, defultDataTypeField);
        },
        createError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-添加数据字段失败',
                timeout: 1500
            });
        },
        updateError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-更新数据字段失败',
                timeout: 1500
            });
        },
        uniqueFormEvent: function() {
            var t = this;
            t.checkFieldNameUnique('fieldName', t.$el.find('[fieldname="fieldName"]'));
        },
        checkFieldNameUnique: function(fieldName, box) {
            var t = this;
            OI.fieldUnique(t.config.identified, box.val(), function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        }
    });
    return FieldFormView;
});