<div class="panel panel-default">
  
  <div class="panel-body">
   <#for(i=0;i<config.reserveds.length;i++){#>
    <div class="row">
        <div class="col-md-2">
            <div class="form-group">
                <button selectIndex="<#=i#>" fieldName="<#=config.reserveds[i].fieldName#>";  class="btn btn-primary col-md-12 <#if(config.reserveds[i].add){#>disabled<#}#>"><#=config.reserveds[i].name#></button>
            </div>
        </div>
        <div class="col-md-10">
            <div class="form-group">
                <span class="help-block col-md-12"><#=config.reserveds[i].description#></span>           
            </div>
        </div>   
    </div>  
    <#}#>
  </div>
</div>