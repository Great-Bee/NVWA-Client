define('js/util/dictionary', [], function() {
    $nvwa.dictionary = {
        ComponentTypes: ["Field", "Label", "Link", "Img", "Button", "Video"],
        //OI状态类型
        OIStatus: {
            normal: '正常',
            un_set_table: '未建表',
            un_use: '未使用',
            discard: '废弃'
        },
        //关系类型
        RelationType: {
            oto: '一对一',
            otm: '一对多',
            mto: '多对一'
        },
        //容器类型
        ContainerType: {
            form: '表单',
            search: '搜索',
            grid: '列表',
            print: '打印',
            chart: '图标'
        },
        //组件类型
        ComponentType: {
            field: '字段',
            text: '文本',
            url: '链接',
            picture: '图片',
            button: '按钮',
            video: '视频',
            custom: '自定义'
        },
        //页面类型
        PageType: {
            // page: '页面',
            // report: '报表',
            // dashboard: '面板',
            // print: '打印'
            simple_page: 'Simple Page',
            tradition_page: 'Tradition Page',
            tab_page: 'Tab Page'
        },
        //container mode type is used for form container
        ContainerModeType: {
            Create: 'create',
            Update: 'update',
            View: 'view',
            Search: 'search'
        },
        DataFieldType: {
            INT: 'INT',
            BIGINT: 'BigINT',
            MEDIUMINT: 'MediumINT',
            SMALLINT: 'SmallINT',
            DOUBLE: 'Double',
            FLOAT: 'Float',
            TINYINT: 'TinyINT',
            BIT: 'Bit',
            VARCHAR: 'Varchar',
            LONGTEXT: 'LongText',
            MEDIUMTEXT: 'MediumTEXT',
            TEXT: 'Text',
            TINYTEXT: 'TinyText',
            DATETIME: 'DateTime',
            DATE: 'Date',
            TIME: 'Time',
            TIMESTAMP: 'TimeStamp',
            YEAR: 'Year',
            BLOB: 'BLOB',
            LONGBLOB: 'LongBLOB',
            MEDIUMBLOB: 'MediumBLOB',
            TINYBLOB: 'TinyBLOB',
            BINARY: 'Binary',
            ENUM: 'Enum'
        },
        ConditionFieldValueType: {
            constant: 'Constant',
            expression: 'Expression',
            session: 'Session',
            request: 'Request'
        },
        ConditionType: {
            gt: '>',
            ge: '>=',
            lt: '<',
            le: '<=',
            eq: '=',
            neq: '!=',
            In: 'IN',
            like: 'LIKE',
            is: 'IS',
            isnot: 'IS NOT',
            Null: 'IS NULL',
            NotNull: 'IS NOT NULL'
        },
        EventTargetType: {
            element: 'element',
            container: 'container',
            page: 'page'
        },
        ElementLayoutType: {
            Forms: 'rows',
            Buttons: 'buttons'
        },
        ScriptsType: { //脚本类型
            javascript: 'Javascript',
            java: 'Java',
        },
        ClientReservedEvent: { //保留事件的类型
            container: '容器',
            element: '元素'
        },
        ServerReservedEvent: { //保留事件的类型
            container: '容器',
            element: '元素'
        },
        ClientEventType: { //客户端事件的类型
            click: '鼠标单击',
            dblclick: '鼠标双击',
            mouseover: '鼠标经过',
            mouseleave: '鼠标离开',
            select: '选择',
            keyup: '键盘弹起',
            keydown: '键盘落下',
            keypress: '键盘输入'
        },
        ServerEventType: {
            onRequest: '解析请求前',
            beforeCreate: '创建前',
            afterCreate: '创建后',
            beforeUpdate: '更新前',
            afterUpdate: '更新后',
            beforeGrid: '列表读取前',
            afterGrid: '列表读取后',
            beforeDelete: '删除前',
            afterDelete: '删除后'
        },
        AppType: {
            web: 'Web',
            ios: 'iOS',
            android: 'Android'
        },
        RadioColorType: {
            blue: '蓝色',
            red: '红色',
            green: '绿色',
            yellow: '黄色',
            orange: '橘黄色'
        },
        TextAlignType: {
            Left: 'left',
            Right: 'right'
        }
    };
    return $nvwa.dictionary;
});