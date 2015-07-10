<div class="panel panel-default">
  <!-- Default panel contents -->  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">
    <form class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-4 col-xs-6">
                <div class="form-group">
                    <label  class="col-md-3 control-label">目标ID</label>
                    <div class="col-md-9">
                        <input fieldName="targetId" type="text" class="form-control" readonly="readonly" value="<#=config.targetId#>"  placeholder="目标ID"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-xs-6">
                <div class="form-group">
                    <label  class="col-md-3 control-label">名称</label>
                    <div class="col-md-9 eventName">
                        <!-- <input fieldName="eventName" type="text" class="form-control"  placeholder="服务器事件的名称"/> -->
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-xs-6">
                <div class="form-group">
                    <label  class="col-md-3 control-label">别名</label>
                    <div class="col-md-9 ">
                        <input fieldName="alias" type="text" class="form-control"  placeholder="全局唯一" <#if(config.formType!='add'){#>readonly="readonly"<#}#>/>
                    </div>
                </div>
            </div>                  
        </div> 
        <input fieldName="target" type="hidden" class="form-control" value="<#=config.target#>" placeholder="全局唯一"/>      
        
    </form> 
  </div>
  <div class="panel-footer">
      <div class="row">
            <div class="col-md-12 navbar-form navbar-right">
                <div class="form-group">
                    <div class="col-md-12">
                        <#if(config.formType!='view'){#>
                            <button class="btn btn-default btn-save">保存</button>
                        <#}#>
                        <button class="btn btn-default btn-cancel">返回</button>
                    </div>                  
                </div>  
            </div>
        </div>
  </div>
</div>
