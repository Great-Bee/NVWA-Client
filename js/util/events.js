define([], function() {
	$nvwa.events = {
		_fire: function(t) {
			if (t.eves && t.eves.length > 0) {
				$.each(t.eves, function(i, eventItem) {
					if (eventItem && eventItem.alias) {
						t.$el.on(eventItem.eventName, function(e) {
							require(['nvwaScripts/' + eventItem.alias], function(fireEvent) {
								if (fireEvent && fireEvent.execute) {
									eventItem.arguments = eventItem.arguments || '{}';
									var argMap = $nvwa.string.jsonStringToObject(eventItem.arguments);
									fireEvent.execute(t, argMap);
								} else {
									_log('fireEvent is error');
									_log(fireEvent);
								}
							});
						});
					}
				});
			}
		}
	}
	return $nvwa.events;
});