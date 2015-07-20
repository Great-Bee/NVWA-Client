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
 <div  class="col-md-9">

        <ul class="nav nav-tabs" id="tabTitle">
       <!--   <li role="presentation" class="active"><a href="#啊" idname="#啊">Home</a></li>
          <li role="presentation"><a href="#profile" idname="#profile">Profile</a></li>
          <li role="presentation"><a href="#messages" idname="#messages">Messages</a></li>
      -->
          <li  role="presentation">
            <div class="tab-setting-container">
              <!--  <button type="button" class="btn btn-default btn-default">
                <span class="glyphicon glyphicon-plus"></span>
                 <b>添加tab</b>
             </button>-->
            </div>
        </li>
        </ul>
        <div class="tab-content" style="padding-top: 10px;"> 
        <!--  <div class="tab-pane active" id="啊">
                 <div>                                                         
                        <div  class="<#if(editAble){#>def<#}#>  def-top-button-bar top-button-bar control-area <#if(editAble){#>ui-droppable<#}#>">
                            <div class="top-button-box">                                   
                                <#if(editAble){#><div class="column-mask hidden"></div><#}#>                        
                                <div  class="element-drop-area <#if(editAble){#>ui-droppable<#}#>">
                                    <def <#if(!editAble){#>class="hidden"<#}#>>请放置元件2</def>        
                                </div>                               
                            </div>
                        </div>
                    </div>
     
            <div> 
                    <div class="form-group">                                 
                        <div class="grid-setting-container">                
                            
                        </div>                          
                        <div  class="def def-grid-bar grid-bar control-area">
                            <def>请放置元件</def>        
                        </div>
                    </div>
                </div>


          </div> 
          <div class="tab-pane" id="profile">


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
         
            <div> 
                    <div class="form-group">                                 
                        <div class="grid-setting-container">                
                            
                        </div>                          
                        <div  class="def def-grid-bar grid-bar control-area">
                            <def>请放置元件</def>        
                        </div>
                    </div>
                </div>


          </div> 

          <div class="tab-pane" id="messages">...</div> 
         -->
        </div> 

                <!--<div  class="col-md-9">--><!--按钮-->                    
          <!--          <div>                                                         
                        <div  class="<#if(editAble){#>def<#}#>  def-top-button-bar top-button-bar control-area <#if(editAble){#>ui-droppable<#}#>">
                            <div class="top-button-box">                                   
                                <#if(editAble){#><div class="column-mask hidden"></div><#}#>                        
                                <div  class="element-drop-area <#if(editAble){#>ui-droppable<#}#>">
                                    <def <#if(!editAble){#>class="hidden"<#}#>>请放置元件</def>        
                                </div>                               
                            </div>
                        </div>
                    </div>
           <!--     </div>-->
            <!--    <div class="col-md-9">--><!--grid-->
         <!--   <div> 
                    <div class="form-group">                                 
                        <div class="grid-setting-container">                
                            
                        </div>                          
                        <div  class="def def-grid-bar grid-bar control-area">
                            <def>请放置元件</def>        
                        </div>
                    </div>
                </div>
               <!-- </div>-->
</div>

            </div>
        </div>
    </div>   
</div>