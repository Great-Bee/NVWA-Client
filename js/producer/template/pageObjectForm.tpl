<div class="panel panel-default">
  <!-- Default panel contents -->
  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">

    <form class="form-horizontal" role="form">

        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">名称</label>
                    <div class="col-md-9">
                        <input fieldName="name" type="text" class="form-control"  placeholder="名称" required="true" <#if(config.formType=='view'){#>readonly="readonly"<#}#> />
                    </div>
                </div>
            </div>              
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">别名</label>
                    <div class="col-md-9">
                        <input fieldName="alias" type="text" class="form-control" required="true" <#if(config.formType!='add'){#>readonly="readonly"<#}#>  placeholder="别名"/>
                    </div>
                </div>
            </div> 
            <#if(config.formType!='add'){#>
                <div class="col-md-4">
                    <div class="form-group">
                        <label  class="col-md-3 control-label">版本号</label>
                        <div class="col-md-9">
                            <input fieldName="version" type="text" class="form-control" readonly="readonly"  placeholder="版本号"/>
                        </div>
                    </div>
                </div>   
            <#}#>
        </div>
        <#if(config.formType!='add'){#>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">创建时间</label>
                    <div class="col-md-9">
                        <input fieldName="createDate" type="text" class="form-control" readonly="readonly"  placeholder="版本号"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">更新时间</label>
                    <div class="col-md-9">
                        <input fieldName="updateDate" type="text" class="form-control" readonly="readonly"  placeholder="版本号"/>
                    </div>
                </div>
            </div>
        </div>
        <#}#>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-1 control-label">描述</label>
                    <div class="col-md-11">
                        <textarea fieldName="description" class="form-control" rows="3" placeholder="描述" <#if(config.formType=='view'){#>readonly="readonly"<#}#>/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            
        </div>        
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