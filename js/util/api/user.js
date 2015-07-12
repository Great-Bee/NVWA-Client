/**
 * User
 * @return {[type]} [description]
 */
define('js/util/api/user', ['js/util/http'], function(http) {
    var User = {
        initialize: function() {},

        //user login
        userLogin: function(loginName, password, handler) {
            var url = '';
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
            var url = '';
            var data = {
                registerEmail: registerEmail,
                password: password
            }
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    hander(response);
                }
            }, false, 'POST', false);
        }
    };
    return User;
});