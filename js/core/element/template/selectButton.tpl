
<div class="btn-group selectButton">
  <button type="button" class="btn btn-default dropdown-toggle <#= attributes.size ? 'btn-'+attributes.size : ''#>" data-toggle="dropdown" aria-expanded="false">
    <b><#=attributes.text ? attributes.text : '下拉按钮'#></b> <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
	<#if(data){
        for(c=0;c<data.length;c++){#>
            <li><a href="<#=data[c].value#>"><#=data[c].name#></a></li>
    <#}}#>
  </ul>
</div>