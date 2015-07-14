define('js/producer/view/reservedSelection', [
        'backbone',

        'text!js/producer/template/reservedSelection.tpl',
        'js/util/ui/view/modal',
        'js/bower_components/achy/message',
    ],
    function(Backbone, ReservedSelectionTpl, Modal, Message) {
        var reservedSelectionView = Backbone.View.extend({
            events: {
                'click button': 'buttonClickEvent'
            },
            /**
             * 初始化
             * @param  {[type]} options [description]
             * @param  {[type]} config  [description]
             * @return {[type]}         [description]
             */
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    title: '保留字',
                    reserveds: [],
                    selectEvent: function(selection) {} //选择触发的事件
                }, config);
                t.config = config;
                t.options = options;
                t.render();
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function() {
                var t = this;
                t.$el.html(tpl(ReservedSelectionTpl, {
                    options: t.options,
                    config: t.config
                }));
                return t;
            },
            buttonClickEvent: function(e) {
                var t = this;
                var selectButton = $(e.target);
                var fieldName = selectButton.attr('fieldName');
                var selectIndex = selectButton.attr('selectIndex');
                _log(selectIndex);
                var selectObject = t.config.reserveds[selectIndex];
                var name = selectObject["name"];
                new Modal.Confirm({
                    title: '添加保留字',
                    content: '是否添加保留字 ' + name,
                    yes: function() {
                        var attributes = t.config.reserveds[selectIndex]['attributesObject'];
                        if (attributes && attributes['name'] && attributes['fieldName']) {
                            var defultAttributes = {
                                notNull: false,
                                dataTypeField: 'VARCHAR'
                            };
                            attributes = $.extend(defultAttributes, attributes);
                            if (t.config && t.config.selectEvent) {
                                t.config.selectEvent(selectObject);
                            }
                        } else {
                            new Message({
                                type: 'error',
                                msg: '保留字属性无效',
                                timeout: 1500
                            });
                        }
                    },
                    no: function() {}
                });
            },
            disable: function(fieldName) {
                var t = this;
                t.$el.find('[fieldName="' + fieldName + '"]').addClass('disabled');
            }
        });
        return reservedSelectionView;
    });