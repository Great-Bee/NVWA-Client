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
                    <label  class="col-md-3 control-label">字段名称</label>
                    <div class="col-md-9">
                        <input fieldName="name" type="text" class="form-control"  required="true" placeholder="字段名称"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">FieldName</label>
                    <div class="col-md-9">
                        <input fieldName="fieldName" type="text" class="form-control" required="true"  placeholder="Field Name"/>
                    </div>
                </div>
            </div>  
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">类名</label>
                    <div class="col-md-9">
                        <input fieldName="className" type="text" class="form-control" required="true"  placeholder="类名"/>
                    </div>
                </div>
            </div>  
                        
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-1 control-label">描述</label>
                    <div class="col-md-11">
                        <textarea fieldName="description" class="form-control" rows="3" placeholder="描述"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-1 control-label">属性</label>
                    <div class="col-md-11">
                        <textarea fieldName="attributes" class="form-control" rows="3" placeholder="属性"/>
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