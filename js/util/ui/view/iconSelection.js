/**
 *search 组件
 **/
define('js/util/ui/view/iconSelection', [
        'backbone',

        'text!js/util/ui/template/iconSelection.tpl',
        'text!js/util/ui/template/iconSelectionBody.tpl',
        'achy/widget/ui/message',
        'js/util/ui/view/modal'
    ],
    function(Backbone, IconSelectionTpl, IconSelectionBodyTpl, Message, Modal) {
        var IconSelectionView = Backbone.View.extend({
            events: {
                'click .btn-iconSelection': 'onSelect',
                'click .btn-iconSelection-openPanel': 'openPanel'
            },
            /**
             * 初始化
             * @param  {[type]} options [description]
             * @param  {[type]} config  [description]
             * @return {[type]}         [description]
             */
            initialize: function(options, config, events) {
                var t = this;
                config = $.extend({
                        containerId: null,
                        fieldName: 'icon',
                        loadButton: function(toolBar, grid) {},
                        loadData: function() {},
                        labelWidth: 4,
                        btnWidth: 8,
                        data: null,
                        conditions: [], //log conditions                        
                        padding: 0
                    },
                    config);
                t.eves = $.extend({
                    onSelect: function(iconAlias) {

                    }
                }, events);
                t.config = config;
                t.options = options;
                t.beforeRender();
                t.render();
                t.afterRender();
                t.bindEvent();
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function() {
                var t = this;
                // t.$el.append();
                var element = $(tpl(IconSelectionTpl, {
                    options: t.options,
                    config: t.config,
                    data: t.config.data
                })).appendTo(t.$el);
                return t;
            },
            beforeRender: function() {
                var t = this;
                t.loadData();
            },
            afterRender: function() {
                var t = this;
            },
            bindEvent: function() {
                var t = this;

            },
            loadData: function() {
                var t = this;
                t.config.loadData(function(data) {
                    t.config['data'] = data['currentRecords'];
                    _log('load it!');
                });
            },
            openPanel: function(e) {
                var t = this;
                _log('open panel');
                var onSelect = function(e) {
                    var name = $(e.target).attr('title');
                    var icon = $(e.target).attr('alias');
                    t.$el.find('b').html(name);
                    t.setValue(icon);
                    t.viewDialog.dialog.hide();
                    t.eves.onSelect(icon);
                };
                if (t.config['data']) {
                    t.viewDialog = {};
                    t.viewDialog.container = $('<div></div>');
                    t.selectionTreeView = $(tpl(IconSelectionBodyTpl, {
                        options: t.options,
                        config: t.config,
                        data: t.config.data
                    })).appendTo(t.viewDialog.container);
                    t.viewDialog.dialog = new Modal({
                        title: '选择图标',
                        content: t.viewDialog.container
                    });
                    t.viewDialog.container.bind('hidden', function(e) {
                        _log('t.viewDialog.container hidden');
                    });
                    $('.btn-iconSelection').on('click', onSelect);
                } else {
                    _log('没有icon数据');
                }
            },
            setValue: function(value) {
                var t = this;
                t.$el.find('span[iconBox="true"]').attr('class', 'glyphicon glyphicon-' + value);
                t.$el.find('input').val(value);
                var data = t.config['data'];
                var setName = function(icon) {
                    $.each(data, function(i, item) {
                        if (item.alias && item.alias == icon) {
                            t.$el.find('b').html(item['name']);
                        }
                    });
                }
                if (data) {
                    setName(data);
                } else {
                    t.config.loadData(function(response) {
                        t.config['data'] = response['currentRecords'];
                        data = response['currentRecords'];
                        setName(value);
                    });
                }
            },
            getValue: function() {
                var t = this;
                return t.$el.find('input').val();
            },
            setEvent: function(eventsObject) {
                var t = this;
                t.eves = $.extend({}, t.eves, eventsObject);
            }
        });
        return IconSelectionView;
    });