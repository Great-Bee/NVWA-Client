/**
 * OI
 */
define([
    'js/util/http',
    'js/util/api/producer'
], function(http, Producer) {
    var DEFAULT_INDEX = 'id';
    var OI = {
        /**
         * 读取OI列表
         */
        oiPage: function(handler, config) {
            var url = '/nvwa/oi/list';
            var data = {
                pagination_page: config['page']
            };
            var globalSearchKeyword = config['keyword'];
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
                data['_g_search_' + 'identified'] = globalSearchKeyword;
                data['_g_search_' + 'tableName'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        oiList: function(handler, config, globalSearchKeyword) {
            var url = '/nvwa/oi/list';
            var data = {
                pagination_page: 1,
                pagination_pageSize: 9999
            };
            if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                data['_g_search_' + 'name'] = globalSearchKeyword;
                data['_g_search_' + 'description'] = globalSearchKeyword;
                data['_g_search_' + 'identified'] = globalSearchKeyword;
                data['_g_search_' + 'tableName'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        },
        /**
         * 读取OI
         */
        readOi: function(id, handler) {
            var url = '/nvwa/oi/read/' + id;
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
         * 添加OI
         */
        addOi: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/oi/add';
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
         * 更新OI
         */
        updateOi: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/oi/update/' + id;
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
         * 删除OI
         */
        deleteOi: function(oi, handler) {
            if (oi && oi[DEFAULT_INDEX]) {
                var deleteId = oi[DEFAULT_INDEX];
                var url = '/nvwa/oi/delete';
                var data = {
                    id: deleteId
                };
                //判断前端传过来是否有删除schema的选项
                if (oi['dropSchema']) {
                    data['dropSchema'] = true;
                }
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        //OI唯一性检查
        oiUnique: function(identified, tablename, handler) {
            var url = '/nvwa/oi/unique';
            var data = {
                identified: identified,
                tablename: tablename
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //Connector唯一性检查
        connectorUnique: function(alias, handler) {
            var url = '/nvwa/connector/unique';
            var data = {
                alias: alias
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        //field唯一性检查
        fieldUnique: function(identified, fieldName, handler) {
            var url = '/nvwa/field/unique';
            var data = {
                fieldName: fieldName,
                identified: identified
            };
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 读取字段列表
         */
        fieldPage: function(handler, config, globalSearchKeyword) //page, orderName, order, conditions
            {
                var url = '/nvwa/field/list';
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
                if (globalSearchKeyword && globalSearchKeyword.length > 0) {
                    data['_g_search_' + 'name'] = globalSearchKeyword;
                    data['_g_search_' + 'description'] = globalSearchKeyword;
                    data['_g_search_' + 'fieldName'] = globalSearchKeyword;
                    data['_g_search_' + 'oiIdentified'] = globalSearchKeyword;
                }
                Producer.pageRequest(url, data, handler);
            },
        //读取fieldList
        fieldList: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/field/list';
                var data = {
                    pagination_page: config['page'],
                    pagination_pageSize: 999
                };
                var conditions = config['conditions'];
                if (conditions && conditions.length > 0) {
                    $.each(conditions, function(i, condition) {
                        data['_c_' + condition['fieldName']] = condition['fieldValue'];
                    });
                }
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取Field
         */
        readField: function(id, handler) {
            var url = '/nvwa/field/read/' + id;
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
         * 添加Field
         */
        addField: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/field/add';
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
         * 更新Field
         */
        updateField: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/field/update/' + id;
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
         *删除Field
         */
        deleteField: function(field, handler) {
            if (field && field[DEFAULT_INDEX]) {
                var deleteId = field[DEFAULT_INDEX];
                var url = '/nvwa/field/delete';
                var data = {
                    id: deleteId
                };
                //判断前端传过来是否有删除schema的选项
                if (field['dropSchema']) {
                    data['dropSchema'] = true;
                }
                http.request(url, data, function(response) {
                    if (handler && handler != null) {
                        handler(response);
                    }
                }, false, 'POST', false);
            }
        },
        /**
         * 读取connector列表
         */
        connectorPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/connector/list';
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
                Producer.pageRequest(url, data, handler);
            },
        /**
         *读取connector
         */
        readConnector: function(id, handler) {
            var url = '/nvwa/connector/read/' + id;
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
         * 添加connector
         */
        addConnector: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/connector/add';
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
         * 更新connector
         */
        updateConnector: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/connector/update/' + id;
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
         *删除connector
         */
        deleteConnector: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/connector/delete';
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
        //读取connector的树
        getConnectorTree: function(handler, config) {
            var url = '/nvwa/connector/tree'
            var data = {};
            if (config && config['identified']) {
                data['identified'] = config['identified'];
                data['currentContainerId'] = config['currentContainerId'];
                data['currentContainerAlias'] = config['currentContainerAlias'];
            } else if (config && config['alias']) {
                data['alias'] = config['alias'];
            }
            http.request(url, data, function(response) {
                if (handler && handler != null) {
                    handler(response);
                }
            }, false, 'POST', false);
        },
        /**
         * 读取reservedField列表
         */
        reservedFieldPage: function(handler, config) //page, orderName, order, conditions
            {
                var url = '/nvwa/reservedField/list';
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
                Producer.pageRequest(url, data, handler);
            },
        //保留字列表
        listReservedField: function(handler, config) //identified
            {
                var url = '/nvwa/reservedField/querySelectionList';
                var data = {
                    identified: config['identified']
                };
                http.request(url, data, function(response) {
                    //返回的http请求数据
                    if (response.ok) {
                        if (response.dataMap && response.dataMap.reserveds) {
                            //请求ok
                            if (handler != null) {
                                handler(response.dataMap.reserveds);
                            }
                        }
                    } else {
                        _log(response.message);
                    }
                }, false, 'POST', false);
            },
        /**
         *读取reservedField
         */
        readReservedField: function(id, handler) {
            var url = '/nvwa/reservedField/read/' + id;
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
         * 添加ReservedField
         */
        addReservedField: function(addData, handler) {
            //组装更新的url
            var url = '/nvwa/reservedField/add';
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
         * 更新ReservedField
         */
        updateReservedField: function(updateData, handler) {
            //获取id
            var id = updateData[DEFAULT_INDEX];
            //组装更新的url
            var url = '/nvwa/reservedField/update/' + id;
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
         *删除reservedField
         */
        deleteReservedField: function(connector, handler) {
            if (connector && connector[DEFAULT_INDEX]) {
                var deleteId = connector[DEFAULT_INDEX];
                var url = '/nvwa/reservedField/delete';
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
        logPage: function(handler, config) {
            var url = '/nvwa/log/list';
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
                data['_g_search_' + 'logIdentified'] = globalSearchKeyword;
                data['_g_search_' + 'content'] = globalSearchKeyword;
                data['_g_search_' + 'type'] = globalSearchKeyword;
                data['_g_search_' + 'fieldName'] = globalSearchKeyword;
                data['_g_search_' + 'createXingMing'] = globalSearchKeyword;
            }
            Producer.pageRequest(url, data, handler);
        }
    };
    return OI;
});