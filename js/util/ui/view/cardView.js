/**
 *卡片组件
 */
define(['text!js/util/ui/template/cardView.html'], function(Tpl) {
    var CardView = Backbone.View.extend({
        events: {
            'click a': 'onClick'
        },
        initialize: function(options, config, dataSource) {
            var t = this;
            t.dataSource = $.extend({
                cards: [
                    [{
                        link: 'http://www.lufax.com',
                        title: 'Title',
                        subTitle: 'Sub Title',
                        content: 'Content....'
                    }],
                    [{
                        link: 'http://www.lufax.com',
                        title: 'Title',
                        subTitle: 'Sub Title',
                        content: 'Content....'
                    }, {
                        link: 'http://www.lufax.com',
                        title: 'Title',
                        subTitle: 'Sub Title',
                        content: 'Content....'
                    }]
                ]
            }, dataSource);
            config = $.extend({

            }, config);
            t.config = config;
            t.render();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            var t = this;
            t.$el.html(_.template(Tpl, {
                options: t.options,
                dataSource: t.dataSource,
                config: t.config
            }));
            return t;
        },
        onClick: function(e) {
            var t = this;
            var el = $(e.target);
            var columnBody = el.parent().parent().parent().parent();
            var rowBody = columnBody.parent();
            var rowIndex = rowBody.attr('rowIndex');
            var columnIndex = columnBody.attr('columnindex');
            if (columnIndex && rowIndex) {
                if (t.dataSource && $nvwa.array.isVerify(t.dataSource.cards)) {
                    var rowList = t.dataSource.cards;
                    if (rowList[rowIndex]) {
                        var columnLIst = rowList[rowIndex];
                        if ($nvwa.array.isVerify(columnLIst)) {
                            var columnObject = columnLIst[columnIndex];
                            if (columnObject && columnObject.onClick && typeof(columnObject.onClick) == 'function') {
                                columnObject.onClick(e);
                            }
                        }
                    }
                }
            }

        }
    });
    return CardView;
});