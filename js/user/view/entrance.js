    /**
     * User Login View
     *
     */

    define('js/user/view/entrance', [
        'js/core/element/view/base_element',
        'js/util/api/user',
        'text!js/user/template/entrance.tpl',
        'css!js/bower_components/user-login/css/bootstrap',
        'css!js/bower_components/user-login/css/bootstrap-responsive',
        'css!js/bower_components/user-login/css/user-login',
        'js/bower_components/jquery/dist/jquery',
    ], function(BaseElementView, User, EntranceTpl) {
        var UserLoginView = BaseElementView.extend({

            events: {
                "click #btnLogin": "login",
                "click #btnRegister": "register",
                "click #btnRecoverAccount": "recover_account"
            },

            //initialize
            initialize: function() {
                this.initListener();
            },

            initListener: function() {
                var t = this;
                t.$el.on("success", function(e, msg) {
                    router.navigate("index", {
                        trigger: true
                    });
                });
                t.$el.on("error", function(e, msg) {
                    t.setAlertLabel(msg);
                });
                t.$el.on("register_success", function(e, msg) {
                    router.navigate("index", {
                        trigger: true
                    });
                });
                t.$el.on("register_error", function(e, msg) {
                    t.setRegisterAlertLabel(msg);
                });
            },

            render: function() {
                this.$el.html(_.template(EntranceTpl));
                return this;
            },

            //login action
            login: function() {
                var t = this;
                t.resetAlertLabel();
                _log('login event');
                var login_acount = t.$el.find("[name='account']").val();
                var password = t.$el.find("[name='password']").val();
                if (!login_acount || login_acount.length <= 0) {
                    t.$el.trigger('error', ['login_acount is null.login false']);
                } else if (!password || password.length <= 0) {
                    t.$el.trigger('error', ['password is null.login false']);
                } else {
                    //do login
                    User.userLogin(login_acount, password, function(data) {
                        if (data && data.ok) {
                            t.$el.trigger('success');
                        } else {
                            t.$el.trigger('error', [data.message]);
                        }
                    });
                }
            },

            //register action
            register: function() {
                var t = this;
                _log('register event');
                t.resetAlertLabel();
                var register_email = t.$el.find("[name='email']").val();
                var register_password = t.$el.find("[name='pd']").val();
                var register_confirm_password = t.$el.find("[name='password_again']").val();
                if (!register_email || register_email.length <= 0) {
                    t.$el.trigger('register_error', ['email is null. register false']);
                } else if (!register_password || register_password.length <= 0) {
                    t.$el.trigger('register_error', ['password is null. register false']);
                } else if (register_confirm_password != register_password) {
                    t.$el.trigger('register_error', ['confirm password is error. register false']);
                } else {
                    User.userRegister(register_email, register_password, function(data) {
                        if (data && data.ok) {
                            t.$el.trigger('register_success');
                        } else {
                            t.$el.trigger('register_error', [data.message]);
                        }
                    });
                }
            },

            //recover account
            recover_account: function() {
                router.navigate("error", {
                    trigger: true
                });
                //var t = this;
                //var popupWindow = t.$el.find('#modal-recover');
                //popupWindow.removeClass('hidden');alert(321);
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
            //show error message in the register block
            setRegisterAlertLabel: function(msg) {
                var t = this;
                var alertLabel = t.$el.find('.register-alert-label');
                alertLabel.html(msg);
                alertLabel.removeClass('hidden');
            },
            //reset the error message block
            resetRegisterAlertLabel: function() {
                var t = this;
                var alertLabel = t.$el.find('.register-alert-label');
                if (!alertLabel.hasClass('hidden')) {
                    alertLabel.addClass('hidden');
                }
            }

        });
        return UserLoginView;
    });