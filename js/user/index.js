define('js/user/index', [
    'backbone',
    'user/router', //路由定义user
    'util/error', //异常搜集
    'util/apiHome',
    'util/string', //StringUtil
    'util/dictionary', //Dictionary
    'util/array', //ArrayUtil
    // 'util/cache', //Local cache
    'css!yestrap', //Yestrap CSS
    'css!main' //Main.css
], function(Backbone, Router) {
    return {
        init: function() {
            $(document.body).empty();
            var router = new Router();
            window.router = router;
            Backbone.history.start();
        }
    };
});