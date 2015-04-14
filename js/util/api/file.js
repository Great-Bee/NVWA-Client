/**
 * File
 */
define(['js/util/http', 'js/util/api/producer'], function(http, Producer) {
    var DEFAULT_INDEX = 'id';
    var _basePath = '/nvwaFile';
    var File = {
        //execute response object
        _executeResponse: function(response, success, error) {
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
        },
        //import file data
        importFileData: function(pageAlias, containerAlias, storeName, success, error) {
            var t = this;
            var url = _basePath + '/importData';
            var data = {
                storeName: storeName,
                containerAlias: containerAlias,
                pageAlias: pageAlias
            };
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        },
        exportFileData: function(pageAlias, containerAlias, success, error) {
            var t = this;
            var url = _basePath + '/exportData';
            var data = {
                containerAlias: containerAlias,
                pageAlias: pageAlias
            };
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        },
        downloadImportTemplate: function(pageAlias, containerAlias, success, error) {
            var t = this;
            var url = _basePath + '/downloadTemplate';
            var data = {
                containerAlias: containerAlias,
                pageAlias: pageAlias
            };
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        }
    };
    return File;
});