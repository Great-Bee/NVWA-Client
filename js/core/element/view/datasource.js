define('js/core/element/view/datasource', [
    'backbone', 'js/util/api/mc',
    'js/core/element/view/base_element',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/containerPaginationSelection',
    'text!js/core/element/template/datasource.tpl',
    'js/core/element/view/pageSelectButton',
], function(Backbone, MC, BaseElementView, Modal, Message, ContainerSelection, DatasourceTpl, PageSelectButtonView) {
    var DatasourceView = BaseElementView.extend({
        events: {
            "change .datasource": "_datasourceChoose",
            "click .add": "_addStaticData",
            "click .remove": "_removeStaticData",
            "selectedPage": "_renderContainerList",
            "change .containerSelect": "_containerSelect",
            "click .btn_debug": "__debug"
        },
        initialize: function(options, eleBean, attributes, eves, editAble) {
            var t = this;
            BaseElementView.prototype.initialize.apply(t, arguments);
            this.defaultAttributes = {
                schemaList: [{
                    name: "名称",
                    schema: "name"
                }, {
                    name: "值",
                    schema: "value"
                }],
                datasourceConfig: {
                    staticEnble: true,
                    dynamicEnble: true,
                    dynamicFieldEnble: true
                }
            };
            this.attributes = $.extend({}, this.defaultAttributes, attributes);
            _log(this.attributes);
            // debugger;
            t.render();
        },
        __debug: function() {
            _log(this.getValue());
            // this.setValue('{"datasource":"static","data":[{"name":"aaa","value":"bbb"},{"name":"ccc","value":"ddd"}]}');
            this.setValue('{"datasource":"dynamic","containerAlias":"grid_person","schema":{"name":"Element_54d71f83afbc0bb2ddd1cbcf6e6f03a0","value":"Element_0c5558ccd5a66910695382f9dbc9ac35"}}');
        },
        _containerSelect: function() {
            var t = this;
            var select = t.$el.find('.containerSelect');
            if ($nvwa.string.isVerify(select.val())) {
                t.__renderDynamicsource(select.val());
            }
        },
        __renderDynamicsource: function(alias, handler) {
            var t = this;
            var _tpl = [];
            _tpl.push("<a class='btn btn-primary' href='#container/grid/edit/<#=alias#>' target='_blank'>数据源:<#=alias#></a>");
            $('.dynamic label').html(tpl(_tpl.join(), {
                alias: alias
            })).data("alias", alias);
            t._renderSchema();
            MC.containerFieldElements(alias, function(response) {
                var elements = response['dataMap']['elements'] || [];
                t.$el.find(".schemaFields").each(function(i, schemaFieldsEle) {
                    var _tpl = [];
                    _tpl.push('<select class="form-control"><option value="">请选择字段</option>');
                    _tpl.push('<#for(i=0;i<elements.length;i++){#>');
                    _tpl.push('<option value="<#=elements[i]["serialNumber"]#>"><#=elements[i]["name"]#></option>');
                    _tpl.push('<#}#>');
                    _tpl.push('</select>');
                    $(schemaFieldsEle).html(tpl(_tpl.join(''), {
                        elements: elements
                    }));
                });
                if (handler) {
                    handler();
                }
                t.$el.trigger('afterLoadElement');
            });
        },
        _addStaticData: function(eve, data) {
            var t = this;
            var afterRow = null;
            if (eve) {
                afterRow = $(eve.currentTarget).parent().parent();
            }

            var rowHtml = [];
            rowHtml.push('<tr>');
            $.each(t.attributes.schemaList, function(i, schema) {
                rowHtml.push('<td><input type="text" schema="' + schema['schema'] + '" class="form-control input-sm"/></td>');
            });
            rowHtml.push('<td>');
            rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-plus add"></a>');
            rowHtml.push('<a href="javascript:void(0);" class="glyphicon glyphicon-minus remove"></a>');
            rowHtml.push('</td>');
            rowHtml.push('</tr>');

            var targetRow = null;
            if (afterRow) {
                targetRow = afterRow.after(rowHtml.join(''));
            } else {
                targetRow = $(rowHtml.join('')).appendTo(t.$el.find(".static tbody"));
            }
            if (data) {
                $.each(t.attributes.schemaList, function(i, schema) {
                    $($(targetRow).find("input").eq(i)).val(data[schema['schema']]);
                });
            }
        },
        _removeStaticData: function(eve) {
            var t = this;
            if (eve) {
                var num = t.$el.find(".static tbody").find("tr").length;
                if (num > 1) {
                    var currentTarget = $(eve.currentTarget);
                    currentTarget.parent().parent().remove();
                } else {
                    alert('不能删除');
                }
            }
        },

        _datasourceChoose: function(eve) {
            var datasourceType = $(eve.currentTarget).val();
            if (datasourceType && datasourceType.length > 0) {
                if (datasourceType == 'static') {
                    this.$el.find(".static").removeClass("hidden");
                    this.$el.find(".dynamic").addClass("hidden");
                } else if (datasourceType == 'dynamic') {
                    this.$el.find(".static").addClass("hidden");
                    this.$el.find(".dynamic").removeClass("hidden");
                }
            } else {
                this.$el.find(".static").addClass("hidden");
                this.$el.find(".dynamic").addClass("hidden");
            }
        },

        _renderSchema: function() {
            var t = this;

            var _tpl = [];
            _tpl.push('<#for(c=0;c<attributes.schemaList.length;c++){#>');
            _tpl.push('<th class="schema"><#=attributes.schemaList[c].name#>(<#=attributes.schemaList[c].schema#>)</th>');
            _tpl.push('<#}#>');
            var trEle = $(t.$el.find(".static table thead tr"));
            trEle.empty();
            trEle.append(tpl(_tpl.join(''), {
                attributes: t.attributes
            }))
            trEle.append('<th style="width:40px"></th>');
            $(t.$el.find(".static table tbody")).empty();
            t._addStaticData();

            var _tpl2 = [];
            _tpl2.push('<#for(c=0;c<attributes.schemaList.length;c++){#>');
            _tpl2.push('<tr class="schema">');
            _tpl2.push('<td><#=attributes.schemaList[c].name#>(<#=attributes.schemaList[c].schema#>)</td>');
            _tpl2.push('<td class="schemaFields"></td>');
            _tpl2.push('</tr>');
            _tpl2.push('<#}#>');
            var tbodyEle = $(t.$el.find(".dynamic table tbody"));
            tbodyEle.empty();
            tbodyEle.append(tpl(_tpl2.join(''), {
                attributes: t.attributes
            }));
        },

        render: function() {
            var t = this;
            this.$el.html(tpl(DatasourceTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            t._renderSchema();
            t._renderPageSelect();
            if (t.attributes && t.attributes.datasourceConfig) {
                if (!t.attributes.datasourceConfig.dynamicFieldEnble) {
                    //隐藏动态数据字段选择框
                    t.$el.find('.dynamic').find('table').hide();
                }
                if (!t.attributes.datasourceConfig.staticEnble) {
                    //隐藏静态数据选项       
                    t.$el.find('option[value="static"]').remove();
                    t.$el.find('.datasource').val('dynamic');
                    t.$el.find('.datasource').trigger('change');
                    // debugger;
                }
                if (!t.attributes.datasourceConfig.dynamicEnble) {
                    //隐藏动态数据选项
                    t.$el.find('option[value="dynamic"]').remove();
                    t.$el.find('.datasource').val('static');
                    t.$el.find('.datasource').trigger('change');
                }

            }
            return this;
        },
        _renderPageSelect: function() {
            var t = this;
            var body = t.$el.find('.btnPageContainer');
            t.pageSelect = new PageSelectButtonView({
                el: body
            }, {}, {});
        },
        _renderContainerList: function(e, data) {
            var t = this;
            var originalValue = t.pageSelect.getValue();
            var containerSelect = t.$el.find('.containerSelect');
            if (data && $nvwa.string.isVerify(data.alias)) {
                MC.readPageContainerAlias(data.alias, function(response) {
                    if (response && response.ok && response.dataMap && $nvwa.array.isVerify(response.dataMap.container)) {
                        containerSelect.children().remove();
                        $('<option value="">请选择数据源</option>').appendTo(containerSelect);
                        $.each(response.dataMap.container, function(i, item) {
                            var row = '<option value="' + item + '">' + item + '</option>';
                            $(row).appendTo(containerSelect);
                        });
                        containerSelect.trigger('change');
                        containerSelect.trigger('afterLoadData');
                    } else {
                        _log('can not read container alias list!');
                        _log('no page selected');
                        new Message({
                            type: 'error',
                            msg: '该页面下没有配置所属容器',
                            timeout: 1500
                        });
                        //如果选择的页面下没有下属容器，则回滚为之前的值
                        if (originalValue) {
                            t.pageSelect.setValue(originalValue);
                        }
                    }
                });
            } else {
                _log('no page selected');
                new Message({
                    type: 'error',
                    msg: '选择了无效的页面数据',
                    timeout: 1500
                });
            }
            _log('_renderContainerList');
            _log(data);
        },
        supportAttribute: function() {
            return [];
        },
        getDefaultAttribute: function() {
            return this.defaultAttributes;
        },
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            t._renderSchema();
        },
        getAttribute: function(attributeName) {
            return this.attributes[attributeName];
        },
        supportEventNames: function() {
            return [];
        },
        supportServerEventNames: function() {
            return [];
        },
        setValue: function(value) {
            var t = this;
            t._renderSchema();
            if (value && typeof value == 'string' && value.length > 0) {
                try {
                    value = eval("(" + value + ")") || {}
                } catch (e) {
                    _log(e);
                }
            }

            var datasource = value['datasource'];
            t.$el.find(".datasource").val(datasource);
            t.$el.find(".datasource").trigger('change');
            if (datasource == 'static') {
                var data = value['data'] || [];
                if (data && data.length > 0) {
                    $(t.$el.find(".static table tbody")).empty();
                    $.each(data, function(i, value) {
                        t._addStaticData(null, value);
                    });
                }
            } else if (datasource == 'dynamic') {
                t.__renderDynamicsource(value['containerAlias'], function() {
                    var schema = value['schema'];
                    //setting page select view
                    if (!$nvwa.string.isVerify(value['pageAlias'])) {
                        //如果没有pageAlias则打回
                        return;
                    }
                    if (t.pageSelect && t.pageSelect.setValue) {
                        t.pageSelect.setValue(value['pageAlias']);
                    } else {
                        _log('PageSelect view not found!');
                    }
                    //setting container select view
                    //loadData
                    t.$el.trigger('selectedPage', [{ //trigger to load element field info
                        alias: value['pageAlias'],
                        schema: schema
                    }]);
                    var containerSelect = t.$el.find('.containerSelect');
                    containerSelect.on('afterLoadData', function(e) {
                        containerSelect.val(value['containerAlias']);
                        // containerSelect.off('afterLoadData');
                    });
                    //setting field select view
                    t.$el.on('afterLoadElement', function(e) {
                        t.$el.find(".dynamic table tbody select").each(function(i, selectEle) {
                            $(selectEle).val(schema[t.attributes['schemaList'][i]['schema']]);
                        });
                        t.$el.off('afterLoadElement');
                    });
                });
            }
        },

        getValue: function() {
            var t = this;
            var value = {};
            var datasource = t.$el.find(".datasource").val();
            if (datasource && datasource.length > 0) {
                value['datasource'] = datasource;
                if (datasource == 'static') {
                    var data = [];
                    var rows = t.$el.find(".static table tbody").find("tr");
                    $.each(rows, function(i, row) {
                        var values = {};
                        var inputs = $(row).find("input");
                        $.each(t.attributes['schemaList'], function(j, schema) {
                            values[schema['schema']] = $(inputs[j]).val();
                        });
                        data.push(values);
                    });

                    value['data'] = data;
                } else if (datasource == 'dynamic') {
                    var alias = t.$el.find(".dynamic label").data('alias');
                    value['containerAlias'] = alias;
                    if (t.pageSelect && t.pageSelect.getValue) {
                        value['pageAlias'] = t.pageSelect.getValue();
                    } else {
                        _log('PageSelect view not found!');
                    }
                    var schema = {};
                    t.$el.find(".dynamic table tbody select").each(function(i, selectEle) {
                        schema[t.attributes['schemaList'][i]['schema']] = $(selectEle).val();
                    });
                    value['schema'] = schema;
                }
            }
            return JSON.stringify(value);
        }
    });
    return DatasourceView;
});