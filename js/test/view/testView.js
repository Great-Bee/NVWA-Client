define([
    'backbone',
    'underscore',
    'text!js/test/template/testView.html',
    'js/util/api/mc',
    'js/core/element/view/select',
    'js/core/element/view/checkbox',
    'js/core/element/view/radio',
    'js/core/element/view/combobox',
    'js/core/element/view/umeditor',
    'js/util/ui/view/iconSelection',
    'js/core/element/view/code',
], function(Backbone, _, TestTpl, MC, SelectView, CheckboxView, RadioView, ComboboxView, UEditorView, IconSelectionView, CodeEditorView) {
    var TestView = Backbone.View.extend({
        events: {
            'click .btn-save': 'onSave'
        },
        initialize: function(options, config) {
            var t = this;
            config = $.extend({

            }, config);
            t.config = config;
            t.render();
            t.testSelect();
            t.testCheckbox();
            t.testRadio();
            t.testCombobox();
            t.testUEditor();
            t.testIconSelection();
            t.testCodeMirror();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            t.$el.html(_.template(TestTpl, {
                options: t.options,
                config: t.config
            }));
            return t;
        },
        testSelect: function() {
            var t = this;
            var eleBean = {};
            var attributes = {
                selectData: [{
                    text: '选项1',
                    value: 'selectA'
                }, {
                    text: '选项2',
                    value: 'selectB'
                }, {
                    text: '选项3',
                    value: 'selectC'
                }, {
                    text: '选项4',
                    value: 'selectD'
                }, {
                    text: '选项5',
                    value: 'selectE'
                }]
            };
            t.select = new SelectView({
                el: t.$el.find('.selectContainer')
            }, eleBean, attributes);
        },
        testCheckbox: function() {
            var t = this;
            var eleBean = {};
            var attributes = {};
            t.checkbox = new CheckboxView({
                el: t.$el.find('.checkboxContainer')
            }, eleBean, attributes);
            $('.btn-on').on('click', function() {
                console.log('click on');
                t.checkbox.setValue(true);
            });
            $('.btn-off').on('click', function() {
                console.log('click off');
                t.checkbox.setValue(false);
            });
        },
        testRadio: function() {
            var t = this;
            var eleBean = {};
            var attributes = {
                selectData: [{
                    text: '选项1',
                    value: 'selectA'
                }, {
                    text: '选项2',
                    value: 'selectB'
                }, {
                    text: '选项3',
                    value: 'selectC'
                }, {
                    text: '选项4',
                    value: 'selectD'
                }, {
                    text: '选项5',
                    value: 'selectE'
                }],
                value: 'selectE',
                color: 'yellow'
            };
            t.radio = new RadioView({
                el: t.$el.find('.radioContainer')
            }, eleBean, attributes);
            $('.btn-a').on('click', function() {
                console.log('click a');
                t.radio.setValue('selectA');
            });
            $('.btn-b').on('click', function() {
                console.log('click b');
                t.radio.setValue('selectB');
            });
            $('.btn-radio-enable').on('click', function() {
                t.radio.setAttribute('disabled', false);
            });
            $('.btn-radio-disable').on('click', function() {
                t.radio.setAttribute('disabled', true);
            });
            $('.btn-radio-color').on('click', function(e) {
                t.radio.setAttribute('color', $(e.target).html());
            });
        },
        testCombobox: function() {
            var t = this;
            var eleBean = {};
            var attributes = {
                selectData: [{
                    text: '选项1',
                    value: 'selectA'
                }, {
                    text: '选项2',
                    value: 'selectB'
                }, {
                    text: '选项3',
                    value: 'selectC'
                }, {
                    text: '选项4',
                    value: 'selectD'
                }, {
                    text: '选项5',
                    value: 'selectE'
                }],
                value: 'selectB'
            };
            var attributes2 = {
                selectData: [{
                    text: '选项1',
                    value: 'selectA'
                }, {
                    text: '选项2',
                    value: 'selectB'
                }, {
                    text: '选项3',
                    value: 'selectC'
                }]
            };
            t.combobox = new ComboboxView({
                el: t.$el.find('.comboboxContainer')
            }, eleBean, attributes);
            $('.btn-combobox-a').on('click', function(e) {
                t.combobox.setAttribute('value', attributes['selectData'][0]['value']);
            });
            $('.btn-combobox-b').on('click', function(e) {
                t.combobox.setAttribute('value', attributes['selectData'][1]['value']);
            });
            $('.btn-combobox-c').on('click', function(e) {
                t.combobox.setAttribute('value', attributes['selectData'][2]['value']);
            });
            $('.btn-combobox-enable').on('click', function() {
                t.combobox.setAttribute('disabled', false);
            });
            $('.btn-combobox-disable').on('click', function() {
                t.combobox.setAttribute('disabled', true);
            });
            $('.btn-combobox-c3').on('click', function() {
                t.combobox.setAttribute('selectData', attributes2['selectData']);
            });
            $('.btn-combobox-c5').on('click', function() {
                t.combobox.setAttribute('selectData', attributes['selectData']);
            });
        },
        testUEditor: function() {
            var t = this;
            var eleBean = {};
            var attributes = {
                height: 100
            };
            t.udeitor = new UEditorView({
                el: t.$el.find('.ueditorContainer')
            }, eleBean, attributes);
            $('.btn-ue-enable').on('click', function() {
                t.udeitor.setAttribute('disabled', false);
            });
            $('.btn-ue-disable').on('click', function() {
                t.udeitor.setAttribute('disabled', true);
            });
            $('.btn-height-900').on('click', function() {
                t.udeitor.setAttribute('height', 900);
            });
            $('.btn-height-300').on('click', function() {
                t.udeitor.setAttribute('height', 300);
            });
        },
        testIconSelection: function() {
            var t = this;
            var config = {
                loadData: MC.iconPage
            };
            var attributes = {
                height: 100
            };
            t.iconSelection = new IconSelectionView({
                el: t.$el.find('.iconSelectionContainer')
            }, config);
        },
        testCodeMirror: function() {
            var t = this;
            var eleBean = {};
            var attributes = {
                height: 100
            };
            t.codeEdiror = new CodeEditorView({
                el: t.$el.find('.codeMirror')
            }, eleBean, attributes);
            $('.btn-code-getvalue').on('click', function() {
                var value = t.codeEdiror.getValue();
            });
            $('.btn-code-setvalue').on('click', function() {
                t.codeEdiror.setValue('123 test');
            });
            $('.btn-code-enable').on('click', function() {
                t.codeEdiror.setAttribute('readonly', false);
            });
            $('.btn-code-disable').on('click', function() {
                t.codeEdiror.setAttribute('readonly', true);
            });
        },
        onSave: function() {
            var t = this;
            console.log('selectValue=' + t.select.getValue());
            console.log('checkboxValue=' + t.checkbox.getValue());
            console.log('radioValue=' + t.radio.getValue());
            console.log('combobox=' + t.combobox.getValue());
        }

    });
    return TestView;
});