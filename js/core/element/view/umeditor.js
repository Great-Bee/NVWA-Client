define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/umeditor.html',
    'js/bower_components/umeditor/umeditor.config',
    'js/bower_components/umeditor/umeditor',
    'css!bower_components/umeditor/themes/default/css/umeditor'
    // 'js/bower_components/ueditor/lang/zh-cn/zh-cn',
], function(_, BaseElementView, StringUtil, UMEditorTpl, UEditorConfig, UEditorALL) {
    var UMEditorView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                disabled: false,
                height: 300, //高度,默认为500px
                //元素类型
                type: 'umeditor',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.inidUMEditor();
        },
        render: function() {
            this.$el.html(_.template(UMEditorTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        inidUMEditor: function() {
            var t = this;
            t.ue = UM.getEditor(t.eleBean['serialNumber']);
            var getHeight = function() {
                var height = $('#' + t.eleBean['serialNumber']).parent().parent().height();
                BaseElementView.prototype.bindEvents.apply(this, arguments);
            };
            setTimeout(getHeight(), 1);
        },
        supportAttribute: function() {
            return ['disabled', 'height'];
        },
        supportServerAttribute: function() {
            return ['dataField', 'dataValue'];
        },
        supportEventNames: function() {
            return ['keyup', 'keydown', 'keypress'];
        },
        supportServerEventNames: function() {
            return ['beforeCreate', 'afterCreate', 'beforeUpdate', 'afterUpdate'];
        },
        //设置属性
        setAttribute: function(attributeName, attributeValue) {
            var t = this;
            t.attributes[attributeName] = attributeValue;
            switch (attributeName) {
                case 'disabled':
                    _log(attributeValue)
                    t.disabled(attributeValue);
                    break;
                case 'height':
                    if (attributeValue) {
                        UM.getEditor(t.eleBean['serialNumber']).setHeight(attributeValue);
                    }
                    break;
                default:
                    return;
            }
        },
        disabled: function(value) {
            var t = this;
            _log('disable=' + value);
            if (value) {
                UM.getEditor(t.eleBean['serialNumber']).setDisabled('fullscreen');
            } else {
                UM.getEditor(t.eleBean['serialNumber']).setEnabled();
            }
        },
        //获取选中文本
        getSelection: function() {
            var t = this;
            //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
            var range = UM.getEditor(t.eleBean['serialNumber']).selection.getRange();
            range.select();
            var txt = UM.getEditor(t.eleBean['serialNumber']).selection.getText();
            return txt;
        },
        //追加内容
        appendValue: function(value) {
            var t = this;
            UM.getEditor(t.eleBean['serialNumber']).setContent(value, true);
        },
        //设置内容
        setValue: function(value) {
            var t = this;
            UM.getEditor(t.eleBean['serialNumber']).setContent(value, false);
        },
        //获取富文本
        getValue: function() {
            return UM.getEditor(t.eleBean['serialNumber']).getContent();
        },
    });
    return UMEditorView;
});