define('index', [
    //   'text',
    'backbone',
    'js/producer/router', //路由定义
    'js/util/error', //异常搜集
    'js/util/apiHome',
    'js/util/string', //StringUtil
    'js/util/dictionary', //Dictionary
    'js/util/array', //ArrayUtil
    'js/util/cache', //Local cache
    'js/util/events', //events规范
     // 'text!yestrap', //Yestrap CSS
     //  'css!main' //Main.css
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