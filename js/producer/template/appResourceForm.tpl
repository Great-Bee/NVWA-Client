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
                    <label  class="col-md-3 control-label">名称</label>
                    <div class="col-md-9">
                        <input fieldName="name" type="text" class="form-control"  placeholder="名称"/>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <a href="javascript:void(0);">选择页面</a>
                <input fieldName="pageIds" type="hidden" class="form-control"  placeholder="页面列表"/>
                <input fieldName="appAlias" type="hidden" class="form-control"  placeholder="App Alias"/>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-1 control-label">描述</label>
                    <div class="col-md-11">
                        <textarea fieldName="description" class="form-control" rows="3" placeholder="描述"/>
                    </div>
                </div>
            </div>
        </div>
    </form>
  </div>
  <div class="panel-footer">
      <div class="row">
            <div class="col-md-12 navbar-form navbar-right">
                <div class="form-group">
                    <div class="col-md-12">
                        <button class="btn btn-default btn-save">保存</button>
                        <button class="btn btn-default btn-cancel">返回</button>
                    </div>                  
                </div>  
            </div>
        </div>
  </div>
</div>