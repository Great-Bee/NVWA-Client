define([
    'underscore',
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/ueditor.html',
    'js/bower_components/ueditor/ueditor.config',
    'js/bower_components/ueditor/ueditor.all.min',
], function(_, BaseElementView, StringUtil, UEditorTpl, UEditorConfig, UEditorALL) {
    var UEditorView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                disabled: true,
                height: 500, //高度,默认为500px
                //元素类型
                type: 'ueditor',
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.inidUEditor();
        },
        render: function() {
            this.$el.html(_.template(UEditorTpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        inidUEditor: function() {
            var t = this;
            t.ue = UE.getEditor(t.eleBean['serialNumber']);
            var height = $('#' + t.eleBean['serialNumber']).height();
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
                    t.disabled(attributeValue);
                    break;
                case 'height':
                    if (attributeValue) {
                        UE.getEditor(t.eleBean['serialNumber']).setHeight(attributeValue);
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
                UE.getEditor(t.eleBean['serialNumber']).setDisabled('fullscreen');
            } else {
                UE.getEditor(t.eleBean['serialNumber']).setEnabled();
            }
        },
        //获取选中文本
        getSelection: function() {
            var t = this;
            //当你点击按钮时编辑区域已经失去了焦点，如果直接用getText将不会得到内容，所以要在选回来，然后取得内容
            var range = UE.getEditor(t.eleBean['serialNumber']).selection.getRange();
            range.select();
            var txt = UE.getEditor(t.eleBean['serialNumber']).selection.getText();
            return txt;
        },
        //追加内容
        appendValue: function(value) {
            var t = this;
            UE.getEditor(t.eleBean['serialNumber']).setContent(value, true);
        },
        //设置内容
        setValue: function(value) {
            var t = this;
            UE.getEditor(t.eleBean['serialNumber']).setContent(value, false);
        },
        //获取富文本
        getValue: function() {
            var t = this;
            return UE.getEditor(t.eleBean['serialNumber']).getContent();
        }
    });
    return UEditorView;
});