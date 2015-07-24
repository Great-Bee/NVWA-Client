define('js/core/container/util/view/dtPagination', [
    'backbone',
    'js/util/string',
    'js/core/module/nvwaUser',
    'js/bower_components/achy/message',
    'js/util/ui/view/modal',
    'js/util/api/mc',
    'js/core/container/util/view/attribute',
    'text!js/core/container/util/template/dtPagination.tpl',
    'jqueryui',
    'js/bower_components/jquery-dataTable/media/js/jquery.dataTables.min',
    'js/bower_components/jquery-dataTable/extensions/FixedColumns/js/dataTables.fixedColumns.min',
    'js/bower_components/jquery-dataTable/media/js/dataTables.bootstrap',
], function(Backbone, StringUtil, NvwaUser, Message, Modal, MC, AttributeView, DtPaginationTpl) {
    var DtGridView = Backbone.View.extend({
        events: {
            'click .removeable': 'removeField',
            'deleteElement': '_deleteElement',
            'click .item': '_showColumnAttribute',
            'click .attributeBtn': '_showColumnAttribute'
        },
        initialize: function(options, eleBean, attributes, eves, elements, layouts, editAble) {

            var t = this;
            var addCss = function(cssurl) {
                    var link = document.createElement('link');
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.href = cssurl;
                    document.getElementsByTagName("head")[0].appendChild(link);
                }
                //   addCss('js/bower_components/jquery-dataTable/media/css/jquery.dataTables.min.css');
            addCss('js/bower_components/jquery-dataTable/media/css/dataTables.bootstrap.css');

            this.$el = options;
            var serialNumber = eleBean['serialNumber'];
            if (!serialNumber) {
                eleBean['serialNumber'] = StringUtil.randomSN();
            }
            this.searchBean = null;
            this.eleBean = eleBean;
            this.elements = [];
            this.layouts = layouts;
            //按照layout组装grid序列
            this.elementsSerialization(elements);
            this.initMockMap(this.elements);
            //默认客户端属性
            this.defaultAttributes = {
                //=============grid 属性=========
                showHeader: true, //显示表头
                showPagination: true, //显示分页控件
                pageSize: 20, //分页尺寸
                page: 1, //页数
                conditions: [], //条件{fieldName:'name',fieldValue:'value'}
                loadPageEvent: null, //载入页面数据的http事件（重构）
                multiSelect: false, //是否支持多选，当前只能单选，多选还未实现
                indexColumnName: 'id', //索引列的字段名称
                keyword: null, //Global search keyword
                //================基础属性================
                //元素类型
                type: 'pagination',
                //Feedback
                feedback: null,

                //========dt grid   dataTable 默认属性=========
                dtScrollY: '500px', //垂直滚动，
                dtScrollX: true, //水平滚动
                scrollCollapse: true, //开启上下滚动条
                paging: false, //是否开启分页功能
                searchingAble: false, //是否启动过滤、搜索功能
                infoAble: false, //页脚的提示信息
                leftColumns: 1, //这里左边固定列可以设置固定一列
                rightColumns: 0, //右边固定列0列
                //========dt grid   dataTable 属性=========

            };
            //默认数据属性
            this.defaultData = {
                columns: [], //列名
                currentRecords: [], //表格数据
                currentPage: 1, //当前页数
                totalPages: 1, //总计页数
                totalRecords: 0, //总条目数
                selectIndex: [], //grid选中的row idnex
                selectRowData: null, //grid选中的Row data
                selectRowsData: [], //grid选中的Row data (多选)
            };
            //属性合并
            attributes = $.extend({}, this.defaultAttributes, attributes);
            //属性
            this.attributes = attributes;
            //客户端事件的alias
            this.eves = eves || [];
            //可编辑
            this.editAble = editAble;
            //载入数据
            //    this.loadData(this.defaultAttributes);
            this.loadData(this.attributes);
            //绑定事件
            // this.bindEvents();
            if (this.editAble) {
                this.setListener();
            }
        },
        search: function(data) {
            var t = this;
            t.searchBean = data;
            t.loadData();
        },
        setListener: function() {
            var t = this;
            _log('pagination setListener');
            //监听异常
            t.$el.off().on('error', function(e, msg) {
                _log(msg);
            });
            t.$el.off().on('deleteElementLayout', function(e, id) {
                var layouts = t.layouts;
                var elementsTDs = t.$el.find('.dataTables_scroll .dataTables_scrollHead thead th');
                t.layouts.unfixed = [];
                $.each(elementsTDs, function(k, td) {
                    if ($(td).attr('elementId') != id) {
                        t.layouts.unfixed.push($(td).attr('elementId'));
                    }
                });
                //更新布局信息
                MC.updateElementLayout({
                    containerAlias: t.eleBean['alias'],
                    layouts: StringUtil.objectToJsonString(t.layouts)
                }, function(layoutsResponse) {
                    if (layoutsResponse && layoutsResponse.ok) {
                        //更新布局成功后     
                        t.elementsSerialization(t.elements);
                        t.loadData();
                    }
                });
            });

        },
        //remove element
        _deleteElement: function(e, id) {
            MC.deleteElement({
                id: id
            }, function(data) {
                if (data && data.ok) {
                    _log('删除元素成功');
                }
            });
        },
        //remove field
        removeField: function(e) {
            var t = this;
            // $(e.currentTarget).hide();
            _log(e.currentTarget.attributes['elementid'].value);
            t.confirm = new Modal.Confirm({
                title: '删除',
                content: '是否将这个字段从界面上移除',
                yes: function() {
                    deleteElement();
                }
            });
            //从布局上删除
            var deleteElement = function() {
                var elementId = e.currentTarget.attributes['elementid'].value;
                t.$el.trigger('deleteElement', [elementId]);
                t.$el.trigger('deleteElementLayout', [elementId]);
            }
        },
        render: function() {
            var t = this;
            _log(t.elements);
            _log(t.data);
            // 格式化data 单独写一个转换方法
            t._columnFormat();

            this.$el.html(tpl(DtPaginationTpl, {
                eleBean: t.eleBean, //containerBean
                attributes: t.attributes, //客户端属性
                editAble: t.editAble, //是否可编辑
                elements: t.elements,
                data: t.data //表格数据
            }));
            if (t.attributes.showPagination) {
                t.setPagination();
            }
            t.setRowSelectEvent();

            //添加dataTable插件
            var table = t.$el.find('#' + t.eleBean.serialNumber + '-table').DataTable({
                scrollY: t.attributes.dtScrollY || '500px', //垂直滚动，超过500px开始滚动
                scrollX: t.attributes.dtScrollX, //水平滚动
                scrollCollapse: t.attributes.scrollCollapse, //开启上下滚动条
                paging: t.attributes.paging, //是否开启分页功能
                searching: t.attributes.searchingAble, //是否启动过滤、搜索功能
                info: t.attributes.infoAble, //页脚的提示信息
            });
            new $.fn.dataTable.FixedColumns(table, {
                leftColumns: t.attributes.leftColumns, //这里左边固定列可以设置
                rightColumns: t.attributes.rightColumns //右边固定列
            });

            return this;
        },
        /**
         * 加载数据
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        loadData: function(config) {
            var t = this;
            //组装基础参数

            t.config = $.extend(t.attributes, config);
            t.config['container'] = t.eleBean['alias'];
            //set search bean
            if (t.searchBean && t.searchBean.length > 0) {
                t.config.searchBean = t.searchBean;
            }
            //设置数据源
            var loadPageEvent = NvwaUser.nvwaPage;
            //开始获取数据
            if (loadPageEvent && loadPageEvent != null) {
                loadPageEvent(function(data) {
                    //拿到服务器返回的数据以后,将数据合并过来
                    t.data = $.extend(t.defaultData, data);
                    //渲染表格
                    t.render();
                    //绑定拖拽column的event
                    if (t.editAble) {
                        t.bindDrag();
                    }

                }, t.config);
            }
        },
        elementsSerialization: function(elements) {
            var t = this;
            t.elements = [];
            $.each(t.layouts.unfixed, function(i, item) {
                $.each(elements, function(k, object) {
                    if (object.element.id == item) {
                        t.elements.push(object);
                        _log(object);
                    }
                });
            });
        },
        /**
         * 组装分页控件
         */
        setPagination: function() {
            var t = this;
            var config = t.data;
            var maxSize = 9;
            _log('setPagination');
            _log(t.data);
            if (t.data['totalRecords'] && t.data['pageSize']) {
                //获取分页控件的容器
                var container = t.$el.find('#' + t.eleBean.serialNumber + '-pagination');
                if (config.currentPage > 1) {
                    var previousBtn = $('<li class="enable"><a href="javascript:void(0)"> « </a></li>').appendTo(container);
                    previousBtn.bind('click', function(e) {
                        var parm = {
                            page: config.currentPage - 1
                        }
                        t.loadData(parm);
                    });
                } else {
                    var previousBtn = $('<li class="disabled"><a href="javascript:void(0)"> « </a></li>').appendTo(container);
                }
                var startIndex = config.currentPage - 3
                var endIndex = config.currentPage + 3
                if (startIndex < 1) {
                    startIndex = 1
                }
                if (endIndex > config.totalPages) {
                    endIndex = config.totalPages
                }
                for (var rowNum = startIndex; rowNum <= endIndex; rowNum++) {
                    var active = '';
                    if (rowNum == config.currentPage) {
                        active = 'class="active"';
                    }
                    var buttonLi = $('<li ' + active + '></li>').appendTo(container);
                    var button = $('<a href="javascript:void(0)" page="' + rowNum + '">' + rowNum + '</a>').appendTo(buttonLi);
                    button.bind('click', function(e) {
                        var parm = {
                            page: e.currentTarget.attributes['page'].value
                        }
                        t.loadData(parm);
                    });
                }
                if (config.currentPage < config.totalPages) {
                    var nextBtn = $('<li class="enable"><a href="javascript:void(0)"> » </a></li>').appendTo(container);
                    nextBtn.bind('click', function(e) {
                        var parm = {
                            page: config.currentPage + 1
                        }
                        t.loadData(parm);
                    });
                } else {
                    $('<li class="disabled"><a href="javascript:void(0)"> » </a></li>').appendTo(container);
                }
                if (config.totalRecords && config.totalRecords > 0) {
                    $('<li class="disabled"><a>当前第 ' + config.currentPage + ' 页,总共 ' + config.totalPages + ' 页,共 ' + config.totalRecords + ' 条记录</a></li>').appendTo(container);
                } else {
                    $('<li class="disabled"><a>当前查询无记录</a></li>').appendTo(container);
                }
                var refreshBtn = $('<li class="enable"><a href="javascript:void(0)">刷新</a></li>').appendTo(container);
                refreshBtn.bind('click', function(e) {
                    var parm = {
                        page: config.currentPage
                    }
                    t.loadData(parm);
                });
            }
        },
        //行选中事件（目前只支持单选）
        setRowSelectEvent: function() {
            var t = this;
            var table = t.$el.find('#' + t.eleBean.serialNumber + '-table');
            var clearSelection = function(table) {
                //移除所有选中样式
                table.find('.rows').removeAttr('style');
            };
            //将数据去SN化
            var __mockData = function(data) {
                var mockDataModel = {};
                if (t.mockMap) {
                    $.each(data, function(k, v) {
                        var fieldSN = t.mockMap[k];
                        if (fieldSN) {
                            mockDataModel[fieldSN] = v;
                        }
                    });
                }
                return mockDataModel;
            };
            table.on('click', function(e) {
                clearSelection(table);
                //获取选中行的dom节点
                var rowRow = e.target.parentNode;
                if (rowRow.attributes['rowIndex'] != undefined) {
                    //获取rowIndex
                    var rowIndex = rowRow.attributes['rowIndex'].value;
                    //获取rowData
                    var selectModuleData = t.data.currentRecords[rowIndex];
                    //将数据mock回按照字段序列号为KEY的中间数据集的模式
                    selectModuleData = __mockData(selectModuleData);
                    //将选中的rowData赋值到config的全局变量中
                    t.data.selectRowData = selectModuleData;
                    //改变选中行的样式
                    $(rowRow).css({
                        "color": "#583d11",
                        "background": "#ffcb2f"
                    });
                    _log(t.data.selectRowData);
                    _log(t.elements);
                }
            });
        },
        //初始化一个mock的map,用于从elementSN转换成fieldSN的数据集
        initMockMap: function(elementViews) {
            var t = this;
            t.mockMap = {};
            $.each(elementViews, function(i, eleView) {
                if (eleView && eleView.element && eleView.element.serialNumber && eleView.element.fieldSerialNumber) {
                    t.mockMap[eleView.element.serialNumber] = eleView.element.fieldSerialNumber;
                }
            });
        },
        /**
         * 返回选中的数据
         * @return {[type]} [description]
         */
        getSelectionRowData: function(allowIgnore) {
            var t = this;
            var selectRowData = t.data.selectRowData;
            if (selectRowData) {
                return selectRowData;
            } else if (!allowIgnore) {
                new Message({
                    type: 'warn',
                    msg: '请选择一行',
                    timeout: 1500
                });
            }
            return null;
        },
        /**
         * 刷新当前页面
         */
        refreshCurrentPage: function() {
            this.loadData();
        },
        //绑定拖拽event
        bindDrag: function() {
            var t = this;
            $.each(t.elements, function(i, ele) {
                $('#' + ele.element.id + '-header').draggable({
                    appendTo: "body",
                    helper: "clone",
                    revert: "invalid",
                    cursor: "move",
                    stop: function(event, ui) {
                        t.$el.find('.column-drop-area').addClass('hidden');
                    }
                }).on('drag', function(e) {
                    if (t.$el.find('.column-drop-area').hasClass('hidden')) {
                        _log('show');
                        t.$el.find('.column-drop-area').removeClass('hidden');
                    }
                });
            });
            $('.column-drop-area').droppable({
                over: function(event, ui) {
                    //改变颜色
                },
                out: function(event, ui) {
                    //改变颜色
                },
                drop: function(event, ui) {
                    //更新布局
                    var elementId = ui.draggable.parent().attr('elementId');
                    ui.draggable.parent().attr('elementId', $(event.target).parent().attr('elementId'));
                    $(event.target).parent().attr('elementId', elementId);

                    var layouts = t.layouts;
                    var elementsTDs = t.$el.find('.dataTables_scroll .dataTables_scrollHead thead th');
                    t.layouts.unfixed = [];
                    $.each(elementsTDs, function(k, td) {
                        t.layouts.unfixed.push($(td).attr('elementId'));
                    });
                    //更新布局信息
                    MC.updateElementLayout({
                        containerAlias: t.eleBean['alias'],
                        layouts: StringUtil.objectToJsonString(t.layouts)
                    }, function(layoutsResponse) {
                        if (layoutsResponse && layoutsResponse.ok) {
                            //更新布局成功后     
                            t.elementsSerialization(t.elements);
                            t.loadData();
                        }
                    });
                    _log(t.layouts.unfixed);
                }
            });
        },
        //格式化列表
        _columnFormat: function() {
            var t = this;
            $.each(t.elements, function(i, elem) {
                if (elem) {
                    var element = elem.element;
                    var data = t.data.currentRecords;
                    if (elem.elementClientAttribute) {
                        var title = elem.elementClientAttribute.text;
                        //设置title
                        if (title) {
                            $.each(t.elements, function(index, ele) {
                                if (element.id == ele.element.id) {
                                    t.elements[index].element.name = title;
                                }
                            });
                        }
                    }
                    if (elem.elementClientAttribute && elem.elementClientAttribute.columnConfig) {
                        var clientAttribute = eval('(' + elem.elementClientAttribute.columnConfig + ')'); //{"format":"number","digitNum":"1","isCoin":false}
                        $.each(data, function(index, column) {
                            var columnValue = column[element.serialNumber];

                            if (columnValue && clientAttribute) {
                                //选中设置属性的那列
                                var format = clientAttribute.format;
                                if (format && format == 'number') {
                                    var digitNum = clientAttribute['digitNum'];
                                    var isCoin = clientAttribute['isCoin'];
                                    columnValue = Number(columnValue).toFixed(digitNum);
                                    if (isCoin) {
                                        //货币模式
                                        var columnvalues = columnValue.split('.');
                                        var num = columnvalues[0];
                                        var temp = 0;
                                        var tempValue = '';
                                        for (var i = num.length - 1; i >= 0; i--) {
                                            tempValue = tempValue + num[i];
                                            temp++;
                                            if (temp >= 3 && i != 0) {
                                                tempValue = tempValue + ',';
                                                temp = 0;
                                            }
                                        }
                                        //倒叙
                                        var resultValue = '';
                                        var tempLen = tempValue.length;
                                        for (var i = 0; i < tempLen; i++) {
                                            resultValue = resultValue + tempValue[tempLen - 1 - i];
                                        }
                                        if (columnvalues.length > 1) {
                                            resultValue = resultValue + '.' + columnvalues[1];
                                        }
                                        column[element.serialNumber] = resultValue;
                                    } else {
                                        column[element.serialNumber] = columnValue;
                                    }
                                } else if (format && format == 'datetime') { //{"format":"datetime","datetime":"yyyy-mm-dd"}
                                    var format = clientAttribute['datetime'];
                                    var formatDate = new Date(columnValue).format(format);
                                    column[element.serialNumber] = formatDate;
                                }
                            }
                        });
                    }
                }
            });

        },
        _getClientAttributeIndexByEleId: function(elementId) {
            var t = this;
            var eles = t.elements;
            var index = 0;
            for (var i = 0; i < eles.length; i++) {
                if (eles[i].element.id == elementId) {
                    index = i;
                    break;
                }
            }
            return index;
        },
        //保存客户端属性
        _saveClientAttributes: function(saveData) {
            var t = this;
            var clientAttr = {
                elementId: t['element']['id']
            }
            var index = t._getClientAttributeIndexByEleId(t['element']['id']);
            clientAttr = $.extend(clientAttr, t.elements[index].elementClientAttribute, saveData);
            t.elements[index].elementClientAttribute = clientAttr;
            MC.updateElementClientAttribute(clientAttr);
        },

        /**
         * 设置cloumn客户端属性
         */
        _showColumnAttribute: function(e) {
            var t = this;
            if (t.editAble) {
                var elementid = $(e.originalEvent.srcElement).attr("elementid");

                var index = t._getClientAttributeIndexByEleId(elementid);
                //读取element
                MC.readElement(elementid, function(elementBean) {
                    //get support attribute
                    var __getSupportAttribute = function() {
                        return ['text', 'columnFormat'];
                    };
                    //get defaule datasource schema list
                    var __getDatasourceSchemaList = function() {
                        return [{
                            name: "名称",
                            schema: "name"
                        }, {
                            name: "值",
                            schema: "value"
                        }];
                    };
                    var __getDatasourceConfig = function() {
                        return {
                            staticEnble: true,
                            dynamicEnble: true,
                            dynamicFieldEnble: true
                        };
                    };
                    var __getSupportServerAttribute = function() {
                        return [];
                    };
                    var __getSupportEventNames = function() {
                        return [];
                    };
                    var __getSupportServerEventNames = function() {
                        return [];
                    }

                    //hidden掉所有的右边面板
                    $('[data-collapse]').hide();
                    //显示属性面板
                    $('#elementSettings').html('');
                    //将element保存到t里面
                    t.element = elementBean;
                    t.elementSettings = new AttributeView({
                        el: $('#elementSettings')
                    }, {
                        clientAtttributes: t.elements[index].elementClientAttribute || {}, //server attribute
                        datasourceSchemaList: __getDatasourceSchemaList(),
                        datasourceConfig: __getDatasourceConfig(),
                        supportAttribute: __getSupportAttribute() //support client attribute
                            //    supportServerAttribute: __getSupportServerAttribute(), //support server attribute
                            //    supportEventNames: __getSupportEventNames(), //support client event name
                            //    supportServerEventNames: __getSupportServerEventNames() //support server event name
                    }, t.eleBean, elementBean, {
                        callbackEvent: function() {
                            //销毁窗口          
                            $('#' + t.serialNumber + '-settings').removeClass('btn-select');
                            $('#' + t.serialNumber + '-settings').addClass('btn-primary');
                        },
                        setClientAttribute: function(attributeName, attributeValue) {
                            t.refreshCurrentPage();
                        },
                        setClientAttributes: function(saveData) {
                            //将客户端属性保存到数据库
                            t._saveClientAttributes(saveData);
                        },
                        setServerAttributes: function(saveData) {
                            //没有服务端属性
                        },
                        rollbackClientAttr: function(clientAttr) {
                            //TODO回滚数据
                            $.each(clientAttr, function(k, attr) {
                                t.componentView.setAttribute(k, attr);
                            });
                            new Message({
                                type: 'info',
                                msg: '回滚当前元素客户端属性设置',
                                timeout: 1500
                            });
                        }
                    });
                    //激活控件
                    t.collapse = new jQueryCollapse($("#elementSettings"));
                    //默认打开第一和第二个tab
                    if (__getSupportAttribute() && __getSupportAttribute().length > 0) {
                        //说明当前元素上已经有组件,默认打开客户端属性和服务器属性这两个标签
                        t.collapse.open(0);
                        t.collapse.open(1);
                    }
                    //显示
                    $('#elementSettings').show();

                });
            }
        }
    });
    return DtGridView;
});