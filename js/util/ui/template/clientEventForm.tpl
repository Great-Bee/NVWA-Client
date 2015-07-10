<div class="panel panel-default">
  <!-- Default panel contents -->
  <div class="panel-heading">
        <#=config.title#>
  </div>
  <div class="panel-body">
    <form class="form-horizontal" role="form">
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">目标ID</label>
                    <div class="col-md-9">
                        <input fieldName="targetId" type="text" class="form-control" readonly="readonly" value="<#=config.targetId#>"  placeholder="目标ID"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">事件名称</label>
                    <div class="col-md-9 eventName">
                       <!--  <input fieldName="eventName" type="text" class="form-control"  placeholder="客户端事件的名称"/> -->
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">别名</label>
                    <div class="col-md-9 alias">
                        <!-- <input fieldName="alias" type="text" class="form-control"  placeholder="全局唯一" <#if(config.formType!='add'){#>readonly="readonly"<#}#>/> -->
                    </div>
                </div>
            </div>
        </div>     
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <table class="table table-striped table-hover table-bordered table-condensed table-responsive table-parameters">
                        <thead>
                            <tr>
                                <th class="schema">参数名</th>
                                <th class="schema">别名</th>
                                <th class="schema">值</th>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div> 
        <input fieldName="target" type="hidden"  value="<#=config.target#>" />
        <input fieldName="arguments" type="hidden" />
    </form> 
  </div>
  <div class="panel-footer">
       <div class="row">
            <div class="col-md-12  navbar-form navbar-right">
                <div class="form-group">
                    <div class="col-md-12">
                        <#if(config.formType!='view'){#>
                            <button class="btn btn-default btn-save">保存</button>
                        <#}#>
                        <button class="btn btn-default btn-cancel">返回</button>
                    </div>
                </div>  
            </div>
        </div> 
  </div>
</div>