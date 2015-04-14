/**
 * Util
 * @return {[type]} [description]
 */
define(['js/util/http'], function(http) {
    var DEFAULT_INDEX = 'id';
    var Producer = {
        initialize: function() {},
        /*同步OI到Schema*/
        toPinyin: function(string, success, error) {
            if (string) {
                var url = '/nvwa/stringToPinyin';
                var data = {
                    str: string
                };
                http.request(url, data, function(response) {
                    if (response && response.ok) {
                        if (success) {
                            //return success function
                            success(response.dataMap);
                        }
                    } else {
                        if (error) {
                            //return error function
                            error(response.code, response.message);
                        }
                    }
                }, false, 'POST', false);
            }
        }
    };
    return Producer;
});