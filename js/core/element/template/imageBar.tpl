  <!-- <ol class="carousel-indicators">
    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="0"></li>
    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="1"></li>
    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="2"></li>
　　    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="3"></li>
    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="4"></li>
    <li data-target="#img-<#=eleBean.serialNumber#>" data-slide-to="5"></li>
  </ol> -->
<#if(editAble){#>
<div>图片轮播插件</div>
<#}else{#>
  <div id="img-<#=eleBean.serialNumber#>" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner" role="listbox">
      <#if(data){#>     
          <#if(data&&$nvwa.array.isVerify(data)){
            for(c=0;c<data.length;c++){#>
              <div class="item <#if(c==0){#>active<#}#>">
                 <img src="<#=data[c].imageUrl#>" class="margin-auto-default"/>
              </div>  
            <#}
          }
       }#>
    </div>
    <a class="left carousel-control" href="#img-<#=eleBean.serialNumber#>" role="button" data-slide="prev">
      <span class="glyphicon glyphicon-chevron-left"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" href="#img-<#=eleBean.serialNumber#>" role="button" data-slide="next">
      <span class="glyphicon glyphicon-chevron-right"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
<#}#>
