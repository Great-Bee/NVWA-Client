define('js/producer/view/componentForm', [
    'backbone',

    'text!js/producer/template/componentForm.tpl',
    'js/util/api/producer',
    'js/util/ui/view/modal',
    'js/util/dictionary',
    'js/util/ui/view/dropButton',
    'js/bower_components/achy/message',
    'js/util/ui/view/iconSelection',
    'js/util/api/mc',
    'js/util/string',
    'js/util/convert'
], function(Backbone, formTpl, Producer, Modal, Dictionary, DropButtonView, Message, IconSelectionView, MC, StringUtil, ConvertUtil) {
    var ComponentFormView = Backbone.View.extend({
        events: {
            'keydown [fieldname="name"]': 'checkNameKeyUp',
            'click .btn-cancel': 'cancelFormEvent',
            'click .btn-save': 'saveFormEvent',
            'keydown [fieldname="alias"]': 'uniqueFormEvent'
        },
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
                loadDataEvent: function() {}, //加载表单数据的event
                saveDataEvent: function() {}, //保存表单数据的event
                updateDataEvent: function() {}, //更新表单数据的event
                afterUpdateEvent: function() {}, //更新之后执行的event
                callbackEvent: function() {} //取消返回的event
            }, config);
            t.config = config;
            t.render();
        },
        //重新加载
        reloadData: function(objectId) {
            var t = this;
            if (objectId && objectId > 0) {
                t.config.objectId = objectId;
            }
            t.setDropList();
            t.loadData();
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
            if (t.config.loadDataEvent && t.config.loadDataEvent != null && t.config.objectId > 0) {
                t.config.loadDataEvent(t.config.objectId, function(data) {
                    t.config.formData = data;
                    for (k in data) {
                        //给表单赋值                        
                        if (k == 'type') {
                            t.componentType.setListData(null, data[k]);
                        } else if (k == 'icon') {
                            t.iconSelection.setValue(data[k]);
                        } else {
                            t.$el.find('[fieldname="' + k + '"]').val(data[k]);
                        }
                    }
                });
            }
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(tpl(formTpl, {
                options: t.options,
                config: t.config
            }));
            t.initForm();
            t.initIconSelection();
            t.reloadData();
            t.formInitEvent();
            return t;
        },
        cancelFormEvent: function() {
            //取消按钮的事件
            var t = this;
            if (t.config.callbackEvent && t.config.callbackEvent != null) {
                t.config.callbackEvent(t);
            }
        },
        initIconSelection: function() {
            var t = this;
            var config = {
                loadData: MC.iconPage,
                labelWidth: 3,
                btnWidth: 9
            };
            t.iconSelection = new IconSelectionView({
                el: t.$el.find('.iconSelectionContainer')
            }, config);
        },
        //清空表单的数据
        initForm: function() {
            var t = this;
            t.$el.find('[fieldname]').val('');
            t.$el.find('[fieldname]').val('');
            if (t.config.formType == 'add') {
                //add mode
                ConvertUtil.toPinyin(t.$el.find('[fieldname="name"]'), t.$el.find('[fieldname="alias"]'));
            }
        },
        //设置下拉盒的属性
        setDropList: function() {
            var t = this;
            t.componentType = new DropButtonView({
                el: $('.componentType')
            }, {
                containerId: 'componentType',
                fieldName: 'type'
            });
            var defultPageType = 'text';
            t.componentType.setListData(Dictionary.ComponentType, defultPageType);
        },
        //表单初始化
        formInitEvent: function() {
            if (this.config.formType != 'add') {}
        },
        saveFormEvent: function() {
            var t = this;
            var config = t.config;
            //保存按钮的事件
            var fieldList = t.$el.find('[fieldname]');
            var saveData = {};
            if (config.formData && config.formData['id'] && config.formData['id'] > 0) {
                saveData['id'] = config.formData['id'];
            }
            var update = false;
            $.each(fieldList, function(i, fieldNode) {
                var fieldName = $(fieldNode).attr('fieldname');
                var fieldFormValue = $(fieldNode).val();
                var fieldOldValue = null;
                if (config.formData && config.formData != null) {
                    fieldOldValue = config.formData[fieldName];
                }
                if (config.formType == 'add') {
                    saveData[fieldName] = fieldFormValue;
                    update = true;
                } else if (config.formType == 'update' && fieldOldValue != fieldFormValue) {
                    saveData[fieldName] = fieldFormValue;
                    update = true;
                }
            });
            //check alias
            if (t.$el.find('[fieldname="alias"]').hasClass('alert-danger')) {
                new Message({
                    type: 'error',
                    msg: '别名已重复,请重新填写',
                    timeout: 1500
                });
                update = false;
            }
            //check requireds
            var requireds = t.$el.find('[required="true"]');
            $.each(requireds, function(i, requiredInput) {
                var inputName = $(requiredInput).attr('fieldname');
                var inputValue = $(requiredInput).val();
                if (!inputValue && inputValue.length < 1) {
                    update = false;
                    switch (inputName) {
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
                }
            });
            //updating
            if (update) {
                var confirmContnet = '是否更新组件?';
                if (config.formType == 'add') {
                    confirmContnet = '是否添加组件？';
                }
                new Modal.Confirm({
                    title: '提示',
                    content: confirmContnet,
                    yes: function() {
                        if (config.formType) {
                            if (config.formType == 'add' && config.saveDataEvent) {
                                config.saveDataEvent(saveData, function(data) {
                                    t.config.afterUpdateEvent(data);
                                });
                            } else if (config.formType == 'update' && config.updateDataEvent) {
                                config.updateDataEvent(saveData, function(data) {
                                    t.config.afterUpdateEvent(data);
                                });
                            }
                        }
                    }
                });
            }
        },


        uniqueFormEvent: function(e) {
            var t = this;
            setTimeout(function() {

                t.checkUnique($(e.target).val());

            }, 50);
        },


        checkUnique: function(alias) {
            var t = this;

            var fieldName = 'alias';

            MC.componentUnique(alias, function(response) {
                if (response && !response.ok) {
                    if (response.dataMap && response.dataMap.fieldName) {
                        t.$el.find('[fieldname="' + fieldName + '"]').addClass("alert-danger");
                    }
                } else {
                    t.$el.find('[fieldname="' + fieldName + '"]').removeClass('alert-danger');
                }
            });
        },
        //checking name key up value
        checkNameKeyUp: function(e) {
            var t = this;
            StringUtil.nameTextVerification(e, Message);
        }
    });
    return ComponentFormView;
});