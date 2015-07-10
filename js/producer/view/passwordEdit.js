define([

    'js/core/element/view/base_element',
    'js/util/string',
    'js/util/api/producer',
    'js/util/ui/view/cover',
    'text!js/producer/template/passwordEdit.tpl'
], function(BaseElementView, StringUtil, Producer, Cover, TextTpl) {
    var PasswordEditView = BaseElementView.extend({
        events: {
            "click .btn-passwordEdit": "passwordEdit",
            "click .btn-passwordEdit-cancel": "passwordEditCancel"
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                //是否禁用
                disabled: false,
                //是否只读
                readonly: false,
                type: 'passwordEdit',
                //Feedback
                feedback: null
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
            this.initListener();
        },
        //监听器
        initListener: function() {
            var t = this;
            t.$el.on('error', function(e, msg) {
                _log(msg);
                t.setAlertLabel(msg);
            });
            t.$el.on('success', function(e) {
                _log('success');
                var url = 'index';
                router.navigate(url, {
                    trigger: true
                });
            });
        },
        //修改密码
        passwordEdit: function() {
            var t = this;
            t.resetAlertLabel();
            _log('passwordEdit event');
            var old_pwd = t.$el.find('#inputOldPassword').val();
            var new_pwd = t.$el.find('#inputPassword').val();
            var new_pwd2 = t.$el.find('#inputPassword2').val();

            //check the form value if it's null
            if (!old_pwd || old_pwd.length <= 0) {
                _log('old_pwd=' + old_pwd);
                t.$el.trigger('error', ['old_pwd is null.passwordEdit false']);
            } else if (!new_pwd || new_pwd.length <= 0) {
                _log('new_pwd=' + new_pwd);
                t.$el.trigger('error', ['new_pwd is null.passwordEdit false']);
            } else if (!new_pwd2 || new_pwd2.length <= 0) {
                _log('new_pwd2=' + new_pwd2);
                t.$el.trigger('error', ['new_pwd2 is null.passwordEdit false']);
            } else if (new_pwd != new_pwd2) {
                _log('new_pwd!=new_pwd2->new_pwd=' + new_pwd + 'new_pwd2=' + new_pwd2);
                t.$el.trigger('error', ['new_pwd not equire new_pwd2.passwordEdit false']);
            } else {
                //do login
                t.cover = new Cover({
                    el: $(document.body)
                }, {
                    text: '正在修改密码......'
                });
                t.cover.show();
                Producer.producerPasswordEdit(old_pwd, new_pwd, function(data) {
                    t.cover.hiden();
                    if (data && data.ok) {
                        t.$el.trigger('success');
                    } else {
                        t.$el.trigger('error', [data.message]);
                    }
                });
            }
        },
        //取消修改
        passwordEditCancel: function() {
            var t = this;
            t.resetAlertLabel();
            _log('passwordEditCancel event');
            var url = 'index';
            router.navigate(url, {
                trigger: true
            });
        },
        //显示错误信息到警告框
        setAlertLabel: function(msg) {
            var t = this;
            var alertLabel = t.$el.find('.alert-label');
            alertLabel.html(msg);
            alertLabel.removeClass('hidden');
        },
        //重置警告框
        resetAlertLabel: function() {
            var t = this;
            var alertLabel = t.$el.find('.alert-label');
            if (!alertLabel.hasClass('hidden')) {
                alertLabel.addClass('hidden');
            }
        },
        render: function() {
            this.$el.html(tpl(TextTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        supportAttribute: function() {
            return ['disabled', 'readonly'];
        },
        supportEventNames: function() {
            return [];
        },
        supportServerEventNames: function() {
            return [];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var editor = t.$el.find('input');
            switch (attributeName) {

                case 'disabled':
                    break;
                case 'readonly':
                    break;
                default:
                    return;
            }
        }
    });
    return PasswordEditView;
});