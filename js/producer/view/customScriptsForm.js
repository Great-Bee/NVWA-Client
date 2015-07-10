define([
    'text!js/producer/template/customScriptsForm.tpl',
    'js/producer/view/base_producer_form',
    'text!js/producer/template/amdTpl.tpl',
    'js/util/api/mc',
    'js/util/ui/view/modal',
    'achy/widget/ui/message',
    'js/util/ui/view/dropButton',
    'js/util/dictionary',
    'js/core/element/view/code',
    'js/util/string',
    'js/util/convert',
    'js/producer/view/customScriptsParameters',
], function(formTpl, BaseProducerForm, AMDTpl, MC, Modal, Message, DropButtonView, Dictionary, CodeEditorView, StringUtil, ConvertUtil, CustomScriptsParametersView) {
    var CustomScriptsFormView = BaseProducerForm.extend({
        events: $.extend(BaseProducerForm.prototype.events, {
            'keydown [fieldname="alias"]': 'uniqueFormEvent',
            'click .btnParametersSettings': '_clickBtnParametersSettings'
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
                uniqueEvent: function() {}, //确定唯一性的event
                confirmAddContnet: '是否添加自定义脚本',
                confirmUpdateContnet: '是否更新自定义脚本'
            }, config);
            BaseProducerForm.prototype.initialize.apply(this, arguments);
        },
        _clickBtnParametersSettings: function() {
            var t = this;
            var scriptAlias = t._getScriptAlias();
            if ($nvwa.string.isVerify(scriptAlias)) {
                t.parametersDialog = {};
                t.parametersDialog.container = $('<div></div>');
                t.parametersDialog.dialog = new Modal({
                    title: '参数设置',
                    content: t.parametersDialog.container
                });
                t.parametersView = new CustomScriptsParametersView({
                    el: t.parametersDialog.container
                }, {
                    scriptAlias: scriptAlias,
                    conditions: [{
                        fieldName: 'scriptAlias',
                        fieldValue: scriptAlias
                    }]
                });
            } else {
                _log('no alias,plase setting alias before setting parameters');
                this._error('请先填写别名');
            }
        },
        _getScriptAlias: function() {
            var t = this;
            return t.getFormFieldValue('alias');
        },
        afterFromRender: function(formType) {
            var t = this;
            if ($nvwa.string.isVerify(formType) && formType == 'add') {
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        fillFormField: function(name, value) {
            var t = this;
            if (name == 'type' && t.customScriptsType && t.customScriptsType.setListData) {
                t.customScriptsType.setListData(null, data[k]);
            } else if (name == 'code' && t.codeEditor && t.codeEditor.setValue) {
                t.codeEditor.setValue(data[k]);
            } else {
                t.$el.find('[fieldname="' + name + '"]').val(value);
            }
        },
        afterFillFormData: function(data) {
            var t = this;
            t.setDropList(data);
            t.setCodeEditor(data);
            if (data && $nvwa.string.isVerify(data.type) && data.type == 'java') {
                t.$el.find('.codeMirrorRow').hide();
            } else {
                t.$el.find('.codeMirrorRow').show();
            }
        },
        beforeSaveForm: function(saveData) {
            var t = this;
            saveData['code'] = t.codeEditor.getValue();
            return saveData;
        },
        requiredsError: function(fieldName) {
            switch (fieldName) {
                case 'name':
                    this._error('请填写名称');
                    break;
                case 'alias':
                    this._error('请填写别名');
                    break;
                default:
                    break;
            }
        },
        uniqueError: function(fieldName) {
            switch (fieldName) {
                case 'alias':
                    this._error('别名重复');
                    break;
                default:
                    break;
            }
        },
        //设置下拉盒的属性
        setDropList: function(formData) {
            var t = this;
            var customScriptsTypeBody = $('.type');
            t.customScriptsType = new DropButtonView({
                el: customScriptsTypeBody
            }, {
                containerId: 'pageType',
                fieldName: 'type'
            });
            var defultPageType = 'javascript';
            if (formData && formData['type']) {
                defultPageType = formData['type'];
            }
            t.customScriptsType.setListData(Dictionary.ScriptsType, defultPageType);
            customScriptsTypeBody.on('select', function(e, data) {
                if ($nvwa.string.isVerify(data)) {
                    if (data == 'java') {
                        t.$el.find('.codeMirrorRow').hide();
                    } else {
                        t.$el.find('.codeMirrorRow').show();
                    }
                }
            });
        },
        //设置代码编辑器
        setCodeEditor: function(formData) {
            var t = this;
            var eleBean = {};
            var attributes = {
                height: 100
            };
            t.codeEditor = new CodeEditorView({
                el: t.$el.find('.codeMirror')
            }, eleBean, attributes);
            if (formData && formData['code']) {
                t.codeEditor.setValue(formData['code']);
            } else {
                t.codeEditor.setValue(tpl(AMDTpl));
            }
        },
        createSuccess: function(saveData) {
            //添加field成功以后               
            this._info('添加自定义脚本成功');
        },
        createError: function(saveData) {
            this._error('提示-添加自定义脚本失败');
        },
        updateSuccess: function(saveData) {
            //添加成功以后               
            this._info('更新自定义脚本成功');
        },
        updateError: function(saveData) {
            this._error('提示-更新自定义脚本失败');
        },
        uniqueFormEvent: function(e) {
            var t = this;
            setTimeout(function() {
                t.checkAliasUnique($(e.target).val());
                $nvwa.string.aliasTextVerification(e, Message);
            }, 50);
        },
        checkAliasUnique: function(alias) {
            var t = this;
            var fieldName = 'alias';
            t.config.uniqueEvent(alias, function(response) {
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
    return CustomScriptsFormView;
});