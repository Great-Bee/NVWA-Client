<div class="form-group">
	<#if(data){
		for(c=0;c<data.length;c++){#>
		<a href="javascript:void(0);" class="btn-primary btn-componentsSelection" alias="<#=data[c].alias#>" style="margin-bottom:2px;" type="add" data-placement="left" data-toggle="tooltip"  title="<#=data[c].name#>"><span class="glyphicon glyphicon-<#=data[c].icon#>"></span></a>
	<#}}#>
</div>