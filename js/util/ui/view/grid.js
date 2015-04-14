/**
 *grid组件
 */
define([
    'backbone',
    'underscore',
    'text!js/util/ui/template/grid.html',
    'achy/widget/ui/message'
], function(Backbone, _, gridTpl, Message) {
    var GridView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                containerId: 0,
                //label的宽度
                labelCol: null,
                //编辑器宽度
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //前缀
                prefix: null,
                //是否禁用
                disabled: false,
                //是否只读
                readonly: false,
                //表单大小
                size: null,
                //PlaceHolder
                placeholder: null,
                //编辑器类型
                type: 'grid',
                //Feedback
                feedback: null,
                //=============grid 属性=========
                title: 'this is a grid', //标题
                showTitle: false, //是否显示标题
                showHeader: true, //显示表头
                showPagination: true, //显示分页控件
                hiddenId: false, //隐藏id列
                pageSize: 20, //分页尺寸
                page: 1, //页数
                conditions: [], //条件{fieldName:'name',fieldValue:'value'}
                currentPage: 1, //当前页数
                totalPages: 1, //总计页数
                totalRecords: 0, //总条目数
                columns: [], //列名
                currentRecords: [], //表格数据
                loadPageEvent: null, //载入页面数据的http事件
                multiSelect: false, //是否支持多选
                selectIndex: [], //grid选中的row idnex
                selectRowData: null, //grid选中的Row data
                selectRowsData: [], //grid选中的Row data (多选)
                indexColumnName: 'id', //索引列的字段名称
                keyword: null //Global search keyword
            }, config);
            t.config = config;
        },
        /**
         * 加载数据
         * @param  {[type]} config [description]
         * @return {[type]}        [description]
         */
        loadData: function(config) {
            var t = this;
            config = $.extend(t.config, config);
            t.config = config;
            if (t.config.loadPageEvent && t.config.loadPageEvent != null) {
                t.config.loadPageEvent(function(data) {
                    t.config = $.extend(t.config, data);
                    t.render();
                }, t.config);
            }
        },
        /**
         * 组装分页控件
         */
        setPagination: function() {
            var t = this;
            var config = t.config;
            var maxSize = 9;
            //获取分页控件的容器
            var container = t.$el.find('#' + config.containerId + '-pagination');
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

        },
        //行选中事件（目前只支持单选）
        setRowSelectEvent: function() {
            var t = this;
            var table = t.$el.find('#' + t.config.containerId + '-table');
            var clearSelection = function(table) {
                //移除所有选中样式
                table.find('.rows').removeAttr('style');
            }
            table.bind('click', function(e) {
                clearSelection(table);
                //获取选中行的dom节点
                var rowRow = e.target.parentNode;
                //获取rowIndex
                var rowIndex = rowRow.attributes['rowIndex'].value;
                //获取rowData
                var selectModuleData = t.config.currentRecords[rowIndex];
                //将选中的rowData赋值到config的全局变量中
                t.config.selectRowData = selectModuleData;
                //改变选中行的样式
                $(rowRow).css({
                    "color": "#583d11",
                    "background": "#ffcb2f"
                });
            });
        },
        /**
         * 返回选中的数据
         * @return {[type]} [description]
         */
        getSelectionRowData: function(allowIgnore) {
            var t = this;
            var selectRowData = t.config.selectRowData;
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
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(_.template(gridTpl, {
                options: this.options,
                config: t.config
            }));
            if (t.config.showPagination) {
                t.setPagination();
            }
            t.setRowSelectEvent();
            return t;
        }
    });
    return GridView;
});