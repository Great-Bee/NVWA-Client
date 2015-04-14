/*
 *容器的表单
 */
define([
    'text!js/producer/template/containerForm.html',
    'js/producer/view/base_producer_form',
    'achy/widget/ui/message',
    'js/util/string',
    'js/util/api/producer',
    'js/util/api/oi',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'js/util/ui/view/dropButton',
    'js/core/element/view/select',
    'js/util/dictionary',
    'js/util/convert'
], function(formTpl, BaseProducerForm, Message, StringUtil, Producer, OI, MC, Modal, DropButtonView, SelectView, Dictionary, ConvertUtil) {
    var ContainerFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'loadContainerTypeComplete': 'setDropList',
            'keyup [fieldname="alias"]': 'uniqueFormEvent',
            'click .btn-layout': 'layoutEvent'
        }),
        initialize: function(options, config) {
            var t = this;
            t.options = options;
            config = $.extend({
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                formType: 'add', //表单类型 add update view
                title: 'this is a form', //标题
                showTitle: false, //是否显示标题
                formData: null, //表单数据
                formTpl: formTpl,
                loadDataEvent: null, //加载表单数据的event
                saveDataEvent: null, //保存表单数据的event
                updateDataEvent: null, //更新表单数据的event
                confirmAddContnet: '是否添加容器',
                confirmUpdateContnet: '是否更新容器'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        fillFormField: function(name, value) {
            var t = this;
            if (name != 'type' && name != 'oi') {
                t.$el.find('[fieldname="' + name + '"]').val(value);
            }
        },
        afterFillFormData: function(data) {
            var t = this;
            t.loadContainerType();
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            saveData['type'] = t.containerType.getValue();
            return saveData;
        },
        requiredsError: function(fieldName) {
            switch (fieldName) {
                case 'name':
                    new Message({
                        type: 'error',
                        msg: '请填写名称',
                        timeout: 1500
                    });
                    break;
                case 'alias':
                    new Message({
                        type: 'error',
                        msg: '请填写别名',
                        timeout: 1500
                    });
                    break;
                case 'oi':
                    new Message({
                        type: 'error',
                        msg: '请填写所属存储',
                        timeout: 1500
                    });
                    break;
                case 'type':
                    new Message({
                        type: 'error',
                        msg: '请填写类型',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        layoutEvent: function() {
            //布局按钮
            var t = this;
            var alias = t.config.formData['alias'];
            var url = 'container/form/edit/' + alias;
            t.options.routes.navigate(url, {
                trigger: true
            });
        },
        //loading container type
        loadContainerType: function() {
            var t = this;
            t.containerTypeData = {
                datasource: {
                    datasource: "static",
                    data: []
                }
            };
            MC.listContainerObject(function(data) {
                if (data && data.currentRecords && data.currentRecords.length > 0) {
                    $.each(data.currentRecords, function(i, item) {
                        t.containerTypeData.datasource.data.push({
                            text: item['name'],
                            value: item['alias']
                        });
                    });
                }
                t.$el.trigger('loadContainerTypeComplete');
            }, {
                pagination_page: 1,
                pagination_pageSize: 999
            });
        },
        //设置下拉盒的属性
        setDropList: function(formData) {
            var t = this;
            var enable = false;
            if (t.config.formType != 'add') {
                enable = true;
            }
            //容器类型下拉菜单           
            t.containerType = new SelectView({
                el: t.$el.find('.containerType')
            }, {}, t.containerTypeData);
            if (t.config && t.config.formType && t.config.formType == 'add') {
                t.containerType.setAttribute('disabled', false);
            } else {
                t.containerType.setAttribute('disabled', true);
            }
            //OI下拉菜单
            t.containerOI = new DropButtonView({
                el: t.$el.find('.containerOI')
            }, {
                containerId: 'containerOI',
                fieldName: 'oi',
                readonly: enable
            });
            //加载OI下拉菜单的数据
            OI.oiList(function(data) {
                if (data) {
                    var droupOIData = {};
                    var list = data.currentRecords;
                    $.each(list, function(i, item) {
                        droupOIData[item['identified']] = item['name'];
                    });
                    //设置containerOI的选项和默认值
                    t.containerOI.setListData(droupOIData);
                    t.setOI();
                    if (t.config.formData && t.config.formData.oi) {
                        t.containerOI.setListData(null, t.config.formData.oi);
                    }
                }
            });
        },
        createSuccess: function(saveData) {
            //添加field成功以后   
            new Message({
                type: 'info',
                msg: '添加容器成功',
                timeout: 1500
            });
            var url = 'container/' + saveData['type'] + '/edit/' + saveData['alias'];
            window.router.navigate(url, {
                trigger: true
            });
        },
        createError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-添容器失败',
                timeout: 1500
            });
        },
        updateSuccess: function(saveData) {
            //添加成功以后   
            new Message({
                type: 'info',
                msg: '更新容器成功',
                timeout: 1500
            });
            var url = 'container/list';
            window.router.navigate(url, {
                trigger: true
            });
        },
        updateError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-更新容器失败',
                timeout: 1500
            });
        },
        setOI: function() {
            var t = this;
            var oi = StringUtil.getPar('oi');
            if (oi && oi.length > 0) {
                t.config.formData = {
                    oi: oi
                };
            }
        },
        uniqueFormEvent: function() {
            var t = this;
            t.checkAliasUnique('alias', t.$el.find('input[fieldname="alias"]'));
        },
        checkAliasUnique: function(fieldName, box) {
            var t = this;
            MC.containerUnique(box.val(), function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        }
    });
    return ContainerFormView;
});