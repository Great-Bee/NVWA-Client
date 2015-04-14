define([
    'text!js/producer/template/sessionObjectForm.html',
    'js/producer/view/base_producer_form',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(formTpl, BaseProducerForm, MC, Modal, Message, DropButtonView, Dictionary, StringUtil, ConvertUtil) {
    var SessionFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keyup [fieldname="alias"]': 'uniqueAliasEvent'
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
                callbackEvent: function() {} //取消返回的event
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        requiredsError: function(fieldName) {
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
                case 'sessionKey':
                    new Message({
                        type: 'error',
                        msg: '请填写SessionKey',
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
                case 'sessionKey':
                    new Message({
                        type: 'error',
                        msg: 'SessionKey重复',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        uniqueAliasEvent: function(e) {
            var t = this;
            t.checkAliasUnique($(e.target).val());
            $nvwa.string.aliasTextVerification(e, Message);
        },
        checkAliasUnique: function(alias) {
            var fieldName = 'alias';
            MC.sessionDataBeanUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        $('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    $('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        }
    });
    return SessionFormView;
});