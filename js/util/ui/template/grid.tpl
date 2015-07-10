<div class="panel panel-default">
  <!-- Default panel contents -->
  <#if(config.showTitle){#>
  <div class="panel-heading"><#=config.title#></div>
  <#}#>
  <!-- Table -->
  <table id="<#=config.containerId#>-table" class="table table-hover table-bordered">
  <!-- header -->
    <#if(config.showHeader){#>
        <thead>
            <tr class=''>
                <#for(c=0;c<config.columns.length;c++){#>
                    <#if(c==0&&config.hiddenId){
                      #><td class='item hidden'><#=config.columns[c].columnName#></td><#
                    }else{
                      #><td class='item'><#=config.columns[c].columnName#></td><#
                    }#>                    
                <#}#>
            </tr>
        </thead>
    <#}#>
    <tbody> 
        <#for(row=0;row<config.currentRecords.length;row++){#>
            <tr class='rows' rowindex="<#=row#>">       
                <#for(c=0;c<config.columns.length;c++){
                  if(c==0&&config.hiddenId){
                    #><td class='hidden'><#
                  }else{
                    #><td><#
                  }    
                  if(config.columns[c].dictionary!=null){
                      #><#=config.columns[c].dictionary[config.currentRecords[row][config.columns[c].fieldName]]#></td><#
                    }else{
                  #>
                    <#=config.currentRecords[row][config.columns[c].fieldName]#></td>
                  <#}#>
                <#}#>                
            </tr>
        <#}#>
    </tbody>
  </table>
  <ul id="<#=config.containerId#>-pagination" class="pagination">    
  </ul>  
</div>