define([
    'underscore',
    'js/core/module/nvwaUser',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/select.html',
    'bootstrap-select'
], function(_, NvwaUserAPI, BaseElementView, StringUtil, SelectTpl, SelectControl) {
    var SelectView = BaseElementView.extend({
        events: {
            'click a[value]': 'onSelect',
            // 'afterLoadData': '_renderSelection',
            // 'afterRenderData': '',
            'click a[debug="true"]': '_debug'
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            this.defaultAttributes = {
                //编辑器宽度**
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //是否只读**
                readonly: false,
                //按钮大小** 对应 lg,sm,xs
                size: null,
                //PlaceHolder*
                placeholder: null,
                //元素类型                
                type: 'select',
                datasource: null
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            t.render();
            BaseElementView.prototype.bindEvents.apply(this, arguments);
        },
        render: function() {
            var t = this;
            this.$el.html(_.template(SelectTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            this.$el.on('afterLoadData', function() {
                t._renderSelection();
            });
            this.loadData();
            return this;
        },
        _renderSelection: function(e) {
            var t = this;
            if ($nvwa.array.isVerify(t.data)) {
                $.each(t.data, function(i, item) {
                    t._renderRow(item.text, item.value);
                });
                t.$el.find('ul[role="menu"]').removeClass('hidden');
                t.$el.trigger('afterRenderData');
            }
        },
        _renderRow: function(text, value) {
            var t = this;
            var body = t.$el.find('ul[role="menu"]');
            $('<li><a href="javascript:void(0);" value="' + value + '">' + text + '</a></li>').appendTo(body);
            if (body.hasClass('hidden')) {
                body.removeClass('hidden');
            }
        },
        onSelect: function(e) {
            var t = this;
            var selectEle = $(e.target);
            var selectValue = selectEle.attr('value');
            var selectText = selectEle.html();
            t.setValue(selectValue);
            if (t.events && t.events.onSelect && typeof(t.events.onSelect) == 'function') {
                t.events.onSelect(selectValue, selectText);
            }
            if (t.events && t.events.onChange && typeof(t.events.onChange) == 'function') {
                t.events.onChange(selectValue);
            }
            t.$el.trigger('change');
        },
        //提供给外部插入选项数据的接口
        appendItem: function(text, value) {
            this._renderRow(text, value);
        },
        //dataArray=[{text:'xxx', value='xxx'}]
        appendItems: function(dataArray) {
            var t = this;
            if ($nvwa.array.isVerify(dataArray)) {
                t.data = dataArray;
                $.each(dataArray, function(i, item) {
                    t._renderRow(item['text'], item['value']);
                });
            }
        },
        supportAttribute: function() {
            return ['helpLabel', 'readonly', 'size', 'placeholder', 'datasource'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['click', 'dblclick', 'mouseover', 'mouseleave', 'select'];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        getDatasourceSchemaList: function() {
            return [{
                name: "文本",
                schema: "text"
            }, {
                name: "值",
                schema: "value"
            }]
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            var label = t.$el.find('label');
            var editor = t.$el.find('textarea');
            switch (attributeName) {
                case 'editorCol':
                    if (attributeValue) {
                        var btnGroup = t.$el.find('.btn-group');
                        var btn = t.$el.find('button');
                        var btnGroupClass = btnGroup.attr('class');
                        var btnGroupClassArray = labelClass.split(" ");
                        $.each(btnGroupClassArray, function(i, item) {
                            if (item.indexOf('col-sm-')) {
                                btnGroup.removeClass(item);
                            }
                        });
                        btnGroup.addClass('col-sm-' + attributeValue);
                        var btnClass = btn.attr('class');
                        var btnClassArray = labelClass.split(" ");
                        $.each(btnClassArray, function(i, item) {
                            if (item.indexOf('col-sm-')) {
                                btn.removeClass(item);
                            }
                        });
                        btn.addClass('col-sm-' + attributeValue);
                    }
                    break;
                case 'size':
                    var btnEle = t.$el.find('button');
                    var btnClass = btnEle.attr('class');
                    var btnClassArray = btnClass.split(" ");
                    btnEle.removeClass('btn-lg');
                    btnEle.removeClass('btn-sm');
                    btnEle.removeClass('btn-xs');
                    if (attributeValue) {
                        btnEle.addClass('btn-' + attributeValue);
                    }
                    break;
                case 'disabled':
                    if (attributeValue) {
                        t.$el.find('ul').removeClass('hidden');
                        t.$el.find('ul').addClass('hidden');
                    } else {
                        t.$el.find('ul').removeClass('hidden');
                    }
                    break;
                case 'readonly':
                    if (attributeValue) {
                        t.$el.find('ul').removeClass('hidden');
                        t.$el.find('ul').addClass('hidden');
                    } else {
                        t.$el.find('ul').removeClass('hidden');
                    }
                    break;
                case 'datasource':
                    break;
                case 'helpLabel':
                    var helpBlock = t.$el.find('.help-block');
                    if (attributeValue) {
                        //如果没有show属性则加上
                        if (!helpBlock.hasClass('show')) {
                            helpBlock.addClass('show');
                        }
                        //如果有隐藏属性则去掉
                        if (helpBlock.hasClass('hidden')) {
                            helpBlock.removeClass('hidden');
                        }
                        helpBlock.html(attributeValue);
                    } else {
                        helpBlock.removeClass('show');
                        helpBlock.addClass('hidden');
                    }
                    break;
                default:
                    return;
            }
        },
        setValue: function(value) {
            var t = this;
            var __setValue = function() {
                var selectText = t.$el.find('a[value="' + value + '"]').html();
                t.$el.find('input').val(value);
                t.$el.find('t').html(selectText);
            };
            //如果 t.data 已经完成加载，则直接setdata
            // 如果 t.data 没有加载上,则等候加载完数据后就可以setdata
            if ($nvwa.array.isVerify(t.data)) {
                __setValue();
            } else {
                t.$el.on('afterRenderData', function(e) {
                    //取消监听
                    t.$el.off('afterRenderData');
                    __setValue();
                });
            }
        },
        getValue: function() {
            var t = this;
            _log(t.$el.find('input'));
            return t.$el.find('input').val();
        },
        setEvent: function(functionObject) {
            var t = this;
            t.events = $.extend({
                onSelect: function(selectValue, selectText) {
                    //default todo
                },
                onChange: function(selectValue) {
                    //default todo
                }
            }, functionObject);
        },
        _debug: function(e) {
            //debug
            // this.setValue('34');
            var value = this.getValue();
            _log('the value is ');
            _log(value);
        }
    });
    return SelectView;
});