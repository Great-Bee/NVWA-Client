/**
 * Producer View
 */
define([
    'backbone',
    'underscore',
    'text!js/producer/template/producerLayout.html',
    'js/util/api/producer'
], function(Backbone, _, ProducerTpl, Producer) {
    var ProducerView = Backbone.View.extend({
        initialize: function(options, config) {},
        render: function() {
            this.$el.html(_.template(ProducerTpl));
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