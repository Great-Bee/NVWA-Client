define('js/core/element/view/upload', [

    'js/core/element/view/base_element',
    'text!js/core/element/template/upload.tpl',
    'text!js/core/element/template/uploadItem.tpl',
    'js/bower_components/jQuery-File-Upload/js/jquery.fileupload',
 //   'text!bower_components/jQuery-File-Upload/css/jquery.fileupload.css'
], function(BaseElementView, UploadTpl, UploadItemTpl) {
    var UploadView = BaseElementView.extend({
        events: {
            "click .btn-danger": "_delete"
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            var addCss = function(cssurl) {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = cssurl;
                document.getElementsByTagName("head")[0].appendChild(link);
            }
            addCss('js/bower_components/jQuery-File-Upload/css/jquery.fileupload.css');
            this.defaultAttributes = {
                multi: false
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
        },
        render: function() {
            this.$el.html(tpl(UploadTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            this._initControl();
            return this;
        },
        _initControl: function() {
            var t = this;
            var url = _nvwaAPI + window.nvwaClientApi.upload();
            t.$el.find('.fileupload').fileupload({
                    url: url,
                    dataType: 'json',
                    done: function(e, data) { //上传完成以后的回调
                        var response = data.result;
                        if (response && response.ok && response.dataMap && $nvwa.array.isVerify(response.dataMap.storages)) {
                            t._appendItems(response.dataMap.storages);
                        }
                    },
                    progressall: function(e, data) { //进度条
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        t.$el.find('.progress-bar').css(
                            'width',
                            progress + '%'
                        );
                    }
                }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        _appendItems: function(data) {
            var t = this;
            if ($nvwa.array.isVerify(data)) {
                $.each(data, function(i, item) {
                    $(tpl(UploadItemTpl, {
                        url: _nvwaAPI + window.nvwaClientApi.download() + '/' + item.storeName,
                        text: item.storeName
                    })).appendTo(t.$el.find('.upload-files'));
                });
                t._reloadValue();
            }
        },
        //delete event
        _delete: function(e) {
            var t = this;
            var storeName = $(e.target).parent().parent().children('.storeName').html() ||
                $(e.target).parent().parent().parent().children('.storeName').html();
            storeName = storeName.trim();
            if ($nvwa.string.isVerify(storeName)) {
                var storeItems = t.$el.find('[storename]');
                $.each(storeItems, function(i, item) {
                    if ($(item).attr('storename') == storeName) {
                        $(item).remove();
                        t._reloadValue();
                    }
                });
            }
        },
        _reloadValue: function() {
            var t = this;
            var storeItems = t.$el.find('[storename]');
            t.values = [];
            $.each(storeItems, function(i, item) {
                var v = $(item).attr('storename');
                if ($nvwa.string.isVerify(v)) {
                    t.values.push(v);
                }
            });
        },
        //支持的客户端属性
        supportAttribute: function() {
            return [];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
        },
        //支持的服务器事件
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        //设置值
        setValue: function(value) {
            var t = this;
            if ($nvwa.string.isVerify(value)) {
                t.values = value.split(',');
                t._appendItems(t.values);
            }
        },
        //取值
        getValue: function() {
            var t = this;
            if ($nvwa.array.isVerify(t.values)) {
                return t.values.toString();
            } else {
                return null;
            }
        }
    });
    return UploadView;
});