define([
    'js/core/container/view/base_container',
    'text!js/core/container/template/grid.tpl',
    'js/util/api/mc',
    'js/util/dictionary',
    'js/util/string',
    'js/core/container/util/view/pagination',
    'js/util/ui/view/fieldSelection',
    'js/util/ui/view/modal',
    'js/core/module/nvwaUser',
    'achy/widget/ui/message',
], function(BaseContainerView, FormTpl, MC, Dictionary, StringUtil, PaginationView, FieldSelectionView, Modal, NVWAUserAPI, Message) {
    var GridView = BaseContainerView.extend({
        events: {
            "update": "__updateEvent",
            "create": "__createEvent",
            "search": "__searchEvent",
            "view": "__viewEvent",
            "delete": "__deleteEvent",
            "getData": "getData"
        },
        initialize: function(options, containerBean, attributes, eves, elements, elementLayout, editAble) {
            var t = this;
            t.defaultClientAttribute = {
                title: '请添加标题',
                style: "primary",
            };
            BaseContainerView.prototype.initialize.apply(this, arguments);
            t.elementLayout = elementLayout;
            t.options = options;
            t.$el = options.el;
            t.render();
            t.reload();
            t.initListener();
            t.initAttribute();
        },
        //init the listener for catch the events
        initListener: function() {
            var t = this;
            //init search event
            t.$el.on('reload', function(e, data) {
                //reload grid data
                t.reload();
            });
        },
        //init client attribute 
        initAttribute: function() {
            var t = this;
            if (t.attributes && typeof(t.attributes) == 'object') {
                //setting client attribute to form container
                $.each(t.attributes, function(attrName, attrValue) {
                    t.setAttribute(attrName, attrValue);
                });
            }
            if (!t.editAble && t.attributes) {
                if ($nvwa.string.isVerify(t.attributes.title)) {
                    if (t.defaultClientAttribute.title == t.attributes.title) {
                        t._hiddenTitle();
                    }
                }
            }
        },
        __getSelectionID: function(selection) {
            var t = this;
            if (selection) {
                return selection[0].value;
            } else {
                _log('__getSelectionID no selection model');
                return null;
            }
        },
        //render modal form
        __renderFormModal: function(title, mode, containerAlias, id, handler) {
            var t = this;
            title = title || '添加';
            if (containerAlias) {
                MC.containerLayout(containerAlias, function(response) {
                    if (response && response.ok && response.dataMap) {
                        var dataMap = response.dataMap;
                        if (dataMap.container) {
                            var containerView = dataMap.container;
                            _log(containerView);
                            //render modal
                            t.formView = [];
                            t.formView.container = $('<div></div>');
                            //disable attribute
                            containerView.containerClientAttribute['searchAble'] = false;
                            switch (mode) {
                                case Dictionary.ContainerModeType.Create:
                                    containerView.containerClientAttribute['updateAble'] = false;
                                    break;
                                case Dictionary.ContainerModeType.Update:
                                    containerView.containerClientAttribute['createAble'] = false;
                                    break;
                                case Dictionary.ContainerModeType.View:
                                    containerView.containerClientAttribute['updateAble'] = false;
                                    containerView.containerClientAttribute['createAble'] = false;
                                    break;
                                default:
                                    break;
                            }
                            //render form container
                            t._renderForm(t.formView.container, id,
                                containerView.container,
                                containerView.containerClientAttribute,
                                containerView.clientEvents,
                                containerView.elementViews,
                                containerView.elementLayout);
                            t.formView.dialog = new Modal({
                                title: title,
                                content: t.formView.container
                            });
                            //close form 
                            t.formView.container.on('container.form.close', function(e) {
                                t.formView.dialog.hide();
                            });
                            //after update success, close form
                            t.formView.container.on('container.form.afterUpdate', function(e) {
                                t.formView.dialog.hide();
                                t.reload();
                            });
                            //after create success,close form
                            t.formView.container.on('container.form.afterCreate', function(e) {
                                t.formView.dialog.hide();
                                t.reload();
                            });

                        } else {
                            _log('container is null');
                        }
                    } else {
                        _log('loading container view false');
                    }
                });
            } else {
                _log('form container alias is not found!');
            }
        },
        //catch create event
        __createEvent: function(e, data) {
            var t = this;
            //create object to database
            //render form modal for create
            t.__renderFormModal('添加', Dictionary.ContainerModeType.Create, data);
        },
        //catch update event
        __updateEvent: function(e, data) {
            var t = this;
            var selection = t.getData();
            var selectionID = t.__getSelectionID(selection);
            if (selectionID) {
                t.__renderFormModal('修改', Dictionary.ContainerModeType.Update, data, selectionID);
            } else {
                _log('no selectionID');
            }
        },
        //catch search event
        __searchEvent: function(e, data) {
            var t = this;
            //search data
            _log('grid container=' + t.containerBean.alias);
            var searchData = StringUtil.objectToJsonString(data);
            _log('search from=' + searchData);
            //trigger container.grid.search
            t.paginationView.search(searchData);
        },
        //catch view event
        __viewEvent: function(e, data) {
            var t = this;
            //view object for selection 
            var selection = t.getData();
            var selectionID = t.__getSelectionID(selection);
            if (selectionID) {
                t.__renderFormModal('查看', Dictionary.ContainerModeType.View, data, selectionID);
            } else {
                _log('no selectionID');
            }
        },
        //catch delete event
        __deleteEvent: function(e, data) {
            var t = this;
            //delete selection
            var selection = t.getData();
            var selectionID = t.__getSelectionID(selection);
            if (selectionID) {
                //delete confirm
                new Modal.Confirm({
                    title: '删除',
                    content: '是否删除该数据',
                    yes: function() {
                        if (!t.containerBean && t.containerBean['alias']) {
                            _log('no containerBean or alias');
                        } else {
                            //do delete action
                            NVWAUserAPI.deleteById(null, t.containerBean['alias'], selectionID, function() {
                                new Message({
                                    type: 'info',
                                    msg: '删除数据成功',
                                    timeout: 1500
                                });
                                t.reload();
                            }, function(errorCode, errorMessage) {
                                //delete false
                                new Message({
                                    type: 'warn',
                                    msg: '删除数据失败',
                                    timeout: 1500
                                });
                                _log(errorCode);
                                _log(errorMessage);
                            });
                        }
                    }
                });
            } else {
                //no selection id
            }
        },
        //hidden grid title
        _hiddenTitle: function() {
            var t = this;
            t.$el.find('.panel-heading').hide();
        },
        //reload grid data
        reload: function() {
            var t = this;
            if (t.paginationView) {
                t.paginationView = null;
                t.$el.find('.panel-body').html('');
            }
            t.initLayout();
            t.setFieldSelection();
        },
        //init grid layout
        initLayout: function() {
            var t = this;
            var gridContainer = this.$el.find('.panel-body');
            t.paginationView = new PaginationView(
                gridContainer,
                t.containerBean, {}, //attributes
                {}, //event name array
                t.elements, //elements object array
                eval("(" + t.elementLayout.layouts + ")"), //layout object
                t.editAble
            );
        },
        //设置字段选择器
        setFieldSelection: function() {
            var t = this;
            if (!t.fieldSelectionView || t.fieldSelectionView == null) {
                //声明选择器控件
                t.fieldSelectionView = new FieldSelectionView({
                    el: $('#addFieldArea')
                }, {
                    identified: t.containerBean['oi'],
                    connPathTextFieldName: 'connPath',
                    fieldNameTextFieldName: 'conditionFieldName',
                    fieldSerialNumber: 'fieldSerialNumber',
                    currentContainerId: t.containerBean.id,
                    btnWidth: 4,
                    textWidth: 8
                }, {
                    onSelect: function(fieldName, connPath, fieldSerialNumber) { //TODO 这里一堆回调的嵌套以后再优化吧
                        var getElementLayoutFormServer = function(handler) {
                            MC.readContainerLayoutForPreview(t.containerBean.alias, handler);
                        };
                        //选择完字段以后直接添加到页面上
                        MC.addElement({
                            //创建元素的表单
                            name: fieldName,
                            componentAlias: '',
                            containerId: t.containerBean.id
                        }, function(response) {
                            if (response && response.ok) {
                                if (response.dataMap.id > 0) {
                                    //从服务器拿份最新的布局信息
                                    getElementLayoutFormServer(function(beforeLayout) {
                                        if (beforeLayout && beforeLayout.ok) {
                                            //read new layout
                                            t.elementLayout = beforeLayout.dataMap.container.elementLayout;
                                            t.elements = beforeLayout.dataMap.container.elementViews;
                                            //更新服务器属性
                                            MC.updateElementServerAttribute({
                                                elementId: response.dataMap.id,
                                                fieldName: fieldName,
                                                connectorPath: connPath,
                                                fieldSerialNumber: fieldSerialNumber
                                            }, function(updateElementServerAttributeResponse) {
                                                if (updateElementServerAttributeResponse && updateElementServerAttributeResponse.ok) {
                                                    //更新布局
                                                    //获取之前的布局
                                                    var layouts = eval("(" + t.elementLayout.layouts + ")");
                                                    //在列尾添加新的元素
                                                    layouts.unfixed.push(response.dataMap.id);
                                                    //更新布局信息
                                                    MC.updateElementLayout({
                                                        containerAlias: t.containerBean['alias'],
                                                        layouts: StringUtil.objectToJsonString(layouts)
                                                    }, function(layoutsResponse) {
                                                        if (layoutsResponse && layoutsResponse.ok) {
                                                            //更新布局成功后
                                                            //读取更新后的布局
                                                            getElementLayoutFormServer(function(afterLayout) {
                                                                if (afterLayout && afterLayout.ok) {
                                                                    if (afterLayout.dataMap && afterLayout.dataMap.container) {
                                                                        //read new layout
                                                                        t.elementLayout = afterLayout.dataMap.container.elementLayout;
                                                                        t.elements = afterLayout.dataMap.container.elementViews;
                                                                        //reload grid
                                                                        t.reload();
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
                //绑定事件
                var addFieldButton = $('#addField');
                addFieldButton.on('click', function(e) {
                    t.fieldSelectionView.showSelection();
                });
            }
        },
        //渲染容器
        _renderForm: function(el, id, containerBean, containerClientAttribute, clientEvents, elementViews, elementLayout) {
            var t = this;
            requirejs(["js/core/container/view/form"], function(FormView) {
                t.formContainerView = new FormView({
                        el: el
                    },
                    containerBean,
                    containerClientAttribute,
                    clientEvents,
                    elementViews,
                    elementLayout, false);
                //check id exist
                if (id) {
                    //loading form data
                    t.formContainerView.loadData(id);
                }
            });
        },
        //render grid
        render: function() {
            this.$el.html(tpl(FormTpl, {
                formBean: this.formBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            switch (attributeName) {
                case 'title':
                    t.$el.find('.panel-title').html(attributeValue);
                    break;
                case 'width':
                    if (StringUtil.strToInt(attributeValue)) {
                        t.$el.find('[container="grid"]').css('width', attributeValue + 'px');
                    }
                    break;
                case 'style':
                    t.$el.children('div').attr('class', 'panel panel-' + attributeValue);
                    break;
                default:
                    return;
            }
        },
        //get select row data
        getData: function() {
            var t = this;
            var selectData = t.paginationView.getSelectionRowData(true);
            if (selectData) {
                if (t.elements && t.elements.length > 0) {
                    if (t.elementLayout && t.elementLayout.layouts) {
                        //read layouts
                        var layouts = $nvwa.string.jsonStringToObject(t.elementLayout.layouts);
                        if (layouts && layouts.unfixed && layouts.unfixed.length > 0) {
                            var unfixedLayouts = layouts.unfixed;
                            var data = [];
                            $.each(unfixedLayouts, function(i, eleId) {
                                eleId = $nvwa.string.strToInt(eleId);
                                if (eleId) {
                                    $.each(t.elements, function(i, elementView) {
                                        if (elementView && elementView.element && elementView.element.id && elementView.element.id == eleId) {
                                            data.push({
                                                element: elementView.element,
                                                value: selectData[elementView.element.fieldSerialNumber]
                                            })
                                        }
                                    });
                                }
                            });
                            _log('getData');
                            _log(data);
                            return data;
                        } else {
                            _log('no layouts');
                        }
                    }
                } else {
                    _log('t.elements is null');
                    return null;
                }
            } else {
                _log('no select data');
                //no select data
                return null;
            }
        },
        supportAttribute: function() {
            return ['width', 'title', 'style'];
        },
        supportServerAttribute: function() {
            return ['pageSize', 'gridType', 'orderBy', 'orderByRule', 'groupBy'];
        },
        supportEventNames: function() {
            return ['click'];
        },
        supportServerEventNames: function() {
            return ['onRequest', 'beforeGrid', 'afterGrid', 'beforeDelete', 'afterDelete'];
        }
    });
    return GridView;
});