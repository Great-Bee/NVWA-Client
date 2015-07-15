/**
 *search 组件
 **/
define('js/util/ui/view/fieldSelection', [
        'backbone',

        'text!js/util/ui/template/fieldSelection.tpl',
        'text!js/util/ui/template/fieldSelectionBody.tpl',
        'text!js/util/ui/template/fieldSelectionFieldItem.tpl',
        'js/bower_components/achy/message',
        'js/util/ui/view/modal',
        'js/util/api/oi'
    ],
    function(Backbone, FieldSelectionTpl, FieldSelectionBodyTpl, FieldSelectionFieldItemTpl, Message, Modal, OI) {
        var FieldSelectionView = Backbone.View.extend({
            events: {
                'click .btn-fieldSelection': 'showSelection'
            },
            /**
             * 初始化
             * @param  {[type]} options [description]
             * @param  {[type]} config  [description]
             * @return {[type]}         [description]
             */
            initialize: function(options, config, events) {
                var t = this;
                config = $.extend({
                        currentContainerAlias: null,
                        currentContainerId: null,
                        currentConnPath: null, //当前选择的连接器路径
                        containerId: null,
                        identified: null, //root oi identified
                        lastSelect: null,
                        connPathTextFieldName: null,
                        fieldNameTextFieldName: null,
                        fieldSerialNumberFieldName: 'fieldSerialNumber',
                        labelWidth: 0,
                        btnWidth: 0,
                        textWidth: 0,
                        noGap: false
                    },
                    config);
                t.eves = $.extend({
                    onSelect: function(fieldName, connPath) {

                    }
                }, events);
                t.config = config;
                t.options = options;
                t.render();
            },
            /**
             * 渲染页面
             * @return {[type]} [description]
             */
            render: function() {
                var t = this;
                t.$el.html('');
                var element = $(tpl(FieldSelectionTpl, {
                    options: t.options,
                    config: t.config
                })).appendTo(t.$el);
                return t;
            },
            showSelection: function(e, handler) {
                _log(e);
                _log(handler);
                var t = this;
                t.viewDialog = {};
                t.viewDialog.container = $('<div></div>');
                t.selectionTreeView = $(tpl(FieldSelectionBodyTpl, {})).appendTo(t.viewDialog.container);
                //获取OI
                if (!t.config.identified) {
                    _log('没有identified');
                }
                t.loadNode(t.selectionTreeView.find('.root-node'), t.config.identified, true);

                t.viewDialog.dialog = new Modal({
                    title: '选择字段',
                    content: t.viewDialog.container
                });
                t.viewDialog.container.on('hidden', function(e) {
                    _log('t.viewDialog.container hidden');
                });
            },
            hideSelection: function() {
                var t = this;
                $(t.viewDialog.dialog).modal('hide');
            },
            loadNode: function(ele, identified, isRoot, connPath) {
                var t = this;
                var requestData = {
                    identified: identified
                };
                if (t.config.currentContainerId) {
                    requestData['currentContainerId'] = t.config.currentContainerId;
                } else if ($nvwa.string.isVerify(t.config.currentContainerAlias)) {
                    requestData['currentContainerAlias'] = t.config.currentContainerAlias;
                }

                OI.getConnectorTree(function(data) {
                    if (data && data.ok) {
                        ele.find('c').html('<a class="btn-Connector" href="JavaScript:void(0);" toOI="' + identified + '"> ' + data['dataMap']['text'] + '</a>');
                        t._renderFields(data['dataMap']['fields'], connPath, data['dataMap']['currentContainerSelectedFieldSN']);
                        //设置连接器                    
                        t._renderConnectors(identified, data['dataMap']['connectors'], connPath, ele, isRoot);
                    } else {
                        _log('response false');
                    }
                }, requestData);
            },
            _renderFields: function(fields, connPath, currentContainerSelectedFieldSN) {
                var t = this;
                var config = t.config;
                if ($nvwa.array.isVerify(fields)) {
                    var fieldContainer = $('.selection-field-list');
                    //设置字段
                    fieldContainer.html('');
                    $.each(fields, function(i, field) {
                        var haveSelected = $nvwa.array.have(currentContainerSelectedFieldSN, field.serialNumber);
                        var item = $(tpl(FieldSelectionFieldItemTpl, {
                            field: field,
                            connPath: connPath,
                            haveSelected: haveSelected
                        })).appendTo(fieldContainer);
                        item.find('button').popover({
                            trigger: 'hover',
                            html: true
                        });
                        item.find('button').bind('click', function(e) {
                            var fieldName = $(e.target).attr('field') || '';
                            var connPath = $(e.target).attr('connPath') || '';
                            var fieldSerialNumber = $(e.target).attr('fieldSerialNumber') || '';
                            _log('fieldName=' + fieldName);
                            _log('connPath=' + connPath);
                            //弹出确认窗口
                            new Modal.Confirm({
                                title: '提示',
                                content: '是否添加字段 ' + fieldName,
                                yes: function() {
                                    //给隐藏域赋值
                                    t.$el.find('input[fieldName="' + config.fieldNameTextFieldName + '"]').val(fieldName);
                                    t.$el.find('input[fieldName="' + config.connPathTextFieldName + '"]').val(connPath);
                                    t.$el.find('input[fieldName="' + config.fieldSerialNumberFieldName + '"]').val(fieldSerialNumber);
                                    t.eves.onSelect(fieldName, connPath, fieldSerialNumber);
                                    t.hideSelection();
                                }
                            });
                        });
                    });
                } else {
                    _log('no fields');
                }
            },
            _renderConnectors: function(identified, connectors, connPath, ele, isRoot) {
                var t = this;
                var config = t.config;
                if ($nvwa.array.isVerify(connectors)) {
                    var connectorsContainer = ele.parent();
                    connectorsContainer.find('ul').remove();
                    $.each(connectors, function(i, connector) {
                        var connectorUL = $('<ul></ul>').appendTo(connectorsContainer);
                        var nodeType = "glyphicon ";
                        if (connector['next']) {
                            nodeType += 'glyphicon-resize-full';
                        } else {

                        }
                        if (connPath) {
                            connPath = connPath + ',' + connector['connector']['alias'];
                        } else {
                            connPath = connector['connector']['alias'];
                        }
                        var btnConnector = $('<li><span><i class="' + nodeType + '"></i><a class="btn-Connector" href="JavaScript:void(0);" toOI="' + connector['connector']['toOI'] + '" alias="' + connPath + '"> ' + connector['connector']['name'] + '</a></span></li>')
                            .appendTo(connectorUL);
                        btnConnector.find('.btn-Connector').bind('click', function(e) {
                            var toOI = $(e.target).attr('toOI');
                            var connAlias = $(e.target).attr('alias');
                            if (t.config.lastSelect) {
                                t.config.lastSelect.removeClass('tree-selection');
                            }
                            $(e.target).addClass('tree-selection');
                            t.config.lastSelect = $(e.target);
                            t.loadNode($($(e.target).parent().parent()[0]), toOI, false, connAlias);
                        });
                    });
                    if (isRoot) {
                        ele.find('c').find('a').bind('click', function(e) {
                            t.loadNode($($(e.target).parent().parent()[0]), identified, true);
                        });
                    }
                } else {
                    _log('no connectors');
                }
            },
            selectConnector: function() {
                _log('selectConnector');
            },
            setEvent: function(eventsObject) {
                var t = this;
                t.eves = $.extend({}, t.eves, eventsObject);
            },
            setValue: function(value) {

            }
        });
        return FieldSelectionView;
    });