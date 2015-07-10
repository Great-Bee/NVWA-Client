define([
    'text!js/producer/template/pageObjectForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/producer',
    'js/util/ui/view/modal',
    'js/util/api/mc',
    'achy/widget/ui/message',
    'js/util/string'
], function(formTpl, BaseProducerForm, Producer, Modal, MC, Message, StringUtil) {
    var PageObjectFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keydown [fieldname="alias"]': 'uniqueFormEvent',
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
                },
                config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
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
            MC.pageObjectUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                        return false;
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                    return true;
                }
            });
        },
    });
    return PageObjectFormView;
});