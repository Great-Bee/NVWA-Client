<nav class="navbar navbar-default" role="navigation">
   <div class="container-fluid">
      <#if(attributes&&$nvwa.string.isVerify(attributes.title)){#>
      <div class="navbar-header">
         <a class="navbar-brand" <#if(attributes&&$nvwa.string.isVerify(attributes.link)){#> href="<#=attributes.link#>"  <#}#> > <#=attributes.title#></a>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menu-<#=eleBean.serialNumber#>">
           <span class="sr-only">Toggle navigation</span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
           <span class="icon-bar"></span>
         </button>
      </div>
      <#}#>
   
      <div class="collapse navbar-collapse" id="menu-<#=eleBean.serialNumber#>">
         <#if(data){#>
         <ul class="nav navbar-nav">
            <#if(data&&$nvwa.array.isVerify(data)){
               for(c=0;c<data.length;c++){#>
                  <li <#if(data[c].isActive){#> class="active" <#}#>><a href="<#=data[c].link#>"><#=data[c].title#></a></li>
               <#}
            }#>         
         </ul>
         <#}#>
      </div>        
   </div>
</nav>

