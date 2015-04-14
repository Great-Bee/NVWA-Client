/**
 * HTTP
 * @return {[type]} [description]
 */
define([], function() {
    $nvwa.http = {
        initialize: function() {

        },
        /**
         * ajax 请求封装
         * @param  {[type]}  url     [description]
         * @param  {[type]}  data    [description]
         * @param  {[type]}  handle  [description]
         * @param  {Boolean} isJsonp [description]
         * @param  {[type]}  method  [description]
         * @param  {[type]}  async   [description]
         * @return {[type]}          [description]
         */
        request: function(url, data, handle, isJsonp, method, async) {
            //http request exception function
            var __errorException = function(responsoObject) {
                //exception object
                var exception = {
                    url: url,
                    data: data
                }
                _log('request exception!');
                if (responsoObject && responsoObject.message && responsoObject.message.length > 0) {
                    exception['message'] = responsoObject.message;
                }
                _log(exception);
            };
            var nvwaAPI = window._nvwaAPI;
            if (nvwaAPI) {
                url = nvwaAPI + url;
            }
            method = method || "GET";
            if (async == undefined) {
                async = true;
            }
            //如果http request map里存在object的对象(int string boolean以外的类型),则执行反序列化方法
            for (k in data) {
                if (typeof(data[k]) == 'object' && data[k] != null) {
                    data[k] = JSON.stringify(data[k]);
                }
            }
            var option = {
                url: url,
                // headers:
                // {
                //     "X-Requested-With": "XMLHttpRequest"
                // },
                data: data,
                success: function(resp) {
                    var obj;
                    if (typeof resp == "object") {
                        obj = resp;
                    } else {
                        try {
                            obj = eval("(" + resp + ")");
                        } catch (e) {
                            alert('ajax error url=' + url);
                        }
                    }
                    if (obj && !obj.ok && obj.message && obj.message.length > 0) {
                        //execute ok == false , log the message to console
                        __errorException(obj);
                    }
                    if (obj && !obj.ok && obj.code && obj.code == 505) {
                        //no session
                        var loginURL = 'login';
                        if (window.router) {
                            router.navigate(loginURL, {
                                trigger: true
                            });
                        }
                    } else if (handle && handle != null) {
                        //have session
                        handle(obj);
                    }
                },
                error: function(resp) {
                    // $.messager.alert('错误', 'Server出现异常，请稍后访问', 'error');
                    __errorException();
                },
                type: method
            };
            if (isJsonp) {
                option.dataType = "jsonp";
                option.jsonp = "callback";
                option.type = "GET";
            } else {
                option.dataType = "json";
            }
            return $.ajax(option);
        }
    };
    return $nvwa.http;
});