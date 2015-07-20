
  <!-- Default panel contents -->
  
  <!-- Table -->
  <table id="<#=eleBean.serialNumber#>-table" class="table table-hover table-bordered">
  <!-- header -->
    <#if(attributes.showHeader){#>
        <thead>
            <tr class=''>
              <!-- <td></td> -->
                <#for(c=0;c<elements.length;c++){#>
                    <td  class='item' elementId="<#=elements[c].element.id#>"><#=elements[c].element.name#>
                      <#if(editAble&&c>0){#>
                        <div id="<#=elements[c].element.id#>-header-remove" class="btn btn-danger btn-xs navbar-right removeable" elementId="<#=elements[c].element.id#>">删除</div>
                        <div id="<#=elements[c].element.id#>-header" class="btn btn-default btn-xs navbar-right moveable" elementId="<#=elements[c].element.id#>">移动</div>
                        <div class="btn btn-default btn-xs navbar-right btn-info hidden column-drop-area" style="margin-right:10px;" index="<#=c#>" >放置在此</div>  
                        <div id="<#=elements[c].element.id#>-header-attribute" class="attributeBtn btn btn-danger btn-xs navbar-right" elementId="<#=elements[c].element.id#>">属性</div>                 
                      <#}#>
                    </td>
                <#}#>
            </tr>
        </thead>
    <#}#>
    <tbody> 
        <#if(data.totalRecords>0){
          for(row=0;row<data.currentRecords.length;row++){#>
            <tr class='rows' rowindex="<#=row#>">                       
              <#
              rowObject=data.currentRecords[row];
              for(c=0;c<elements.length;c++){
                 #><td><#=rowObject[elements[c].element.serialNumber]#></td>
                <#}#>
              <#}#>                
          </tr>
          <#
            }          
        #>
    </tbody>
  </table>
  <ul id="<#=eleBean.serialNumber#>-pagination" class="pagination">    
  </ul>  
