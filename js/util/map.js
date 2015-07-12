define('js/util/map', [], function() {
	MapUtil = {
		filter: function(mapObject, filterKeys) {
			if (mapObject) {
				if (filterKeys && filterKeys.length > 0) {
					var result = {};
					$.each(filterKeys, function(i, key) {
						if (mapObject[key]) {
							result[key] = mapObject[key];
						}
					});
					return result;
				} else {
					return null;
				}
			}
		}
	};
	return MapUtil;
});