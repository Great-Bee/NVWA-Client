define('js/producer/view/editorContainerAttribute', [
    'backbone',

    'js/util/api/mc',
    'text!js/producer/template/editorContainerAttribute.tpl',
    'js/core/element/view/select',
    'js/core/element/view/gapConfig',
    'js/util/ui/view/fieldSelection',
    'js/util/ui/control'
], function(Backbone, MC, Tpl, SelectView, GapConfigView, FieldSelectionView, ControlUtil) {
    var EditorContainerAttributeView = Backbone.View.extend({
        events: {},
        initialize: function(options, config, events) {
            var t = this;
            t.options = options;
            config = $.extend({
                containerBean: null,
                supportAttribute: [],
                supportServerAttribute: [],
                supportEventNames: [],
                supportServerEventNames: []
            }, config);
            t.config = config;
            t.eves = $.extend({}, {
                setAttribute: function(name, value) {},
            }, events);
            t.render();
            t.loadForm();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(tpl(Tpl, {
                options: t.options,
                config: t.config
            }));
            t.initControl();
            t.showControl();
            t.setFormEvent();
            return t;
        },
        //加载表单
        loadForm: function() {
            var t = this;
            var containerClientAttribute = t.config.containerClientAttribute;
            var containerServerAttribute = t.config.containerServerAttribute;
            var setFormValue = function(attr) {
                if (attr) {
                    $.each(attr, function(k, item) {
                        t.setForm(k, item);
                    });
                }
            };
            //set form client attribute
            setFormValue(containerClientAttribute);
            //set form server attribute
            setFormValue(containerServerAttribute);
        },
        //保存服务器端事件
        saveContainerClientAttribute: function() {
            var t = this;
        },
        //保存客户端事件
        saveContainerServerAttribute: function() {
            var t = this;
        },
        //设置表单事件
        setFormEvent: function() {
            var t = this;
            var __updateClientAttribute = function(name, value, success, error) {
                t.config.containerClientAttribute[name] = value;
                MC.updateContainerClientAttribute(t.config.containerClientAttribute, function(response) {
                    if (response && response.ok) {
                        t.eves.setAttribute(name, value);
                        if (success) {
                            success(response.dataMap);
                        }
                    } else {
                        if (error) {
                            error(response.code, response.message);
                        }
                    }
                });
            };
            var __updateServerAttribute = function(name, value, success, error) {
                t.config.containerServerAttribute[name] = value;
                MC.updateContainerServerAttribute(t.config.containerServerAttribute, function(response) {
                    if (response && response.ok) {

                    } else {
                        if (error) {
                            error(response.code, response.message);
                        }
                    }
                });
            };
            //client attribute
            //侦听表单的变化事件然后异步对表单内容进行保存
            t.$el.find('.clientAttr').find('input[fieldName]').on('keyup', function(e) {
                var fieldName = $(e.target).attr('fieldName');
                var value = $(e.target).val();
                __updateClientAttribute(fieldName, value);
            });
            //监听客户端属性样式下拉框
            t.containerStyle.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('style', value);
                }
            });
            //pageing
            t.containerPagingEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('paging', value);
                }
            });
            //searching
            t.containerSearchingAbleEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('searchingAble', value);
                }
            });
            //searching
            t.containerInfoAbleEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('infoAble', value);
                }
            });

            //button enable setting change event listening           
            //create button
            t.containerCreateBtnEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('createAble', value);
                }
            });
            //update button
            t.containerUpdateBtnEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('updateAble', value);
                }
            });
            //search button
            t.containerSearchBtnEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('searchAble', value);
                }
            });
            //cancel button
            t.containerCancelBtnEnable.setEvent({
                onSelect: function(value) {
                    __updateClientAttribute('cancelAble', value);
                }
            });
            t.gapConfigView.on('keyup', function(e, data) {
                var value = t.gapConfigView.getValue();
                __updateClientAttribute('gapConfig', value);
            });

            //server attribute
            t.$el.find('.serverAttr').find('input[fieldName]').on('keyup', function(e) {
                var fieldName = $(e.target).attr('fieldName');
                var value = $(e.target).val();
                __updateServerAttribute(fieldName, value);
            });
            //监听服务器属性列表样式下拉框
            t.containerGridType.setEvent({
                //选择数据类型（带分页，不带分页，树）
                onSelect: function(value) {
                    __updateServerAttribute('gridType', value);
                    t._showParentSelection(value);
                }
            });
            //order by rule
            t.orderByRuleView.setEvent({
                onSelect: function(value) {
                    __updateServerAttribute('orderByRule', value);
                }
            });
            //父节点选择器
            t.parentSelectionView.setEvent({
                onSelect: function(fieldName, connPath, fieldSerialNumber) {
                    __updateServerAttribute('parent', fieldName);
                    __updateServerAttribute('parentConnectorPath', connPath);
                }
            });
            //父节点条件值选择器
            t.parentValueSelectionView.setEvent({
                onSelect: function(fieldName, connPath, fieldSerialNumber) {
                    __updateServerAttribute('parentValue', fieldName);
                    __updateServerAttribute('parentValueConnectorPath', connPath);
                }
            });
        },
        initControl: function() {
            var t = this;

            var colorAttr = {
                datasource: {
                    datasource: "static",
                    data: [{
                        text: '默认',
                        value: 'default'
                    }, {
                        text: '黄色',
                        value: 'primary'
                    }, {
                        text: '绿色',
                        value: 'success'
                    }, {
                        text: '蓝色',
                        value: 'info'
                    }, {
                        text: '棕色',
                        value: 'warning'
                    }, {
                        text: '红色',
                        value: 'danger'
                    }]
                }
            };
            var btnEnableAttr = {
                datasource: {
                    datasource: "static",
                    data: [{
                        text: '启用',
                        value: true
                    }, {
                        text: '禁用',
                        value: false
                    }]
                }
            };
            //container color
            t.containerStyle = new SelectView({
                el: t.$el.find('.styleContainer')
            }, {}, colorAttr);

            //是否前端分页
            t.containerPagingEnable = new SelectView({
                el: t.$el.find('.pagingContainer')
            }, {}, btnEnableAttr);
            //是否搜索过滤
            t.containerSearchingAbleEnable = new SelectView({
                el: t.$el.find('.searchingAbleContainer')
            }, {}, btnEnableAttr);
            //是否页脚信息
            t.containerInfoAbleEnable = new SelectView({
                el: t.$el.find('.infoAbleContainer')
            }, {}, btnEnableAttr);

            //create button enable
            t.containerCreateBtnEnable = new SelectView({
                el: t.$el.find('.createBtnContainer')
            }, {}, btnEnableAttr);
            //update button enable
            t.containerUpdateBtnEnable = new SelectView({
                el: t.$el.find('.updateBtnContainer')
            }, {}, btnEnableAttr);
            //search button enable
            t.containerSearchBtnEnable = new SelectView({
                el: t.$el.find('.searchBtnContainer')
            }, {}, btnEnableAttr);
            //cancel button enable
            t.containerCancelBtnEnable = new SelectView({
                el: t.$el.find('.cancelBtnContainer')
            }, {}, btnEnableAttr);
            var orderByRuleType = {
                datasource: {
                    datasource: "static",
                    data: [{
                        text: '升序',
                        value: 'asc'
                    }, {
                        text: '降序',
                        value: 'desc '
                    }]
                }
            };
            t.orderByRuleView = new SelectView({
                el: t.$el.find('.orderbyRuleContainer')
            }, {}, orderByRuleType);
            var gridType = {
                datasource: {
                    datasource: "static",
                    data: [{
                        text: '带分页的列表',
                        value: 'Page'
                    }, {
                        text: '不带分页的列表',
                        value: 'List'
                    }, {
                        text: '树形结构',
                        value: 'Tree'
                    }]
                }
            };
            t.containerGridType = new SelectView({
                el: t.$el.find('.gridTypeContainer')
            }, {}, gridType);

            t.gapConfigView = new GapConfigView({
                el: t.$el.find('.gapConfigContainer')
            }, {});
            //父节点字段选择器
            if (!t.parentSelectionView || t.parentSelectionView == null) {
                t.parentSelectionView = new FieldSelectionView({
                    el: $('.parentContainer')
                }, {
                    currentContainerId: t.config.containerBean.id,
                    identified: t.config.containerBean['oi'],
                    connPathTextFieldName: 'parentConnectorPath',
                    fieldNameTextFieldName: 'parent',
                    fieldSerialNumberFieldName: 'parentFieldSerialNumber',
                    btnWidth: 4,
                    textWidth: 8,
                    noGap: true
                });
            }

            if (!t.parentValueSelectionView || t.parentValueSelectionView == null) {
                t.parentValueSelectionView = new FieldSelectionView({
                    el: $('.parentValueContainer')
                }, {
                    currentContainerId: t.config.containerBean.id,
                    identified: t.config.containerBean['oi'],
                    connPathTextFieldName: 'parentValueConnectorPath',
                    fieldNameTextFieldName: 'parentValue',
                    fieldSerialNumberFieldName: 'parentFieldSerialNumber',
                    btnWidth: 4,
                    textWidth: 8,
                    noGap: true
                });
            }
        },
        _showParentSelection: function(value) {
            var t = this;
            var parentBody = t.$el.find('.parent');
            var parentValueBody = t.$el.find('.parentValue');
            var rootValueBody = t.$el.find('.rootValue');
            if ($nvwa.string.isVerify(value) && value == 'Tree') {
                parentBody.removeClass('hidden');
                parentValueBody.removeClass('hidden');
                rootValueBody.removeClass('hidden');
            } else {
                parentBody.addClass('hidden');
                parentValueBody.addClass('hidden');
                rootValueBody.addClass('hidden');
            }
        },
        showControl: function() {
            var t = this;
            ControlUtil.showControl(t.$el, t.config.supportAttribute);
            ControlUtil.showControl(t.$el, t.config.supportServerAttribute);
        },
        //设置表单的值
        setForm: function(fieldName, value) {
            var t = this;
            switch (fieldName) {
                case 'style':
                    t.containerStyle.setValue(value);
                    break;
                case 'paging':
                    t.containerPagingEnable.setValue(value);
                    break;
                case 'searchingAble':
                    t.containerSearchingAbleEnable.setValue(value);
                    break;
                case 'infoAble':
                    t.containerInfoAbleEnable.setValue(value);
                    break;
                case 'createAble':
                    t.containerCreateBtnEnable.setValue(value);
                    break;
                case 'updateAble':
                    t.containerUpdateBtnEnable.setValue(value);
                    break;
                case 'searchAble':
                    t.containerSearchBtnEnable.setValue(value);
                    break;
                case 'cancelAble':
                    t.containerCancelBtnEnable.setValue(value);
                    break;
                case 'gridType':
                    t.containerGridType.setValue(value);
                    t._showParentSelection(value);
                    break;
                case 'gapConfig':
                    t.gapConfigView.setValue(value);
                    break;
                case 'orderByRule':
                    t.orderByRuleView.setValue(value);
                    break;
                default:
                    t.$el.find('[fieldName="' + fieldName + '"]').val(value);
                    break;
            }
        },
        //获取表单的值
        getForm: function(fieldName) {
            var t = this;
        }

    });
    return EditorContainerAttributeView;
});