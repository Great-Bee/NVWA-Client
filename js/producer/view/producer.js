/**
 * Producer View
 */
define('js/producer/view/producer', [
    'backbone',
    'text!js/producer/template/producerLayout.tpl',
    'js/util/api/producer'
], function(Backbone, ProducerTpl, Producer) {
    var ProducerView = Backbone.View.extend({
        initialize: function(options, config) {},
        render: function() {
            this.$el.html(tpl(ProducerTpl, {}));
            return this;
        },
        setBarActive: function(module) {
            var t = this;
            if (module) {
                t.$el.find('li').removeClass('active');
                t.$el.find('[module="' + module + '"]').addClass('active');
            }
        }
    });
    return ProducerView;
});