
<div class="form-group ">       
    <#if(editAble){#><div class="<#=serialNumber#>-mask column-mask"></div><#}#>
    <div id="<#=serialNumber#>-col" class="<#= editAble ? 'def' : ''#> control-area">
        <def><#= editAble ? '请拖动元件至此' : ''#></def>        
    </div>
</div>
