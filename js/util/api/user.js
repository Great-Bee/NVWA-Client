/**
 * User
 * @return {[type]} [description]
 */
define('js/util/api/user', ['js/util/http'], function(http) {
    var User = {
        initialize: function() {},

        //user login
        userLogin: function(loginName, password, handler) {
            var url = '/nvwaUser/security/login';
            var data = {
                loginName: loginName,
                password: password
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },

        //user register
        userRegister: function(registerEmail, password, handler) {
            var url = '/nvwaUser/security/register';
            var data = {
                registerEmail: registerEmail,
                password: password
            }
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    hander(response);
                }
            }, false, 'POST', false);
        },

        //Page 布局
        pageLayout: function(page, handler) {
            var url = '/nvwaUser/layout/' + page;
            var data = {};
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        }

    };
    return User;
});