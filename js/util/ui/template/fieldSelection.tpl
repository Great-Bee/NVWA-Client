  
    <div class="col-md-<#=config.btnWidth#>" <#if(config&&config.noGap){#>style="padding:0px;"<#}#>>
        <button class="btn btn-default btn-fieldSelection glyphicon glyphicon-check" style="width:100#;"></button>
    </div>                   
    <div class="col-md-<#=config.textWidth#>" <#if(config&&config.noGap){#>style="padding-right:0px;"<#}#>>
        <input  fieldName="<#=config.fieldNameTextFieldName#>" type="text" class="form-control" readonly="readonly"  placeholder="请选择条件字段"/>
        <input  fieldName="<#=config.connPathTextFieldName#>" type="hidden" class="form-control" readonly="readonly"  />
         <input  fieldName="<#=config.fieldSerialNumberFieldName#>" type="hidden" class="form-control" readonly="readonly" />
    </div>                    

