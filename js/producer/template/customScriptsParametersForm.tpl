<div class="panel panel-default">
  <!-- Default panel contents -->  
  <div class="panel-heading" style="height: 54px;">        
        <#=config.title#>
    </div>
  <div class="panel-body">
    <form class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">名称</label>
                    <div class="col-md-8">
                        <input fieldName="name" type="text" class="form-control"  placeholder="参数名称" required="true"/>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">别名</label>
                    <div class="col-md-8">
                        <input fieldName="alias" type="text" class="form-control"  placeholder="别名,唯一" <#if(config.formType!='add'){#>readonly="readonly"<#}#> required="true"/>
                    </div>
                </div>
            </div>   
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">默认值</label>
                    <div class="col-md-8 ">
                        <input fieldName="defaultValue" type="text" class="form-control"  placeholder="默认值"/>
                    </div>
                </div>
            </div>                 
        </div>
        <#if(config.formType!='add'){#>
        <div class="row">               
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">创建时间</label>
                    <div class="col-md-8 ">
                        <input fieldName="createDate" type="text" class="form-control"  placeholder="创建时间" readonly="readonly"/>
                    </div>
                </div>
            </div>                
        </div>
        <#}#>
        <div class="row">            
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-2 control-label">描述</label>
                    <div class="col-md-10">
                        <textarea fieldName="description" class="form-control" rows="3" placeholder="描述"/>
                    </div>
                </div>
            </div>         
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