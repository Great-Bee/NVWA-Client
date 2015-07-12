define('js/util/ui/control', [], function() {
	ControlUtil = {
		showControl: function(el, showList) {
			if (el) {
				var __showControl = function(item) {
					el.find('.' + item).removeClass('hidden');
				};
				//show control
				if (showList) {
					$.each(showList, function(i, item) {
						__showControl(item);
					});
				}
			}
		}
	};
	return ControlUtil;
});