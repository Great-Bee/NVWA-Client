<div class="row row-icon">
    <div class="col-md-12">   
        <#if(data){
            for(c=0;c<data.length;c++){#>
        <button type="button" class="btn btn-default btn-iconSelection glyphicon glyphicon-<#=data[c].alias#>" data-toggle="popover" title="<#=data[c].name#>" data-content="<#=data[c].name#>" data-placement="left" role="button"  alias="<#=data[c].alias#>"></button>
            <#}}#>
    </div>
</div>