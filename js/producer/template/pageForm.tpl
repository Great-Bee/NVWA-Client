<div class="panel panel-default">
  <!-- Default panel contents -->  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">
    <form class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">名称</label>
                    <div class="col-md-8">
                        <input fieldName="name" type="text" class="form-control"  placeholder="页面名称" required="true"/>
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
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">类型</label>
                    <div class="col-md-8 pageTypeContainer">
                        
                    </div>
                </div>
            </div>                       
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">开发者</label>
                    <div class="col-md-8">
                        <input fieldName="producer" type="text" class="form-control"  placeholder="开发者" readonly="readonly"/>
                    </div>
                </div>
            </div>    
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">创建时间</label>
                    <div class="col-md-8 ">
                        <input fieldName="createDate" type="text" class="form-control"  placeholder="创建时间" readonly="readonly"/>
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