/**
 * MC
 */
define(['js/util/http', 'js/util/api/producer'], function(http, Producer) {
    var DEFAULT_INDEX = 'id';
    var ModuleAlias = {
        Page: 'page',
        CustomScripts: 'customScripts',
        CustomScriptsParameters: 'customScriptParameters',
    }
    var BaseAction = {
        //common
        readObjectByColumn: function(objectAlias, columnName, value, handler) {
            var url = '/nvwa/' + objectAlias + '/readColumn/' + columnName + '/' + value;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        readObjectById: function(objectAlias, id, handler) {
            var url = '/nvwa/' + objectAlias + '/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        addObject: function(objectAlias, addData, handler) {
            //组装更新的url
            var url = '/nvwa/' + objectAlias + '/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        updateObject: function(objectAlias, updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/' + objectAlias + '/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        deleteObject: function(objectAlias, objectData, handler) {
            if (objectData && objectData[DEFAULT_INDEX]) {
                var deleteId = objectData[DEFAULT_INDEX];
                var url = '/nvwa/' + objectAlias + '/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        }
    }
    var MC = {
        //Page 布局
        pageLayout: function(page, handler) {
            var url = '/nvwa/pageLayout/' + page;
            var data = {};
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //Container 布局
        containerLayout: function(container, handler) {
            var url = '/nvwa/containerLayout/' + container;
            var data = {};
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
                _log('layout');
                _log(response);
            }, false, 'POST', false);
        },

        //Container Fielsds Elements
        containerFieldElements: function(container, handler) {
            var url = '/nvwa/containerFieldElements/' + container;
            var data = {};
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },

        /**
         * 读取容器列表
         */
        containerPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/container/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                    data['_g_search_' + 'name'] = globalSearchKeyword;
                    data['_g_search_' + 'alias'] = globalSearchKeyword;
                    data['_g_search_' + 'oi'] = globalSearchKeyword;
                    data['_g_search_' + 'type'] = globalSearchKeyword;
                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取容器
         */
        readContainer: function(id, handler) {
            var url = '/nvwa/container/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        readContainerByAlias: function(alias, handler) {

            var url = '/nvwa/container/readColumn/alias/' + alias;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加容器
         */
        addContainer: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/container/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新容器
         */
        updateContainer: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/container/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除容器
         */
        deleteContainer: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/container/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 更新 containerClientAttribute
         */
        updateContainerClientAttribute: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/containerClientAttribute/update';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 containerServerAttribute
         */
        updateContainerServerAttribute: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/containerServerAttribute/update';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        listContainerObject: function(handler, config) {
            var url = '/nvwa/containerObject/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            if (config && config['pageSize'] && config['pageSize'] > 0) {
                data['pagination_pageSize'] = config['pageSize'];
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'alias'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *读取 ContainerObject
         */
        readContainerObject: function(id, handler) {
            var url = '/nvwa/containerObject/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 ContainerObject
         */
        addContainerObject: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/containerObject/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 ContainerObject
         */
        updateContainerObject: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/containerObject/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 ContainerObject
         */
        deleteContainerObject: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/containerObject/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*
         *检查容器alias的唯一性
         */
        containerUnique: function(alias, handler) {
            var url = '/nvwa/container/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /*
         *检查页面alias的唯一性
         */
        pageUnique: function(alias, handler) {
            var url = '/nvwa/page/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        containerObjectUnique: function(alias, handler) {
            var url = '/nvwa/containerObject/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        apiConfigUnique: function(alias, handler) {
            var url = '/nvwa/apiConfig/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        componentUnique: function(alias, handler) {
            var url = '/nvwa/component/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 读取Component列表
         */
        componentPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/component/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                if (config['pageSize']) {
                    data['pagination_pageSize'] = config['pageSize'];
                }
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取Component
         */
        readComponent: function(id, handler) {
            var url = '/nvwa/component/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加Component
         */
        addComponent: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/component/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新Component
         */
        updateComponent: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/component/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除Component
         */
        deleteComponent: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/component/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        listPage: function(handler, config) {
            var url = '/nvwa/page/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {

                    data['_c_' + condition['fieldName']] = condition['fieldValue'];

                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'alias'] = globalSearchKeyword;
                data['_g_search_' + 'type'] = globalSearchKeyword;
                data['_g_search_' + 'layoutType'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *读取Page
         */
        readPage: function(id, handler) {
            var url = '/nvwa/page/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        readPageByAlias: function(alias, handler) {
            BaseAction.readObjectByColumn(ModuleAlias.Page, 'alias', alias, handler);
        },
        /**
         * 添加Page
         */
        addPage: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/page/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新Page
         */
        updatePage: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/page/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除Page
         */
        deletePage: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/page/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        listPageObject: function(handler, config) {
            var url = '/nvwa/pageObject/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            if (config && config['pageSize'] && config['pageSize'] > 0) {
                data['pagination_pageSize'] = config['pageSize'];
            }
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {

                    data['_c_' + condition['fieldName']] = condition['fieldValue'];

                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'alias'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *读取Page Object
         */
        readPageObject: function(id, handler) {
            var url = '/nvwa/pageObject/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加Page Object
         */
        addPageObject: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/pageObject/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新Page Object
         */
        updatePageObject: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/pageObject/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除Page
         */
        deletePageObject: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/pageObject/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 更新Page服务器属性
         */
        updatePageServerAttribute: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/pageServerAttribute/update';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 读取page下面所拥有的container的alias
         */
        readPageContainerAlias: function(alias, handler) {
            //组装更新的url
            var url = '/nvwa/readPageContainerAlias/' + alias;
            //发送http psot请求
            http.request(url, {}, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 读取 condition 列表
         */
        conditionPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/condition/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 condition
         */
        readCondition: function(id, handler) {
            var url = '/nvwa/condition/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 condition
         */
        addCondition: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/condition/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 condition
         */
        updateCondition: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/condition/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 condition
         */
        deleteCondition: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/condition/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 读取 clientEvent 列表
         */
        clientEventPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/clientEvent/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 clientEvent
         */
        readClientEvent: function(id, handler) {
            var url = '/nvwa/clientEvent/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 clientEvent
         */
        addClientEvent: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/clientEvent/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 clientEvent
         */
        updateClientEvent: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/clientEvent/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 clientEvent
         */
        deleteClientEvent: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/clientEvent/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 读取 serverEvent 列表
         */
        serverEventPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/serverEvent/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 serverEvent
         */
        readServerEvent: function(id, handler) {
            var url = '/nvwa/serverEvent/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 serverEvent
         */
        addServerEvent: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/serverEvent/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 serverEvent
         */
        updateServerEvent: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/serverEvent/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 serverEvent
         */
        deleteServerEvent: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/serverEvent/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 读取 icon 列表
         */
        iconPage: function(handler, config) //page, orderName, order, conditions
            {
                var _response = function(data) {
                    if (handler && handler != null && typeof(handler) == 'function') {
                        handler(data);
                    }
                };
                if ($nvwa.cache.getIconCache()) {
                    _log('hit icon cache');
                    _response($nvwa.cache.getIconCache());
                } else {
                    var url = '/nvwa/icon/list';
                    var data = {
                        pagination_page: 1,
                        pagination_pageSize: 201
                    };
                    Producer.pageRequest(url, data, function(response) {
                        $nvwa.cache.setIconCache(response);
                        _response(response);
                    });
                }

            },
        /**
         * 读取 element 列表
         */
        elementPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/element/list';
                var data = {
                    pagination_page: 1,
                    pagination_pageSize: 999
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 element
         */
        readElement: function(id, handler) {
            var url = '/nvwa/element/read/' + id;
            var data = {};

            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 element
         */
        addElement: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/element/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 element
         */
        updateElement: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/element/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 element
         */
        deleteElement: function(bean, handler) {
            if (bean && bean[DEFAULT_INDEX]) {
                var deleteId = bean[DEFAULT_INDEX];
                var url = '/nvwa/element/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 更新 elementLayout
         */
        updateElementLayout: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/elementLayout/update/';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**/
        updatePageLayout: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/page/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 elementClientAttribute
         */
        updateElementClientAttribute: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/elementClientAttribute/update';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        updateElementServerAttribute: function(updateData, handler) {
            //组装更新的url
            var url = '/nvwa/elementServerAttribute/update';
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        readContainerLayoutForPreview: function(containerAlias, handler) {
            if (containerAlias) {
                var url = '/nvwa/containerLayout/' + containerAlias;
                var data = {
                    containerAlias: containerAlias
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*自定义脚本*/
        /**
         * 读取 CustomScripts 列表
         */
        customScriptsPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/customScripts/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                    data['_g_search_' + 'name'] = globalSearchKeyword;
                    data['_g_search_' + 'alias'] = globalSearchKeyword;
                    data['_g_search_' + 'description'] = globalSearchKeyword;
                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 CustomScripts
         */
        readCustomScripts: function(id, handler) {
            BaseAction.readObjectById(ModuleAlias.CustomScripts, id, handler);
        },
        /**
         *读取 CustomScripts(by alias)
         */
        readCustomScriptsByAlias: function(alias, handler) {
            BaseAction.readObjectByColumn(ModuleAlias.CustomScripts, 'alias', alias, handler);
        },
        /**
         * 添加 CustomScripts
         */
        addCustomScripts: function(addData, handler) {
            BaseAction.addObject(ModuleAlias.CustomScripts, addData, handler);
        },
        /**
         * 更新 CustomScripts
         */
        updateCustomScripts: function(updateData, handler) {
            BaseAction.updateObject(ModuleAlias.CustomScripts, updateData, handler);
        },
        /**
         *删除 CustomScripts
         */
        deleteCustomScripts: function(deleteData, handler) {
            BaseAction.deleteObject(ModuleAlias.CustomScripts, deleteData, handler);
        },
        /*
         *检查alias的唯一性
         */
        customScriptsUnique: function(alias, handler) {
            var url = '/nvwa/customScripts/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /*自定义脚本的参数*/
        /**
         * 读取 CustomScriptsParameters 列表
         */
        customScriptsParametersPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/' + ModuleAlias.CustomScriptsParameters + '/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: config['pageSize'] || 10
                };
                var conditions = config['conditions'];
                if ($nvwa.array.isVerify(conditions)) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                    data['_g_search_' + 'name'] = globalSearchKeyword;
                    data['_g_search_' + 'alias'] = globalSearchKeyword;
                    data['_g_search_' + 'description'] = globalSearchKeyword;
                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 CustomScriptsParameters
         */
        readCustomScriptParameters: function(id, handler) {
            BaseAction.readObjectById(ModuleAlias.CustomScriptsParameters, id, handler);
        },
        /**
         *读取 CustomScriptsParameters(by alias)
         */
        readCustomScriptParametersByAlias: function(alias, handler) {
            BaseAction.readObjectByColumn(ModuleAlias.CustomScriptsParameters, 'alias', alias, handler);
        },
        /**
         * 添加 CustomScriptsParameters
         */
        addCustomScriptParameters: function(addData, handler) {
            BaseAction.addObject(ModuleAlias.CustomScriptsParameters, addData, handler);
        },
        /**
         * 更新 CustomScriptsParameters
         */
        updateCustomScriptParameters: function(updateData, handler) {
            BaseAction.updateObject(ModuleAlias.CustomScriptsParameters, updateData, handler);
        },
        /**
         *删除 CustomScriptsParameters
         */
        deleteCustomScriptParameters: function(deleteData, handler) {
            BaseAction.deleteObject(ModuleAlias.CustomScriptsParameters, deleteData, handler);
        },
        /*
         *检查alias的唯一性
         */
        customScriptParametersUnique: function(alias, handler) {
            var url = '/nvwa/customScriptParameters/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        pageObjectUnique: function(alias, handler) {
            var url = '/nvwa/pageObject/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /*客户端保留事件*/
        /**
         * 读取 ClientReservedEvent 列表
         */
        clientReservedEventPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/clientReservedEvent/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 ClientReservedEvent
         */
        readClientReservedEvent: function(id, handler) {
            var url = '/nvwa/clientReservedEvent/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 ClientReservedEvent
         */
        addClientReservedEvent: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/clientReservedEvent/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 ClientReservedEvent
         */
        updateClientReservedEvent: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/clientReservedEvent/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 ClientReservedEvent
         */
        deleteClientReservedEvent: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/clientReservedEvent/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*
         *检查alias的唯一性
         */
        clientReservedEventUnique: function(alias, handler) {
            var url = '/nvwa/clientReservedEvent/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /*服务器保留事件*/
        /**
         * 读取 ServerReservedEvent 列表
         */
        serverReservedEventPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/serverReservedEvent/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {

                        data['_c_' + condition['fieldName']] = condition['fieldValue'];

                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 ServerReservedEvent
         */
        readServerReservedEvent: function(id, handler) {
            var url = '/nvwa/serverReservedEvent/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 ServerReservedEvent
         */
        addServerReservedEvent: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/serverReservedEvent/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 ServerReservedEvent
         */
        updateServerReservedEvent: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/serverReservedEvent/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 ServerReservedEvent
         */
        deleteServerReservedEvent: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/serverReservedEvent/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*
         *检查alias的唯一性
         */
        serverReservedEventUnique: function(alias, handler) {
            var url = '/nvwa/serverReservedEvent/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /*session对象维护*/
        /**
         * 读取 sessionDataBean 列表
         */
        sessionDataBeanPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/sessionObject/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 10
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {
                        data['_c_' + condition['fieldName']] = condition['fieldValue'];
                    });
                }
                var globalSearchKeyword = config['keyword'];
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {

                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取 sessionDataBean
         */
        readSessionDataBean: function(id, handler) {
            var url = '/nvwa/sessionObject/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加 SessionDataBean
         */
        addSessionDataBean: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/sessionObject/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新 SessionDataBean
         */
        updateSessionDataBean: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/sessionObject/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除 SessionDataBean
         */
        deleteSessionDataBean: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/sessionObject/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /*
         *检查alias的唯一性
         */
        sessionDataBeanUnique: function(alias, handler) {
            var url = '/nvwa/sessionObject/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //API相关
        listAPIConfig: function(handler, config) {
            var url = '/nvwa/apiConfig/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {

                    data['_c_' + condition['fieldName']] = condition['fieldValue'];

                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'alias'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
                data['_g_search_' + 'appName'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *读取APIConfig
         */
        readAPIConfig: function(id, handler) {
            var url = '/nvwa/apiConfig/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加APIConfig
         */
        addAPIConfig: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/apiConfig/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新APIConfig
         */
        updateAPIConfig: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/apiConfig/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *删除APIConfig
         */
        deleteAPIConfig: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/apiConfig/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        //获取API资源列表
        listAPIResources: function(handler, config) {
            var url = '/nvwa/apiResources/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {
                    data['_c_' + condition['fieldName']] = condition['fieldValue'];
                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'containerAlias'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        deleteAPIResources: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/apiResources/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },

        //App
        listApp: function(handler, config) {
            var url = '/nvwa/app/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {
                    data['_c_' + condition['fieldName']] = condition['fieldValue'];
                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
                data['_g_search_' + 'alias'] = globalSearchKeyword;
                data['_g_search_' + 'indexPageAlias'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *删除App
         */
        deleteApp: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/app/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         *读取APIConfig
         */
        readApp: function(id, handler) {
            var url = '/nvwa/app/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    _log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加APIConfig
         */
        addApp: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/app/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * App Unique
         */
        appUnique: function(alias, handler) {
            var url = '/nvwa/app/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新APIConfig
         */
        updateApp: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/app/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //AppResource
        listAppResource: function(handler, config) {
            var url = '/nvwa/appResource/list';
            var data = {
                pagination_page: config['page'],
                pagination_pageSize: 10
            };
            var conditions = config['conditions'];
            if (conditions && conditions.length > 0) {
                $.each(conditions, function(i, condition) {
                    data['_c_' + condition['fieldName']] = condition['fieldValue'];
                });
            }
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         *读取 ContainerObject
         */
        readAppResource: function(id, handler) {
            var url = '/nvwa/appResource/read/' + id;
            var data = {};
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (response.ok) {
                    if (response.dataMap && response.dataMap.bean_data) {
                        //请求ok
                        if (handler != null) {
                            handler(response.dataMap.bean_data);
                        }
                    }
                } else {
                    window._log(response.message);
                }
            }, false, 'POST', false);
        },
        /**
         * 添加AppResource
         */
        addAppResource: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/appResource/add';
            //组装post的数据
            var data = addData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 更新APIConfig
         */
        updateAppResource: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/appResource/update/' + id;
            //组装post的数据
            var data = updateData;
            //发送http psot请求
            http.request(url, data, function(response) {
                //返回的http请求数据
                if (handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         *读取APIConfig
         */
        deleteAppResource: function(appResource, handler) {
            if (appResource && appResource[DEFAULT_INDEX]) {
                var deleteId = appResource[DEFAULT_INDEX];
                var url = '/nvwa/appResource/delete';
                var data = {
                    id: deleteId
                };
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         *读取contrainer 的api 接口
         */
        readContrainerAPI: function(methodN,pageAlias,contrainerAlias, handler) {
            var url = '/nvwa/container/crudApi';
            var data = {
                pageAlias: pageAlias,
                containerAlias: contrainerAlias,
                methodName: methodN
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        }
    };
    return MC;
});