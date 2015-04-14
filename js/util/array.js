define([], function() {
	$nvwa.array = {
		//判断这个数组里面是不是有期望的元素
		have: function(arrayObject, filterKeys) {
			var t = this;
			var result = false;
			if (t.isVerify(arrayObject) && filterKeys) {
				$.each(arrayObject, function(i, item) {
					if (item && item == filterKeys) {
						result = true;
					}
				});
			}
			return result;
		},
		//验证数组是否合法
		isVerify: function(arrayObject) {
			if (arrayObject && arrayObject.length > 0) {
				return true;
			} else {
				return false;
			}
		}
	};
	return $nvwa.array;
});