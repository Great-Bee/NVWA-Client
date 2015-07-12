/**
 * Producer
 * @return {[type]} [description]
 */
define('js/util/api/producer', ['js/util/http'], function(http) {
    var DEFAULT_INDEX = 'id';
    var Producer = {
        initialize: function() {},
        //用于page的request公用请求再封装了一层
        pageRequest: function(url, data, handler) {
            //默认分页参数
            var defaultData = {
                page: 1,
                pageSize: 20,
                orderName: 'id',
                order: 'desc'
            };
            data = $.extend(defaultData, data);
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.page_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.page_data);
                        }
                    } else if (response.dataMap && response.dataMap.data_list) {
                        //请求ok
                        var data_list = {
                            currentRecords: response.dataMap.data_list
                        }
                        if (handler != null) {
                            handler(data_list);
                        }
                    } else {
                        _log('该类型此接口不兼容');
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /*同步OI到Schema*/
        syncOItoSchema: function(oi, handler) {
            if (oi && oi[DEFAULT_INDEX]) {
                var syncOiId = oi[DEFAULT_INDEX];
                var url = '/nvwa/sync_oi';
                var data = {
                    id: syncOiId,
                    type: 'create'
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*同步Schema到OI*/
        syncSchemaToOI: function(handler) {
            var url = '/nvwa/build_all_oi';
            var data = {};
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //login
        producerLogin: function(loginName, password, handler) {
            var url = '/nvwaSecurity/login';
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
        //Check Login
        checkLogin: function(handler) {
            var url = '/nvwaSecurity/check';
            http.request(url, {}, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        producerPasswordEdit: function(old_pwd, new_pwd, handler) {
            var url = '/nvwaSecurity/passwordEdit';
            var data = {
                oldPassword: old_pwd,
                newPassword: new_pwd
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        }
    };
    return Producer;
});