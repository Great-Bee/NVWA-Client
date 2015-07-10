<div class="
            <#if(attributes.editorCol){#> col-sm-<#=attributes.editorCol#><#}#>
            <# if (attributes.prefix){#> input-group<#}#>
            has-feedback
            has-success">
            <# if (attributes.prefix){#><div class="input-group-addon"><#=attributes.prefix#></div><#}#>
    <textarea type="<#=attributes.type#>" 
            class="form-control 
            <#if(attributes.size){#> input-<#=attributes.size#><#}#>
            " 
            <# if (attributes.placeholder){#> placeholder="<#=attributes.placeholder#>" <#}#>
            <# if (attributes.disabled){#> disabled <#}#>
            <# if (attributes.readonly){#> readonly="readonly" <#}#>
            id="b"></textarea>
    <span class="glyphicon form-control-feedback
                <#= attributes.feedback ? 'show' : ' hidden'#>
                <#= attributes.feedback ? 'glyphicon-'+attributes.feedback : ''#>"></span>
</div>
<p class="help-block <#= attributes.helpLabel ? 'show' : ' hidden'#>">
    <#if(attributes.helpLabel){#><#=attributes.helpLabel#><#}#>
</p>