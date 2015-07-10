<div class="panel panel-default">
  <!-- Default panel contents -->  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">
    <div class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">容器ID</label>
                    <div class="col-md-8">
                        <input fieldName="containerId" type="text" class="form-control" readonly="readonly" value="<#=config.containerBean.id#>"  placeholder="容器ID"/>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">序列号</label>
                    <div class="col-md-8">
                        <input fieldName="serialNumber" type="text" class="form-control" readonly="=readonly" placeholder="后台自动生成"/>
                    </div>
                </div>
            </div>                 
        </div>
        <div class="row">
            <div class="col-md-6">   
                <div class="form-group">
                    <label  class="col-md-4 control-label">条件字段</label>
                    <div class="col-md-8 conditionFieldName">
                    </div>
                </div>             
            </div>    
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">条件字段值类型</label>
                    <div class="col-md-8 conditionFieldValueType">
                    </div>
                </div>
            </div>            
        </div>
        <div class="row">
            <div class="col-md-6 conditionFieldValueContainer">
                <div class="form-group">
                    <label  class="col-md-4 control-label">条件字段值</label>
                    <div class="col-md-8 conditionFieldValueTextContainer">
                        <input fieldName="conditionFieldValue" type="text" class="form-control"  placeholder="条件字段值"/>
                    </div>
                    <div class="col-md-8 conditionFieldValueSelectContainer hidden">
                        
                    </div>
                </div>
            </div>    
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">条件类型</label>
                    <div class="col-md-8 conditionType">
                    </div>
                </div>
            </div>            
        </div>    
        <div class="row">            
            <div class="col-md-6" style="display:none;">
                <div class="form-group">
                    <label  class="col-md-4 control-label">连接器路径</label>
                    <div class="col-md-8">
                        <input fieldName="connectorPath" type="text" class="form-control"  placeholder="连接器路径"/>
                    </div>
                </div>
            </div>            
        </div>
    </div> 
  </div>
  <div class="panel-footer">
       <div class="row">
            <div class="navbar-form navbar-right">
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