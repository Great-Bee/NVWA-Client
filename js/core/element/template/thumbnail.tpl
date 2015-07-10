<#if(editAble){#>
<div>卡片插件</div>
<#}else{#>
  <div class="row">
    <#if(data){#>     
      <#if(data&&$nvwa.array.isVerify(data)){
        for(c=0;c<data.length;c++){#>
         <#if(thumbnailConfig&&thumbnailConfig.columnWidth){#>
          <div class="col-md-<#=thumbnailConfig.columnWidth#>" 
            <#if(thumbnailConfig&&thumbnailConfig.columnGapValue){#>
              style="padding-left:0px;padding-right:<#=thumbnailConfig.columnGapValue#>px"
            <#}#>
            >
          <#}else{#>
          <div class="col-md-3>">
          <#}#>
            <div class="thumbnail">
              <img src="<#=data[c].imageUrl#>" >
              <div class="caption">
                <!--如果有title则把title显示出来，没有就不显示任何关于title的html元素-->
                <#if($nvwa.string.isVerify(data[c].title)){#>
                  <h3><#=data[c].title#></h3>
                <#}#>
                <#if($nvwa.string.isVerify(data[c].content)){#>
                  <#=data[c].content#>   
                <#}#>                       
              </div>
            </div>
          </div>  
        <#}
      }
    }#>
  </div>
<#}#>
