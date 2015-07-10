<div class="btn-group btn-block">
    <button class="btn btn-default btn-block 
     <#= attributes.size ? 'btn-'+attributes.size : ''#>
     dropdown-toggle" type="button" data-toggle="dropdown">
        <t><#=attributes.placeholder?attributes.placeholder:'请选择'#></t> <span class="caret"></span>
    </button>
    <ul class="dropdown-menu btn-block 
     <#= attributes.readonly ? 'hidden' : ''#>
     <#= attributes.disabled ? 'hidden' : ''#>
     <#= attributes.selectData ? '' : 'hidden'#>
    " role="menu">   
    </ul>
    <input type="hidden"/>
</div>
<p class="help-block <#= attributes.helpLabel ? 'show' : ' hidden'#>">
    <#if(attributes.helpLabel){#><#=attributes.helpLabel#><#}#>
</p>
<!-- <a debug="true" href="javascript:void(0);">debug</a> -->
