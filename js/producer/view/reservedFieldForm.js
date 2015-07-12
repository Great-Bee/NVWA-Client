define('js/producer/view/reservedFieldForm', [
    'text!js/producer/template/reservedFieldForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/producer',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/string'
], function(formTpl, BaseProducerForm, Producer, Modal, Message, StringUtil) {
    var ReservedFieldFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {}),
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
                confirmAddContnet: '是否添加保留字段',
                confirmUpdateContnet: '是否更新保留字段'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
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
                default:
                    break;
            }
        }
    });
    return ReservedFieldFormView;
});