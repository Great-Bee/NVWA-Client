<div class="panel panel-default">
  <!-- Default panel contents -->
  
  <div class="panel-heading">        
        <#=config.title#>
  </div>
  <div class="panel-body">

    <form class="form-horizontal" role="form">

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">字段名称</label>
                    <div class="col-md-8">
                        <input fieldName="name" type="text" class="form-control"  placeholder="字段名称" required="true"/>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">数据字段</label>
                    <div class="col-md-8">
                        <input fieldName="fieldName" type="text" class="form-control" required="true"  placeholder="对应数据库中的字段名称"/>
                    </div>
                </div>
            </div>      
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">默认值</label>
                    <div class="col-md-8">
                        <input fieldName="defaultValue" type="text" class="form-control"  placeholder="默认值"/>
                    </div>
                </div>
            </div>             
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">必填</label>
                    <div class="col-md-8">
                        <!-- <input fieldName="notNull" type="text" class="form-control" /> -->
                        <input fieldName="notNull" type="checkbox" />
                    </div>
                </div>
            </div>              
        </div>       
        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">数据类型</label>
                    <div class="col-md-8 dataTypeField">
                    </div>
                </div>
            </div>  
            <div class="col-md-6">
                <div class="form-group">
                    <label  class="col-md-4 control-label">长度</label>
                    <div class="col-md-8">
                        <input fieldName="length" type="text" class="form-control" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')"/>
                    </div>
                </div>
            </div> 
             <div class="col-md-6 decimalLengthBox">
                <div class="form-group">
                    <label  class="col-md-4 control-label">小数点长度</label>
                    <div class="col-md-8">
                        <input fieldName="decimalLength" type="text" class="form-control"  placeholder="小数点长度"/>
                    </div>
                </div>
            </div>    
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <label  class="col-md-2 control-label">描述</label>
                    <div class="col-md-10">
                        <textarea fieldName="description" class="form-control" rows="3" placeholder="描述"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="form-group">
                    <#if(config.formType!='view'){#>
                        <div class="col-md-offset-2 col-md-10">
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