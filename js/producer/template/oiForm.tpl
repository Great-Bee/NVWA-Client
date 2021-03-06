<div class="panel panel-default">
  <!-- Default panel contents -->
  
  <div class="panel-heading">        
        <!-- <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label"><#=config.title#></label>
                    <div class="col-md-9">
                        <button class="btn btn-default btn-cancel">字段设置</button>
                    </div>
                </div>
            </div>            
        </div> -->
        <ul class="nav nav-pills" role="tablist">
            <li class="active disabled" ><a href="#">存储设置</a></li>
            <#if(config.formType!='add'){#>
                <li><a class="btn-fieldSettings" href="javascript:void(0)">字段设置</a></li>
                <li><a class="btn-connectorSettings" href="javascript:void(0)">连接器设置</a></li>
                <li><a class="btn-logs" href="javascript:void(0)">日志</a></li>
            <#}#>
        </ul>
  </div>
  <div class="panel-body">

    <form class="form-horizontal" role="form">

        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">存储名称</label>
                    <div class="col-md-9  has-warning has-feedback">
                        <input fieldName="name" type="text" class="form-control"  placeholder="存储名称,必填" required="true"/>
                        <span class="glyphicon glyphicon-warning-sign form-control-feedback"></span>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">标识符</label>
                    <div class="col-md-9">
                        <input fieldName="identified" type="text" class="form-control"  placeholder="标识符,选填"/>
                    </div>
                </div>
            </div>  
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">数据库表名</label>
                    <div class="col-md-9">                        
                        <input fieldName="tableName" type="text" class="form-control"  placeholder="数据库表名,选填"/>                        
                    </div>
                </div>
            </div>  
                        
        </div>
        <#if(config.formType!='add'){#>
        <div class="row">
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">创建时间</label>
                    <div class="col-md-9">
                        <input fieldName="createDate" type="text" class="form-control" readonly="readonly" />
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="form-group">
                    <label  class="col-md-3 control-label">状态</label>
                    <div class="col-md-9">
                        <input fieldName="status" type="text" class="form-control" readonly="readonly" />
                    </div>
                </div>
            </div>      
        </div>
        <#}#>
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
        <div class="row">
            <div class="col-md-12">

                <div class="form-group">
                    <#if(config.formType=='add'){#>
                    
                    <div class="col-md-offset-1 col-md-11">
                        <div class="checkbox">
                            <label>
                                <input id="isSyncSchema" type="checkbox" checked="checked" />同步到Schema
                            </label>
                        </div>
                    </div>
                    <#}#>
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