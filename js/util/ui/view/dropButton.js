define(['bootstrap-combobox', 'achy/widget/ui/message'], function(Combobox, Message) {
    var DropButtonView = Backbone.View.extend({
        events: {},
        initialize: function(options, config) {
            var t = this;
            config = $.extend({
                containerId: 0,
                //label的宽度
                labelCol: null,
                //编辑器宽度
                editorCol: null,
                //帮助文案
                helpLabel: null,
                //前缀
                prefix: null,
                //是否禁用
                disabled: false,
                //是否只读
                readonly: false,
                //表单大小
                size: null,
                //PlaceHolder
                placeholder: null,
                //编辑器类型
                type: 'combobox',
                //Feedback
                feedback: null,
                //=================button属性===================
                text: 'button',
                fieldName: null, //字段名称
                click: null, //click event function
                data: null, //下拉盒的数据
                currentValue: null, //当前的值
                onChangeEvent: function(data) {
                    t.$el.trigger('select', [data]);
                }
            }, config);
            t.config = config;
            t.render();
        },
        /**
         * 渲染
         * @return {[type]} [description]
         */
        render: function() {
            var t = this;
            var config = t.config;
            //装载当前选择的值
            if (config['currentValue'] && config['data']) {
                btnElement.html(config['data'][currentValue]);
            }
        },
        loadData: function() {
            var t = this;
            var config = t.config;
            t.$el.html('');
            t.element = $('<select id="' + config.containerId + '" class="combobox" ></select>').appendTo(t.$el);
            if (config.fieldName) {
                t.element.attr('fieldName', config.fieldName);
            }
            //装载列表的数据
            if (config['data']) {
                for (k in config['data']) {
                    $('<option value="' + k + '">' + config['data'][k] + '</option>').appendTo(t.element);
                }
            }
            if (t.config.currentValue) {
                t.element.val(t.config.currentValue);
            }
            t.element.combobox();
            //如果配置里有readOnly的属性则禁用掉下拉选项
            if (t.config.readonly) {
                t.element.combobox('disable');
            }
            t.element.on('change', function(e) {
                var value = t.element.val();
                t.config.onChangeEvent(value);
            });
        },
        setEnable: function(enable) {
            var t = this;
            if (enable) {
                t.$element.combobox('enable');
                t.config.readonly = false;
            } else {
                t.$element.combobox('disable');
                t.config.readonly = true;
            }
        },
        //取值
        getValue: function() {
            var t = this;
            var config = t.config;
            // if (config['currentValue'] && config['data']) {
            // return config['data'][config['currentValue']];
            // }
            var value = t.element.val();
            if (value) {
                return value;
            } else {
                new Message({
                    type: 'warn',
                    msg: '请选择一个选项',
                    timeout: 1500
                });
            }

        },
        //设置新的值
        setValue: function(data) {
            var t = this;
            var config = t.config;
            t.element.val(data);
        },
        //设置下拉盒的数据
        setListData: function(data, defaultValue) {
            var t = this;
            var config = t.config;
            t.config.currentValue = defaultValue;
            if (data) {
                config['data'] = data;
            }
            t.loadData();
        }
    });
    return DropButtonView;
});