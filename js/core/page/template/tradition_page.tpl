<div class="panel panel-<#=attributes.style#>" pageAlias="<#=pageBean.alias#>">
    <div class="panel-heading">
    <#if(editAble){#> 
        <div class="row">       
            <div class="col-md-6 navbar-form navbar-left">
                <h1 class="panel-title" style="color:#fff;">编辑区域</h1>        
            </div>            
        </div> 
    <#}#>       
    </div>
    <div class="panel-body">
        <!--表单部署区域-->
        <div>
            <div class="row<#if(editAble){#> alert alert-info<#}#>">                
                <div   class="col-md-3" ><!--搜索框-->
                    <div class="form-group">
                        <div class="search-setting-container">                
                            
                        </div>
                                                                    
                        <div  class="def def-search-bar search-bar control-area"> 
                            <def <#if(!editAble){#>class="hidden"<#}#>>请放置元件</def>        
                        </div>
                         
                    </div>
                </div>
                <div  class="col-md-9"><!--按钮-->                    
                    <div>                                                         
                        <div  class="<#if(editAble){#>def<#}#>  def-top-button-bar top-button-bar control-area <#if(editAble){#>ui-droppable<#}#>">
                            <div class="top-button-box">                                   
                                <#if(editAble){#><div class="column-mask hidden"></div><#}#>                        
                                <div  class="element-drop-area <#if(editAble){#>ui-droppable<#}#>">
                                    <def <#if(!editAble){#>class="hidden"<#}#>>请放置元件</def>        
                                </div>                               
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-9"><!--grid-->
                    <div class="form-group">                                 
                        <div class="grid-setting-container">                
                            
                        </div>                          
                        <div  class="def def-grid-bar grid-bar control-area">
                            <def>请放置元件</def>        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>   
</div>