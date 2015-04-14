/**
 * nvwaUser
 */
define([
    'js/util/http',
    'js/util/api/producer'
], function(http, Producer) {
    var DEFAULT_INDEX = 'id';
    var _basePath = '/nvwaUser';
    var _previewPageAlias = 'preview';
    var nvwaUserApi = {
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
        /**
         * 读取OI列表
         */
        nvwaPage: function(handler, config) {
            config['pageAlias'] = config['pageAlias'] || _previewPageAlias;
            if (config['container'] && config['container'].length > 0) {
                var url = '/page/' + config['pageAlias'] + '/' + config['container'];
                var data = {
                    pagination_page: config['page']
                };
                //setting search bean
                if (config['searchBean'] && config['searchBean'].length > 0) {
                    data['condition_list'] = config['searchBean'];
                }
                Producer.pageRequest(_basePath + url, data, handler);
            }
        },
        /**
         *读取tree的数据
         */
        nvwaTree: function(pageAlias, container, success, error) {
            var t = this;
            if (!$nvwa.string.isVerify(pageAlias)) {
                if (error) {
                    error(null, '请输入pageAlias');
                }
            } else if (!$nvwa.string.isVerify(container)) {
                if (error) {
                    error(null, '请输入containerAlias');
                }
            } else {
                var url = '/page/' + pageAlias + '/' + container;
                http.request(_basePath + url, {}, function(response) {
                    //返回的http请求数据
                    t._executeResponse(response, success, error);
                }, false, 'POST', false);
            }
        },
        /**
         * 删除container的数据
         */
        deleteById: function(page, container, id, success, error) {
            var t = this;
            page = page || _previewPageAlias;
            //组装url
            var url = '/delete/' + page + '/' + container + '/' + id;
            //组装post的数据
            var data = {};
            //发送http psot请求
            http.request(_basePath + url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        },
        /*
         *read data by id
         */
        readById: function(page, container, id, success, error) {
            var t = this;
            page = page || _previewPageAlias;
            //组装url /nvwaUser/read/${page}/${container}/${id}
            var url = '/read/' + page + '/' + container + '/' + id;
            //组装post的数据
            var data = {};
            //发送http psot请求
            http.request(_basePath + url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        },
        //create object into database
        create: function(page, container, formObject, success, error) {
            var t = this;
            page = page || _previewPageAlias;
            var url = '/create/' + page + '/' + container;
            var data = {
                form_list: JSON.stringify(formObject)
            };
            http.request(_basePath + url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        },
        //update object in database by id
        updateById: function(page, container, id, formObject, success, error) {
            var t = this;
            page = page || _previewPageAlias;
            var url = '/update/' + page + '/' + container + '/' + id;
            var data = {
                form_list: JSON.stringify(formObject)
            };
            http.request(_basePath + url, data, function(response) {
                //返回的http请求数据
                t._executeResponse(response, success, error);
            }, false, 'POST', false);
        }

    };
    return nvwaUserApi;
});