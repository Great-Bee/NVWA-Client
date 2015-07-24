<div class="panel panel-primary">
	<div class="panel-heading">客户端属性</div>
	<div class="panel-body clientAttr">
        <div class="text title hidden">
            <div class="row">
                <label  class="col-md-12 control-label">标题</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="title" type="text" class="form-control"  placeholder="容器显示的标题"/>
                </div>
            </div>
        </div>
        <div class="text width hidden">
            <div class="row">
                <label  class="col-md-12 control-label">宽度</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="width" type="text" class="form-control"  placeholder="单位为像素,默认自适应"/>
                </div>
            </div>
        </div>
        <div class="text style hidden">
            <div class="row">
                <label  class="col-md-12 control-label">风格</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="styleContainer"></div>
                </div>
            </div>
        </div>
<!--
        <div class="readonly hidden">                    
                <div class="row row-attr">
                    <label  class="col-md-4 control-label">只读</label>
                    <div class="col-md-8 readonlyContainer navbar-right"></div>   
                </div>
        </div>
    -->
    <!--dataTable  属性配置-->
        <div class="text paging hidden">
            <div class="row">
                <label  class="col-md-12 control-label">是否前端分页</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="pagingContainer"></div>
                </div>
            </div>
        </div>
        <div class="text searchingAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">是否搜索过滤</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="searchingAbleContainer"></div>
                </div>
            </div>
        </div>
        <div class="text infoAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">是否页脚信息</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="infoAbleContainer"></div>
                </div>
            </div>
        </div>
         <div class="text dtScrollY hidden">
            <div class="row">
                <label  class="col-md-12 control-label">容器垂直滚动高度</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="dtScrollY" type="text" class="form-control"  placeholder="容器高度超过多少开始滚动"/>
                </div>
            </div>
        </div>
         <div class="text leftColumns hidden">
            <div class="row">
                <label  class="col-md-12 control-label">固定左边列</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="leftColumns" type="text" class="form-control"  placeholder="左边多少列固定"/>
                </div>
            </div>
        </div>
         <div class="text rightColumns hidden">
            <div class="row">
                <label  class="col-md-12 control-label">固定右边列</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="rightColumns" type="text" class="form-control"  placeholder="右边多少列固定"/>
                </div>
            </div>
        </div>

 <!--dataTable  属性配置 end-->
        <div class="text createAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">添加按钮</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="createBtnContainer"></div>
                </div>
            </div>
        </div>
        <div class="text updateAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">更新按钮</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="updateBtnContainer"></div>
                </div>
            </div>
        </div>
        <div class="text searchAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">搜索按钮</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="searchBtnContainer"></div>
                </div>
            </div>
        </div>
        <div class="text cancelAble hidden">
            <div class="row">
                <label  class="col-md-12 control-label">取消按钮</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="cancelBtnContainer"></div>
                </div>
            </div>
        </div>
        <div class="text gapConfig hidden">
            <div class="row">
                <label  class="col-md-12 control-label">间距配置</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="gapConfigContainer"></div>
                </div>
            </div>
        </div>

    </div>
</div>
<div class="panel panel-primary">
	<div class="panel-heading">服务端属性</div>
	<div class="panel-body serverAttr">
        <div class="text pageSize hidden">
            <div class="row">
                <label  class="col-md-12 control-label">分页尺寸</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="pageSize" type="text" class="form-control"  placeholder="不填默认为20"/>
                </div>
            </div>
        </div>
        <div class="text gridType hidden">
            <div class="row">
                <label  class="col-md-12 control-label">列表类型</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="gridTypeContainer"></div>
                </div>
            </div>
        </div>
        <div class="text parent hidden">
            <div class="row">
                <label  class="col-md-12 control-label">父节点字段</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="parentContainer"></div>
                </div>
            </div>    
        </div>
        <div class="text parentValue hidden">
            <div class="row">
                <label  class="col-md-12 control-label">父节点条件字段</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="parentValueContainer"></div>
                </div>
            </div>    
        </div>
        <div class="text rootValue hidden">
            <div class="row">
                <label  class="col-md-12 control-label">根节点值的值</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="rootValue" type="text" class="form-control"  placeholder="根节点的值"/>
                </div>
            </div>
        </div>
        <div class="text orderBy hidden">
            <div class="row">
                <label  class="col-md-12 control-label">排序字段</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="orderBy" type="text" class="form-control"  placeholder="列表排序条件字段"/>
                </div>
            </div>
        </div>
        <div class="text orderByRule hidden">
            <div class="row">
                <label  class="col-md-12 control-label">排序规则</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="orderbyRuleContainer"></div>
                </div>
            </div>    
        </div>
        <div class="text groupBy hidden">
            <div class="row">
                <label  class="col-md-12 control-label">分组字段</label>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <input fieldName="groupBy" type="text" class="form-control"  placeholder="列表分组条件字段"/>
                </div>
            </div>
        </div>
    </div>
</div>