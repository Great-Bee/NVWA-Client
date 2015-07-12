define('js/util/cache', ['js/util/api/mc'], function(MC) {
    $nvwa.cache = {
        //icon cache
        iconCache: null,
        getIconCache: function() {
            return this.iconCache;
        },
        setIconCache: function(icon) {
            _log('caching icon');
            this.iconCache = icon;
            _log(this.iconCache);
        },
        resetIconCache: function() {
            MC.iconPage();
        }
    }
    $nvwa.cache.resetIconCache();
    return $nvwa.cache;
});