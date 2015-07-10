
<div class="row margin-base">
    <div class="col-md-10 border-base" id="editor_container_form" style="padding-top:10px;color:#000000;display:block;overflow-y:auto;overflow-x:hidden;height:<#=document.documentElement.clientHeight-80#>px"></div>
    <div class="col-md-2">
       <div class="row">
        <div class="margin-base">
          <a href="#container/form/preview/<#=config['containerAlias']#>" class="btn btn-info" target="_blank">预览</a>
          <a href="javascript:void(0);" class="btn btn-info btnCreateSimplePage" target="_blank">生成"简单页面"</a>
        </div>
        <div  class="margin-base">
          <div id="containerSettings"  data-collapse style="overflow-y:auto;overflow-x:hidden;">
            <div class="bs-callout bs-callout-info">元件</div>
            <div class="settingItem" id="component"></div>

            <div class="bs-callout bs-callout-info">属性</div>
            <div class="settingItem" id="attribute"></div>

            <div class="bs-callout bs-callout-info" >条件</div>
            <div class="settingItem" id="condition"></div>

            <div class="bs-callout bs-callout-info">事件</div>
            <div class="settingItem" id="event"></div>
          </div>

          <div id="elementSettings"  data-collapse  style="display:none;overflow-y:auto;overflow-x:hidden;"></div>
        </div>
      </div>
    </div>
</div>