<div class="radio-container 
    <#= attributes.editorCol ? 'col-sm-'+ attributes.editorCol : ''#>
">
    <#if(attributes.selectData){#>
    <#for(c=0;c<attributes.selectData.length;c++){#>
        <div class="iradio">
          <input type="radio" name="radio-<#=eleBean.serialNumber#>" id="baz[<#=c#>]" value="<#=attributes.selectData[c].value#>" <#= attributes.disabled ? 'disabled' : ''#>
          <#if(attributes.selectData[c].value==attributes.value){
              #>checked<#
              }#>
          >
          <label for="baz[<#=c#>]"><#=attributes.selectData[c].text#></label>
        </div>
    <#}}#>
</div>
<p class="help-block <#= attributes.helpLabel ? 'show' : ' hidden'#>">
    <#if(attributes.helpLabel){#><#=attributes.helpLabel#><#}#>
</p>
