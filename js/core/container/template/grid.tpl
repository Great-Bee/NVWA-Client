<div class="panel panel-${attributes.style} panel-bottom" container="grid" style="margin-bottom:0px;">
    <div class="panel-heading" <#if(editAble){#>style="height: 54px;"<#}#>>
      <h3 class="panel-title" <#if(editAble){#>style="float:left;line-height: 34px;"<#}#>>
          ${attributes.title}
      </h3>
      <#if(editAble){
          #>
          <form id="addField" class="navbar-form navbar-right">
            <button type="button"  class="btn btn-default"><span class="glyphicon glyphicon-plus"></span> 点击添加字段</button>
          </form>
          <div id="addFieldArea" class="hidden"></div><#
      }#>
    </div>    
    <div class="panel-body grid-default-body">
        <!--表单部署区域-->
    </div>    
</div>