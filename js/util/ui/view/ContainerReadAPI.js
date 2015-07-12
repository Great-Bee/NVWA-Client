define('js/util/ui/view/ContainerReadAPI', [
        'backbone',
        'js/util/ui/view/button',
        'achy/widget/ui/message',
        'js/util/ui/view/modal',
        'js/util/api/producer',
        'js/util/api/mc',
        //       'js/util/ui/view/list',
    ],
    function(
        Backbone, ButtonView, Message, Modal, Producer, MC
    ) {
        var ShowAPIListView = Backbone.View.extend({
            initialize: function(options, config) {
                var t = this;
                config = $.extend({
                    conditions: config.conditions //log conditions
                }, config);
                t.render(config.pageAlias, config.contrainerBean);
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function(pageAlias, contrainerBean) {
                var t = this;
                var contrainerType = contrainerBean.type;
                var contrainerAlias = contrainerBean.alias;
                $('<ul id="api-nav" class="nav nav-tabs"></ul><div id="api-content" class="tab-content"></div>').appendTo(t.$el);
                var apiNav = t.$el.find("#api-nav");
                var apiContent = t.$el.find("#api-content");
                //form 表单
                if (contrainerType == 'form') {
                    var create = $('<li><a href="#api-create" data-toggle="tab">新增接口</a></li>').appendTo(apiNav);
                    var delet = $('<li><a href="#api-delete" data-toggle="tab">删除接口</a></li>').appendTo(apiNav);
                    var read = $('<li><a href="#api-read" data-toggle="tab">查询接口</a></li>').appendTo(apiNav);
                    var update = $('<li><a href="#api-update" data-toggle="tab">更新接口</a></li>').appendTo(apiNav);
                    create.bind('click', function() {
                        var tabContent = apiContent.find('#api-create');
                        t.buildTab(tabContent, 'create', pageAlias, contrainerAlias);
                    });
                    delet.bind('click', function() {
                        var tabContent = apiContent.find('#api-delete');
                        t.buildTab(tabContent, 'delete', pageAlias, contrainerAlias);
                    });
                    read.bind('click', function() {
                        var tabContent = apiContent.find('#api-read');
                        t.buildTab(tabContent, 'read', pageAlias, contrainerAlias);
                    });
                    update.bind('click', function() {
                        var tabContent = apiContent.find('#api-update');
                        t.buildTab(tabContent, 'update', pageAlias, contrainerAlias);
                    });
                    $('<div class="tab-pane fade in active" id="api-create"></div>').appendTo(apiContent);
                    $('<div class="tab-pane fade in active" id="api-delete"></div>').appendTo(apiContent);
                    $('<div class="tab-pane fade in active" id="api-read"></div>').appendTo(apiContent);
                    $('<div class="tab-pane fade in active" id="api-update"></div>').appendTo(apiContent);

                } else {

                    var page = $('<li><a href="#api-page" data-toggle="tab">分页查询接口</a></li>').appendTo(apiNav);
                    page.bind('click', function() {
                        var tabContent = apiContent.find('#api-page');
                        t.buildTab(tabContent, 'page', pageAlias, contrainerAlias);
                    });
                    $('<div class="tab-pane fade in active" id="api-page"></div>').appendTo(apiContent);

                    //grid  列表
                    /*         new ButtonView({
                                     el: t.$el
                                 }, {
                                     text: '分页查询接口',
                                     icon: 'glyphicon-cloud',
                                     click: function() {
                                          MC.readContrainerAPI('page',pageAlias,contrainerAlias,function(data){
                                             var apiBean = eval("("+data.dataMap.bean_data+")")
                                             if(apiBean){
                                                 t.showAPIModel(apiBean);
                                             }else{
                                                 //查询失败
                                                 new Message({
                                                     type: 'error',
                                                     msg: '查看失败',
                                                     timeout: 1500
                                                 });
                                             }
                                         });
                                     }
                             });
                         */
                }

                return t;
            },
            /**    
             *    显示相应api接口信息
             */
            showAPIModel: function(apiBean, el) {
                var t = this;
                var title = apiBean.title;
                var url = apiBean.url;
                var params = apiBean.params;
                var result = JSON.stringify(apiBean.result);
                $('<br/><br/><table class="table api-table"></table>').appendTo(el);
                var table = el.find('.api-table');
                table.html("");
                $('<tr class=""><td class="" width="10%">接口名称</td><td class="">' + title + '</td></tr>').appendTo(table);
                $('<tr class=""><td class="">接口url</td><td class="">' + url + '</td></tr>').appendTo(table);
                for (var i in params) {
                    $('<tr class=""><td class="">请求参数</td><td class="text-justify">' + params[i] + '</td></tr>').appendTo(table);
                }

                result = result.replace(/\"{/g, '{');
                result = result.replace(/\}\"/g, '}');
                result = result.replace(/\\\"/g, '"');
                $('<tr class=""><td class="">返回参数</td><td class="">' + result + '</td></tr>').appendTo(table);
            },
            /**    
             *    构建tab，并请求后台，返回接口数据
             */
            buildTab: function(el, methodName, pageAlias, contrainerAlias) {
                var t = this;
                var table = el.find('.api-table');
                //table.html()有值 说明已经请求过了，不再请求
                if (table && table.html() && table.html().length > 1) {
                    //不做处理
                } else {
                    MC.readContrainerAPI(methodName, pageAlias, contrainerAlias, function(data) {
                        var apiBean = eval("(" + data.dataMap.bean_data + ")")
                        if (apiBean) {
                            t.showAPIModel(apiBean, el);
                        } else {
                            //查询失败
                            new Message({
                                type: 'error',
                                msg: '查看失败',
                                timeout: 1500
                            });
                        }
                    });
                }
            }

        });
        return ShowAPIListView;
    });