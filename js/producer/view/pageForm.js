define([
    'text!js/producer/template/pageForm.tpl',
    'js/producer/view/base_producer_form',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/core/element/view/select',
    'js/util/dictionary',
    'js/util/string',
    'js/util/convert'
], function(formTpl, BaseProducerForm, MC, Modal, Message, DropButtonView, SelectView, Dictionary, StringUtil, ConvertUtil) {
    var PageFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'loadPageTypeDataComplete': 'setDropList',
            'initPageTypeControlComplete': 'loadData',
            'keyup [fieldname="alias"]': 'uniqueFormEvent'
        }),
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                //编辑器类型
                type: 'form',
                //=============form 属性=========
                objectId: 0,
                formType: 'add', //表单类型 add update view
                title: '', //标题
                showTitle: false, //是否显示标题
                formData: null, //表单数据
                formTpl: formTpl,
                loadDataEvent: function() {}, //加载表单数据的event
                saveDataEvent: function() {}, //保存表单数据的event
                updateDataEvent: function() {}, //更新表单数据的event
                afterUpdateEvent: function() {}, //更新之后执行的event
                callbackEvent: function() {}, //取消返回的event
                confirmAddContnet: '是否添加页面',
                confirmUpdateContnet: '是否更新页面'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        fillFormField: function(name, value) {
            var t = this;
            if ($nvwa.string.isVerify(name) && name == 'type') {
                if (t.pageType && t.pageType.setValue) {
                    t.pageType.setValue(value);
                }
            } else {
                this.$el.find('[fieldname="' + name + '"]').val(value);
            }
        },
        afterFromRender: function(formType) {
            var t = this;
            t.loadPageTypeData();
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
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
                default:
                    break;
            }
        },
        uniqueError: function(fieldName) {
            switch (fieldName) {
                case 'alias':
                    new Message({
                        type: 'error',
                        msg: '别名重复',
                        timeout: 1500
                    });
                    break;
                default:
                    break;
            }
        },
        //loading page type data
        loadPageTypeData: function() {
            var t = this;

            t.pageTypeData = {
                datasource: {
                    datasource: "static",
                    data: []
                }
            };

            MC.listPageObject(function(data) {
                if (data && data.currentRecords && data.currentRecords.length > 0) {
                    $.each(data.currentRecords, function(i, item) {
                        t.pageTypeData.datasource.data.push({
                            text: item['name'],
                            value: item['alias']
                        });
                    });
                }
                t.$el.trigger('loadPageTypeDataComplete');
            }, {
                pagination_page: 1,
                pagination_pageSize: 999
            });
        },
        //设置下拉盒的属性
        setDropList: function() {
            var t = this;
            t.pageType = new SelectView({
                el: t.$el.find('.pageTypeContainer')
            }, {}, t.pageTypeData);
            if (t.config && t.config.formType && t.config.formType == 'add') {
                t.pageType.setAttribute('disabled', false);
            } else {
                t.pageType.setAttribute('disabled', true);
            }
            t.$el.trigger('initPageTypeControlComplete');
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            saveData['type'] = t.pageType.getValue();
            return saveData;
        },
        createSuccess: function(saveData) {
            //添加field成功以后   
            new Message({
                type: 'info',
                msg: '添加页面成功',
                timeout: 1500
            });
            //跳转到编辑界面
            var url = 'page/edit/' + saveData['alias'];
            window.router.navigate(url, {
                trigger: true
            });
        },
        createError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-添加页面失败',
                timeout: 1500
            });
        },
        updateSuccess: function(saveData) {
            //添加field成功以后   
            new Message({
                type: 'info',
                msg: '更新页面成功',
                timeout: 1500
            });
        },
        updateError: function(saveData) {
            new Message({
                type: 'error',
                msg: '提示-更新页面失败',
                timeout: 1500
            });
        },
        uniqueFormEvent: function(e) {
            var t = this;
            setTimeout(function() {
                t.checkAliasUnique($(e.target).val());
                $nvwa.string.aliasTextVerification(e, Message);
            }, 50);
        },
        checkAliasUnique: function(alias) {
            var fieldName = 'alias';
            MC.pageUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        },
    });
    return PageFormView;
});