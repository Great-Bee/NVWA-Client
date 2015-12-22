<#
  var cards=dataSource.cards;
  if($nvwa.array.isVerify(cards)){
    for(var i=0;i<cards.length;i++){
       #><div class="row" rowIndex="<#=i#>"><#
       var row=cards[i];
       if($nvwa.array.isVerify(row)){
         for(var k=0;k<row.length;k++){
          var item=row[k];
          if(item){
              var link=item.link;
              var title=item.title;
              var subTitle=item.subTitle;
              var content=item.content;

              #><div class="col-md-3" columnIndex="<#=k#>">
                  <div class="thumbnail">
                    <div class="caption">
                  <#if($nvwa.string.isVerify(link)){#>
                    <a href="<#=link#>"  target="_blank" >
                  <#}#>      
                  <h3> 
                  <#if($nvwa.string.isVerify(title)){#>
                    <#=title#><br>
                  <#}#>
                  <#if($nvwa.string.isVerify(subTitle)){#>
                    <small><#=subTitle#></small>
                  <#}#>
                  </h3>
                  <#if($nvwa.string.isVerify(link)){#>
                    </a>
                  <#}#>  
                  <#if($nvwa.string.isVerify(content)){#>
                      <p><#=content#></p>
                  <#}#>
                  </div>
                </div>
              </div><#
            }
         }         
       }
      #></div><#
    }    
  }
#>