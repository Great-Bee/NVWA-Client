/**
 * business util
 * @return {[type]} [description]
 */
define([], function() {
    var BusinessUtil = {
        initialize: function() {

        },
        //create simple page
        createSimplePage: function(MCAPI, StringUtil, containerAlias, success, error) {
            var t = this;
            var createPageAlias = StringUtil.randomSN();
            var pageBean = {
                name: '简单页面',
                alias: createPageAlias,
                type: 'simple_page',
                layouts: '[["' + containerAlias + '"]]'
            };
            MCAPI.addPage(pageBean, function(createPage) {
                if (createPage && createPage.ok && createPage.dataMap && createPage.dataMap.id) {
                    pageBean['id'] = createPage.dataMap.id;
                    if (success) {
                        success(pageBean);
                    }
                } else {
                    if (error) {
                        error();
                    }
                }
            });
        },

    };
    return BusinessUtil;
});