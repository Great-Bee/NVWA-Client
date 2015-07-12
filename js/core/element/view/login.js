define('js/core/element/view/login', [

    'js/core/element/view/base_element',
    'js/util/string',
    'js/util/api/producer',
    'js/util/ui/view/cover',
    'text!js/core/element/template/login.tpl'
], function(BaseElementView, StringUtil, Producer, Cover, TextTpl) {
    var LoginView = BaseElementView.extend({
        events: {
            "click .btn-login": "login"
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                //是否禁用
                disabled: false,
                //是否只读
                readonly: false,
                type: 'login',
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
        //登录
        login: function() {
            var t = this;
            t.resetAlertLabel();
            _log('login event');
            var login_name = t.$el.find('[fieldName="login_name"]').val();
            var password = t.$el.find('[fieldName="password"]').val();
            //check the form value if it's null
            if (!login_name || login_name.length <= 0) {
                _log('login_name=' + login_name);
                t.$el.trigger('error', ['login_name is null.login false']);
            } else if (!password || password.length <= 0) {
                _log('password=' + password);
                t.$el.trigger('error', ['password is null.login false']);
            } else {
                //do login
                t.cover = new Cover({
                    el: $(document.body)
                }, {
                    text: '正在登陆......'
                });
                t.cover.show();
                Producer.producerLogin(login_name, password, function(data) {
                    t.cover.hiden();
                    if (data && data.ok) {
                        t.$el.trigger('success');
                    } else {
                        t.$el.trigger('error', [data.message]);
                    }
                });
            }
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
    return LoginView;
});