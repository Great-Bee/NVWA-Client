define([
    'text!js/producer/template/customScriptsParametersForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/core/element/view/code',
    'js/util/string',
    'js/util/convert',
    'js/producer/view/customScriptsParameters',
], function(formTpl, BaseProducerForm, MC, Modal, Message, DropButtonView, Dictionary, CodeEditorView, StringUtil, ConvertUtil, CustomScriptsParametersView) {
    var CustomScriptsFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keydown [fieldname="alias"]': 'uniqueFormEvent',
            'click .btnParametersSettings': '_clickBtnParametersSettings'
        }),
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
                formTpl: formTpl,
                loadDataEvent: function() {}, //加载表单数据的event
                saveDataEvent: function() {}, //保存表单数据的event
                updateDataEvent: function() {}, //更新表单数据的event
                afterUpdateEvent: function() {}, //更新之后执行的event
                callbackEvent: function() {}, //取消返回的event
                uniqueEvent: function() {}, //确定唯一性的event
                confirmAddContnet: '是否添加自定义脚本参数',
                confirmUpdateContnet: '是否更新自定义脚本参数'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        _clickBtnParametersSettings: function() {
            var t = this;
            t.parametersDialog = {};
            t.parametersDialog.container = $('<div></div>');
            t.parametersDialog.dialog = new Modal({
                title: '参数设置',
                content: t.parametersDialog.container
            });
            t.parametersView = new CustomScriptsParametersView({
                el: t.parametersDialog.container
            }, {});
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        fillFormField: function(name, value) {
            var t = this;
            t.$el.find('[fieldname="' + name + '"]').val(value);
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            saveData['scriptAlias'] = t.config.scriptAlias;
            return saveData;
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
        },
        uniqueError: function(fieldName) {
            switch (fieldName) {
                case 'alias':
                    new Message({
                        type: 'error',
                        msg: '别名重复',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        createSuccess: function(saveData) {
            //添加field成功以后   
            new Message({
                type: 'info',
                msg: '添加自定义脚本参数成功',
                timeout: 1500
            });
        },
        createError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-添加自定义脚本参数失败',
                timeout: 1500
            });
        },
        updateSuccess: function(saveData) {
            //添加成功以后   
            new Message({
                type: 'info',
                msg: '更新自定义脚本参数成功',
                timeout: 1500
            });
        },
        updateError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-更新自定义脚本参数失败',
                timeout: 1500
            });
        },
        uniqueFormEvent: function(e) {
            var t = this;
            setTimeout(function() {
                t.checkAliasUnique($(e.target).val());
                $nvwa.string.aliasTextVerification(e, Message);
            }, 50);
        },
        checkAliasUnique: function(alias) {
            var t = this;
            var fieldName = 'alias';
            t.config.uniqueEvent(alias, function(response) {
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
    return CustomScriptsFormView;
});