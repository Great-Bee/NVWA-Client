<div class="checkbox-container">
    <input type="checkbox"  
        <#= attributes.reverse ? 'data-reverse' : ''#>
        <#= attributes.defaultValue ? 'checked' : ''#>
        <#= attributes.title ? 'title="'+attributes.title+'"' : ''#>
        <#= attributes.disabled ? 'disabled' : ''#>
        <#= attributes.dataOffTitle ? 'data-off-title="'+attributes.dataOffTitle+'"' : ''#>
        <#= attributes.dataOnTitle ? 'data-on-title="'+attributes.dataOnTitle+'"' : ''#>
        <#= attributes.dataOffIconClass ? 'data-off-icon-class="glyphicon glyphicon-'+attributes.dataOffIconClass+'"' : ''#>
        <#= attributes.dataOnIconClass ? 'data-on-icon-class="glyphicon glyphicon-'+attributes.dataOnIconClass+'"' : ''#>
        <#= attributes.dataOfflabel ? '' : 'data-off-label="false"'#>
        <#= attributes.dataOnlabel ? '' : 'data-on-label="false"'#>
        <#= attributes.dataOffColor ? 'data-off-class="btn-'+attributes.dataOffColor+'"' : ''#>
        <#= attributes.dataOnColor ? 'data-on-class="btn-'+attributes.dataOnColor+'"' : ''#>
    >
</div>
<p class="help-block <#= attributes.helpLabel ? 'show' : ' hidden'#>">
    <#if(attributes.helpLabel){#><#=attributes.helpLabel#><#}#>
</p>