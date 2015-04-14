/**
 * API HOME
 * 提供给客户端使用的各种远程接口的api函数
 * @return {[type]} [description]
 */
define([], function() {
    var ApiHome = {
        //保存表单
        updateForm: function(pageAlias, containerAlias, objectId) {
            return '/nvwaUser/update/' + pageAlias + '/' + containerAlias + '/' + objectId;
        },
        createForm: function(pageAlias, containerAlias) {
            return '/nvwaUser/create/' + pageAlias + '/' + containerAlias;
        },
        upload: function() {
            return '/nvwaFile/upload';
        },
        download: function() {
            return '/nvwaFile/download';
        },
        downloadTemp: function() {
            return '/nvwaFile/downloadTemp';
        }

    };
    window.nvwaClientApi = ApiHome;
});