<div class="panel panel-default">
  <!-- Default panel contents -->
  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">

    <div class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">名称</label>
                    <div class="col-md-9">
                        <input fieldName="name" type="text" class="form-control"  placeholder="组件名称" required="true"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">别名</label>
                    <div class="col-md-9">
                        <input fieldName="alias" type="text" class="form-control"  placeholder="别名" <#if(config.formType!='add'){#>readonly="readonly"<#}#> required="true"/>
                    </div>
                </div>
            </div>  
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">类别</label>
                    <div class="col-md-9 componentType">
                        
                    </div>
                </div>
            </div>      
        </div>               
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">图标</label>
                    <div class="col-md-9 iconSelectionContainer">
                        
                    </div>
                </div>
            </div>                        
        </div>        
    </div>
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