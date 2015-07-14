define('js/util/ui/view/modal', [
    'lodash','bootstrapjs','bootstrap.modal'
], function(_) {
    'use strict';

    var Modal, defaults;

    defaults = {
        title: '',
        content: ''
    };

    Modal = function(options) {
        var wrapper, Tpl, _this, content;
        _this = this;

        options = _.extend({}, defaults, options);
        Tpl = '<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button><h4 class="modal-title"></h4></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>';
        wrapper = $(Tpl);
        this.body = wrapper.find('.modal-body');
        this.title = wrapper.find('.modal-title');
        this.footer = wrapper.find('.modal-footer');
        if (options.content) {
            if (_.isFunction(options.content)) {
                content = options.content();
            } else {
                content = options.content;
            }
            this.body.append(content);
        }
        if (options.title) {
            this.title.html(options.title);
        }
        if (options.width) {
            wrapper.find('.modal-dialog').css('width', options.width);
        }
        $(document.body).append(wrapper);
        this.$el = wrapper;
        this.$el.modal(options);
        this.$el.on('hidden.bs.modal', function(e) {
            //隐藏完毕以后销毁
            _this.destroy();
            _log('hide destroy');
        });
        this.show();
        return this;
    };

    Modal.prototype.show = function() {
        this.$el.modal('show');
    };

    Modal.prototype.hide = function() {
        this.$el.modal('hide');
    };

    Modal.prototype.destroy = function() {
        this.hide();
        this.$el.remove();
        _log('Modal destroy');
    };

    Modal.Confirm = function(options) {
        options = _.defaults(options || {}, {
            backdrop: 'static',
            positive: '是',
            negtive: '否',
            afterClose: function() {}
        });

        var modal = new Modal(options);
        modal.footer.append('<button class="btn btn-default negtive">' + options.negtive + '</button><button class="btn btn-primary positive">' + options.positive + '</button>');

        modal.$el.on('click', '.positive', function(e) {
            if (options.yes) {
                options.yes();
            }
            modal.hide();
            e.preventDefault();
            options.afterClose();
        }).on('click', '.negtive, .close', function(e) {
            if (options.no) {
                options.no();
            }
            modal.hide();
            e.preventDefault();
            options.afterClose();
        });
        return modal;
    };

    Modal.Alert = function(options) {
        options = _.defaults(options || {}, {
            OK: '确认'
        });

        var modal = new Modal(options);

        modal.footer.append('<button class="btn btn-primary" data-dismiss="modal">' + options.OK + '</button>');
    };

    Modal.Prompt = function(options) {
        options = _.defaults(options || {}, {
            OK: '确认',
            placeholder: ''
        });

        var modal = new Modal(options);

        modal.body.append('<input class="text form-control" type="text" placeholder="' + options.placeholder + '">');

        modal.footer.append('<button class="btn btn-primary" data-dismiss="modal">' + options.OK + '</button>');

        modal.$el.on('click', '.btn-primary', function(e) {
            if (options.val) {
                options.val(modal.$el.find('.text').val());
            }
            e.preventDefault();
        });
    };
    return Modal;
});