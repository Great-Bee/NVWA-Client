<div>
	<select class="form-control datasource">
		<option value="">请选择数据源类型</option>
		<option value="static">静态数据</option>
		<option value="dynamic">动态数据</option>
	 </select>
	 <# if (_debug){#>
	 	<!-- <a href="javascript:void(0);" class="btn_debug">Debug</a> -->
	 <#}#>
</div>

<div class="static hidden" style="margin-top:8px;">
	<table class="table table-striped table-hover table-bordered table-condensed table-responsive">
		<thead>
			<tr></tr>
		</thead>
		<tbody></tbody>
	</table>
</div>

<div class="dynamic hidden margin-top-default">
	<!-- <a href="javascript:void(0);" class="btn btn-default btn_choose_container">请选择页面</a>	 -->
	<div class="btnPageContainer"></div>
	<select class="form-control containerSelect margin-top-default">
		<option value="">请选择容器</option>		
	</select>	
	<label class="margin-top-default " style="margin-bottom:0px;"></label>
	<table class="table table-striped table-hover table-bordered table-condensed table-responsive margin-top-default margin-bottom-default">
		<thead>
			<tr>
				<th>Schema</th>
				<th>数据源字段</th>
			</tr>
		</thead>
		<tbody></tbody>
	</table>
</div>