<span class="location"></span>
<a href="javascript:void(0);" class="btn_open_location_panel">请设置坐标</a>

<div class="modal fade locationModal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">位置设置</h4>
      </div>
      <div class="modal-body" id="map_<#= eleBean.element.id#>" style="height:600px;">
  	  </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
        <button type="button" class="btn btn-primary btn_set_location">确定位置</button>
      </div>
    </div>
  </div>
</div>