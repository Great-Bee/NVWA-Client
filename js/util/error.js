define('js/util/error', [], function() {
	//用于搜集来自UI DOM结构上触发的异常
	//这个函数只进行异常搜集并且输出到log里面
	//除此之外不进行任何异常的处理
	window._log('init error handler');
	$(document.body).on('error', function(e, msg) {
		window._log('msg-> ' + msg);
	});
});