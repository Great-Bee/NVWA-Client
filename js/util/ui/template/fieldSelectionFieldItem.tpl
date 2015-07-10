<div class="row row-field">
    <div class="col-md-12">           
        <button type="button" class="btn btn-default btn-fieldSelection col-md-12  <#if(haveSelected){#>field-selected<#}#>" data-toggle="popover" title="<#=field.name#>" data-content="<div>数据类型:<#=field.dataTypeField#></div><div>描述:<#=field.description#></div><#if(haveSelected){#><div>已选择</div><#}#>" data-placement="left" role="button" connPath="<#=connPath#>" field="<#=field.fieldName#>" fieldSerialNumber="<#=field.serialNumber#>"><#=field.name#></button>
    </div>
</div>