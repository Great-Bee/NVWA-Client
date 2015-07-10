define([

    'js/util/ui/view/editorClientEventForm',
    'js/util/ui/view/dropButton',
    'js/util/dictionary'
], function(EditorClientEventFormView, DropButtonView, Dictionary) {
    var ServerEventFormView = EditorClientEventFormView.extend({
        events: EditorClientEventFormView.prototype.events,
        initialize: function(options, config) {
            EditorClientEventFormView.prototype.initialize.apply(this, arguments);
        },
        //设置下拉盒的属性
        _initEventNameSelectView: function() {
            var t = this;
            t.eventType = new DropButtonView({
                el: t.$el.find('.eventName')
            }, {
                containerId: 'eventName',
                fieldName: 'eventName'
            });
            var serverEventTypeData = {};
            if (t.config && t.config.supportServerEventNames && Dictionary.ServerEventType) {
                serverEventTypeData = MapUtil.filter(Dictionary.ServerEventType, t.config.supportServerEventNames) || {};
            }
            _log('serverEventTypeData');
            _log(t.config.supportServerEventNames);
            _log(serverEventTypeData);
            t.eventType.setListData(serverEventTypeData);
        },
        _getScriptConditions: function() {
            return [{
                fieldName: 'type',
                fieldValue: 'java'
            }];
        },
    });
    return ServerEventFormView;
});