<div id="<#=serialNumber#>" class="row <#= editAble ? 'alert alert-info' : ''#>">
    <#if(editAble){#>   
        <div class="form-group">
            <div class="col-md-12">
                <button id="<#=serialNumber#>-delete" class="btn btn-default btn-xs btn-row-delete">删除</button>  
                <!-- <button id="<#=serialNumber#>-addRow" class="btn btn-default btn-xs btnRowAddRow">添加行</button> -->
                <button  class="btn btn-default btn-xs btnRowAddColumn btn-clone">复制布局</button>                
                <button id="<#=serialNumber#>-addColumn" class="btn btn-default btn-xs btnRowAddColumn">添加列</button>
                <button  class="btn btn-default btn-xs btnRowAddColumn btn-rowUP">向上</button>
                <button  class="btn btn-default btn-xs btnRowAddColumn btn-rowDown">向下</button>                
                <label  class="control-label tips-label">←点击 “添加列” 部署元件</label>
            </div>
        </div>  
    <#}#>
</div>