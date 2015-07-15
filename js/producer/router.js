/**
 * Router
 * @return {[type]} [description]
 */
define('js/producer/router', ["js/producer/view/producer",
    'js/util/api/producer',
    'js/util/api/oi',
    'js/util/api/mc'
], function(ProducerLayoutView, Producer, OI, MC) {
    var Router = Backbone.Router.extend({
        routes: {
            //首页
            "": "index",
            "index": "index",
            //login
            "login": "producerLogin",
            //password edit
            "passwordEdit": "passwordEdit",
            //OI相关的
            "oi": "listOi", //oi index,list
            "oi/add": "addOi", //add oi
            "oi/update/:id": "updateOi", //update oi
            "oi/view/:id": "viewOi", //view oi            
            "oi/log": "listLog", //log list
            "oi/reservedField": "reservedField", //Reserved Words

            //Container相关的
            "container/list": "listContainer",
            "container/add": "addContainer", //add oi
            "container/update/:id": "updateContainer", //update oi
            "container/view/:id": "viewContainer", //view oi            


            //Page相关的
            "page/list": "listPage",
            "page/add": "addPage",
            "page/edit/:id": "editPage",
            //自定义脚本相关的
            "customScripts/list": "customScriptsPage",
            "customScripts/add": "addCustomScripts", //add customScripts
            "customScripts/update/:id": "updateCustomScripts", //update customScripts
            "customScripts/view/:id": "viewCustomScripts", //view customScripts   
            //API相关的
            "apiConfig/list": "listAPIConfig",
            "apiConfig/add": "addAPIConfig", //add APIonfig
            "apiConfig/update/:id": "updateAPIConfig", //update APIonfig
            "apiConfig/view/:id": "viewAPIConfig", //view APIonfig   

            //App
            "app/list": "listApp",
            "app/add": "addApp",
            "app/update/:id": "updateApp",
            "app/view/:id": "viewApp",

            //Container
            "container/:containerType/edit/:container": "editContainer",
            "container/:containerType/preview/:container": "previewContainer",

            //page layout
            "page/edit/:id": "editPageLayout",
            "page/preview/:id": "previewPageLayout",

            //system config
            "systemConfig": "systemConfig",

            //条件相关的
            //事件相关的
            "select": "selectDemo",
            "test": "testDemo",
        },

        //初始化布局
        initialize: function() {
            this._init();
        },

        //Rounter的初始化函数
        _init: function() {
            this.layoutView = new ProducerLayoutView({
                el: document.body
            });
            this.layoutView.render();
        },

        //Index
        index: function() {
            var t = this;
            t._init();
            requirejs(["js/producer/view/index"], function(IndexView) {
                //list oi
                var container = $("#content");
                var indexView = new IndexView({
                    el: container,
                    routes: t
                }, {}, {}, null, false);
                indexView.render();
                t.layoutView.setBarActive('index');
            });
        },
        //password edit
        passwordEdit: function() {
            var t = this;
            t._init();
            require(["js/producer/view/passwordEdit"], function(PasswordView) {
                var container = $("#content");
                var passwordView = new PasswordView({
                    el: container,
                    routes: t
                }, {}, {}, null, false);
                passwordView.render();
            });
        },
        producerLogin: function() {
            var t = this;
            Producer.checkLogin(function(response) {
                if (response['ok']) {
                    t.navigate('index', {
                        trigger: true
                    });
                } else {
                    requirejs(["js/core/element/view/login"], function(LoginView) {
                        var loginView = new LoginView({
                            el: document.body,
                            routes: t
                        }, {}, {}, null, false);
                        loginView.render();
                    });
                }
            });
        },
        //OI
        listOi: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/oi"], function(OIView) {
                //list oi
                var oiView = new OIView({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('oi');
            });
        },
        addOi: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/oiForm"], function(OIForm) {
                //add oi
                var oiForm = new OIForm({
                    el: container,
                    routes: t
                }, {
                    title: '添加存储',
                    loadDataEvent: OI.readOi,
                    saveDataEvent: OI.addOi
                });
                t.layoutView.setBarActive('oi');
            });
        },
        updateOi: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //update oi
            requirejs(["js/producer/view/oiForm"], function(OIForm) {
                var oiForm = new OIForm({
                    el: container,
                    routes: t
                }, {
                    title: '更新存储',
                    objectId: objectId,
                    formType: 'update',
                    loadDataEvent: OI.readOi,
                    updateDataEvent: OI.updateOi

                });
                t.layoutView.setBarActive('oi');
            });
        },
        viewOi: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //view oi
            requirejs(["js/producer/view/oiForm"], function(OIForm) {
                var oiForm = new OIForm({
                    el: container,
                    routes: t
                }, {
                    title: '查看存储',
                    objectId: objectId,
                    formType: 'view',
                    loadDataEvent: OI.readOi
                });
                t.layoutView.setBarActive('oi');
            });
        },
        //log
        listLog: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/log"], function(LogView) {
                //list log
                var logView = new LogView({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('oi');
            });
        },
        //Reserved Field 保留字
        reservedField: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/reservedField"], function(ReservedField) {
                //list Reserved Words
                var reservedField = new ReservedField({
                    el: container,
                    routes: t
                });
            });
        },

        //Container列表
        listContainer: function() {
            var t = this;
            t._init();
            var container = $("#content");
            //list oi
            requirejs(["js/producer/view/container"], function(ContainerView) {
                var containerView = new ContainerView({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('container');
            });
        },
        addContainer: function() {
            var t = this;
            t._init();
            var container = $("#content");
            //add container
            requirejs(["js/producer/view/containerForm"], function(ContainerForm) {
                var containerForm = new ContainerForm({
                    el: container,
                    routes: t
                }, {
                    title: '添加容器',
                    loadDataEvent: MC.readContainer,
                    saveDataEvent: MC.addContainer
                });
                t.layoutView.setBarActive('container');
            });
        },
        updateContainer: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //update container
            requirejs(["js/producer/view/containerForm"], function(ContainerForm) {
                var containerForm = new ContainerForm({
                    el: container,
                    routes: t
                }, {
                    title: '更新容器',
                    objectId: objectId,
                    formType: 'update',
                    loadDataEvent: MC.readContainer,
                    updateDataEvent: MC.updateContainer

                });
                t.layoutView.setBarActive('container');
            });
        },
        viewContainer: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //view container
            requirejs(["js/producer/view/containerForm"], function(ContainerForm) {
                var containerForm = new ContainerForm({
                    el: container,
                    routes: t
                }, {
                    title: '查看容器',
                    objectId: objectId,
                    formType: 'view',
                    loadDataEvent: MC.readContainer
                });
                t.layoutView.setBarActive('container');
            });
        },
        listPage: function() {
            var t = this;
            t._init();
            var container = $("#content");
            //list oi
            requirejs(["js/producer/view/page"], function(PageView) {
                var pageView = new PageView({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('page');
            });
        },
        customScriptsPage: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/customScripts"], function(CustomScriptsView) {
                //list oi
                var customScriptsView = new CustomScriptsView({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('customScripts');
            });
        },
        addCustomScripts: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/customScriptsForm"], function(CustomScriptsForm) {
                //add CustomScripts
                var customScriptsForm = new CustomScriptsForm({
                    el: container,
                    routes: t
                }, {
                    title: '添加自定义脚本',
                    loadDataEvent: MC.readCustomScripts,
                    saveDataEvent: MC.addCustomScripts,
                    uniqueEvent: MC.customScriptsUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //添加成功
                            //跳转到更新页面上
                            if (data.dataMap && data.dataMap.id > 0) {
                                var url = 'customScripts/update/' + data.dataMap.id;
                                t.navigate(url, {
                                    trigger: true
                                });
                            }
                        }
                    },
                    callbackEvent: function() {
                        var url = 'customScripts/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('customScripts');
            });
        },
        updateCustomScripts: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //update container
            requirejs(["js/producer/view/customScriptsForm"], function(CustomScriptsForm) {
                var customScriptsForm = new CustomScriptsForm({
                    el: container,
                    routes: t
                }, {
                    title: '更新自定义脚本',
                    objectId: objectId,
                    formType: 'update',
                    loadDataEvent: MC.readCustomScripts,
                    updateDataEvent: MC.updateCustomScripts,
                    uniqueEvent: MC.customScriptsUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //更新成功
                            //跳转到列表页面上
                            var url = 'customScripts/list';
                            t.navigate(url, {
                                trigger: true
                            });
                        }
                    },
                    callbackEvent: function() {
                        var url = 'customScripts/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('customScripts');
            });
        },
        viewCustomScripts: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //view container
            requirejs(["js/producer/view/customScriptsForm"], function(CustomScriptsForm) {
                var customScriptsForm = new CustomScriptsForm({
                    el: container,
                    routes: t
                }, {
                    title: '查看自定义脚本',
                    objectId: objectId,
                    formType: 'view',
                    loadDataEvent: MC.readCustomScripts,
                    callbackEvent: function() {
                        var url = 'customScripts/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('customScripts');
            });
        },
        listAPIConfig: function() {
            var t = this;
            t._init();
            var container = $("#content");
            //list oi
            requirejs(["js/producer/view/apiConfig"], function(APIConfig) {
                var apiConfig = new APIConfig({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('page');
            });
        },
        addAPIConfig: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/apiConfigForm"], function(APIConfigForm) {
                //add CustomScripts
                var apiConfigForm = new APIConfigForm({
                    el: container,
                    routes: t
                }, {
                    title: '添加API配置',
                    loadDataEvent: MC.readAPIConfig,
                    saveDataEvent: MC.addAPIConfig,
                    uniqueEvent: MC.apiConfigUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //添加成功
                            //跳转到更新页面上
                            if (data.dataMap && data.dataMap.id > 0) {
                                var url = 'apiConfig/update/' + data.dataMap.id;
                                t.navigate(url, {
                                    trigger: true
                                });
                            }
                        }
                    },
                    callbackEvent: function() {
                        var url = 'apiConfig/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('page');
            });
        },
        updateAPIConfig: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //update container
            requirejs(["js/producer/view/apiConfigForm"], function(APIConfigForm) {
                var apiConfigForm = new APIConfigForm({
                    el: container,
                    routes: t
                }, {
                    title: '更新API配置',
                    objectId: objectId,
                    formType: 'update',
                    loadDataEvent: MC.readAPIConfig,
                    updateDataEvent: MC.updateAPIConfig,
                    uniqueEvent: MC.apiConfigUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //更新成功
                            //跳转到列表页面上
                            var url = 'apiConfig/list';
                            t.navigate(url, {
                                trigger: true
                            });
                        }
                    },
                    callbackEvent: function() {
                        var url = 'apiConfig/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('page');
            });
        },
        viewAPIConfig: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //view container
            requirejs(["js/producer/view/apiConfigForm"], function(APIConfigForm) {
                var apiConfigForm = new APIConfigForm({
                    el: container,
                    routes: t
                }, {
                    title: '查看API配置',
                    objectId: objectId,
                    formType: 'view',
                    loadDataEvent: MC.readAPIConfig,
                    callbackEvent: function() {
                        var url = 'apiConfig/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('page');
            });
        },

        //App
        listApp: function() {
            var t = this;
            t._init();
            var container = $("#content");
            //list oi
            requirejs(["js/producer/view/app"], function(App) {
                var app = new App({
                    el: container,
                    routes: t
                });
                t.layoutView.setBarActive('app');
            });
        },

        addApp: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/appForm"], function(APIConfigForm) {
                //add CustomScripts
                var appForm = new APIConfigForm({
                    el: container,
                    routes: t
                }, {
                    title: '添加App',
                    loadDataEvent: MC.readApp,
                    saveDataEvent: MC.addApp,
                    uniqueEvent: MC.appUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //添加成功
                            //跳转到更新页面上
                            // if (data.dataMap && data.dataMap.id > 0) {
                            //     var url = 'app/update/' + data.dataMap.id;
                            //     t.navigate(url, {
                            //         trigger: true
                            //     });
                            // }
                            t.navigate('app/list', {
                                trigger: true
                            });
                        }
                    },
                    callbackEvent: function() {
                        var url = 'app/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('app');
            });
        },

        updateApp: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //update container
            requirejs(["js/producer/view/appForm"], function(AppForm) {
                var appForm = new AppForm({
                    el: container,
                    routes: t
                }, {
                    title: '更新App',
                    objectId: objectId,
                    formType: 'update',
                    loadDataEvent: MC.readApp,
                    updateDataEvent: MC.updateApp,
                    uniqueEvent: MC.appUnique,
                    afterUpdateEvent: function(data) {
                        if (data && data.ok) {
                            //更新成功
                            //跳转到列表页面上
                            var url = 'app/list';
                            t.navigate(url, {
                                trigger: true
                            });
                        }
                    },
                    callbackEvent: function() {
                        var url = 'app/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('app');
            });
        },

        //View APP
        viewApp: function(objectId) {
            var t = this;
            t._init();
            var container = $("#content");
            //view container
            requirejs(["js/producer/view/appForm"], function(AppForm) {
                var appForm = new AppForm({
                    el: container,
                    routes: t
                }, {
                    title: '查看App',
                    objectId: objectId,
                    formType: 'view',
                    loadDataEvent: MC.readApp,
                    callbackEvent: function() {
                        var url = 'app/list';
                        t.navigate(url, {
                            trigger: true
                        });
                    }
                });
                t.layoutView.setBarActive('app');
            });
        },

        //Edit Container
        editContainer: function(containerType, containerAlias) {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/editor_container_" + containerType], function(Editoriew) {
                var editorContainerView = new Editoriew({
                    el: container,
                    routes: t
                }, {
                    containerAlias: containerAlias
                });
                t.layoutView.setBarActive('container');
            });
        },

        //Preview Container
        previewContainer: function(containerType, containerAlias) {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/preview_container_" + containerType], function(PreviewView) {
                var previewView = new PreviewView({
                    el: container,
                    routes: t
                }, {
                    containerAlias: containerAlias
                });
                t.layoutView.setBarActive('container');
            });
        },

        editPageLayout: function(pageAlias) {
            var t = this;
            t._init();
            _log(pageAlias);
            var container = $("#content");
            requirejs(["js/producer/view/editPage"], function(EditPageLayoutView) {
                var editPageLayoutView = new EditPageLayoutView({
                    el: container,
                    routes: t
                }, {
                    pageAlias: pageAlias
                });
                t.layoutView.setBarActive('page');
            });
        },
        previewPageLayout: function(pageAlias) {
            var t = this;
            t._init();
            _log(pageAlias);
            var container = $("#content");
            requirejs(["js/producer/view/previewPage"], function(EditPageLayoutView) {
                var editPageLayoutView = new EditPageLayoutView({
                    el: container,
                    routes: t
                }, {
                    pageAlias: pageAlias
                });
                t.layoutView.setBarActive('page');
            });
        },
        systemConfig: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/producer/view/systemConfig"], function(SystemConfigView) {
                var systemConfigView = new SystemConfigView({
                    el: container,
                    routes: t
                }, {

                });
            });
        },
        //测试
        selectDemo: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/test/view/select"], function(SelectView) {
                var selectView = new SelectView({
                    el: container,
                    routes: t
                }, {

                });
                t.layoutView.setBarActive('container');
            });
        },
        testDemo: function() {
            var t = this;
            t._init();
            var container = $("#content");
            requirejs(["js/test/view/testView"], function(TestView) {
                var testView = new TestView({
                    el: container,
                    routes: t
                }, {

                });
                t.layoutView.setBarActive('container');
            });
        }
    });

    return Router;
});