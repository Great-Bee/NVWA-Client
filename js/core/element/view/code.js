define([
    'js/core/element/view/base_element',
    'js/util/string',
    'text!js/core/element/template/code.tpl',
    'js/bower_components/codemirror/lib/codemirror',
    'js/bower_components/codemirror/mode/javascript/javascript',
    'css!bower_components/codemirror/lib/codemirror'

], function(BaseElementView, StringUtil, Tpl, CodeMirror) {
    var CodeEditorView = BaseElementView.extend({
        events: {},
        initialize: function(options, eleBean, attributes, eves, editAble) {
            this.defaultAttributes = {
                readonly: false,
                //元素类型
                type: 'code'
            };
            BaseElementView.prototype.initialize.apply(this, arguments);
            this.render();
            this.initEditor();
        },
        render: function() {
            this.$el.html(_.template(Tpl, {
                eleBean: this.eleBean,
                attributes: this.attributes,
                editAble: this.editAble
            }));
            return this;
        },
        initEditor: function() {
            var t = this;
            var myTextarea = document.getElementById(t.eleBean.serialNumber + '-codifyme');
            t.codeEditor = CodeMirror.fromTextArea(myTextarea, {
                mode: "text/javascript",
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                autofocus: true,
                styleActiveLine: true
            });
            t.bindEvents();
        },
        supportAttribute: function() {
            return ['readonly'];
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
                case 'readonly':
                    t.codeEditor.setOption('readOnly', attributeValue);
                    break;
                default:
                    return;
            }
        },
        setValue: function(value) {
            this.codeEditor.setValue(value);
        },
        getValue: function() {
            return this.codeEditor.getValue();
        }
    });
    return CodeEditorView;
});