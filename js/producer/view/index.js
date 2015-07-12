define('js/producer/view/index', [
        'backbone', 'achy/widget/ui/message',
        'text!js/producer/template/index.tpl',
    ],
    function(Backbone, Message, IndexTpl) {
        var IndexView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                t.options = options;
                t.config = config;
            },

            //render
            render: function() {
                var t = this;
                t.$el.html(tpl(IndexTpl, {
                    options: t.options,
                    config: t.config
                }));
                return t;
            }
        });
        return IndexView;
    }
);