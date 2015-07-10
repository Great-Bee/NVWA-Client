<div class="panel panel-${attributes.style}" container="form">
	<div class="panel-heading <#=(editAble || (!editAble && attributes && $nvwa.string.isVerify(attributes.title))) ? 'show' : 'hidden'#>">
	  <h3 class="panel-title">${attributes.title}</h3>
	</div>
	<div class="panel-body">
		<!--表单部署区域-->
	</div>

	<# if (editAble){#>
		<div class="panel-footer">
			<div class="row">
				<div class="col-md-12 navbar-form navbar-right">
					<a href="javascript:void(0);" class="btn btn-primary btn-lg btnAddRow" style="margin-right: 15px;">添加表单列</a>
				</div>
			</div>
		</div>
	<#}#>

	<!-- 如果不在编辑模式下，并且没有button的layout数据时隐藏button栏 -->
	<#
		var showButtonBody = true;
		if (!editAble) {
			var layouts = $nvwa.string.jsonStringToObject(elementLayout.layouts);
			if (layouts && layouts.buttons && layouts.buttons.length > 0 && layouts.buttons[0] && layouts.buttons[0].length > 0) {
				showButtonBody= true;
			} else {
				showButtonBody= false;
			}
		}
	#>
	<div class="panel-footer buttons <#=showButtonBody ? 'show' : 'hidden'#>">
		<!--按钮部署区域-->
	</div>

	<!-- 如果不在编辑模式下，并且没有Defalt Button Attribute的layout数据时隐藏button栏 -->
	<#
		var showDefaultBtnBody = editAble || (!editAble && attributes && (attributes.createAble||attributes.updateAble||attributes.searchAble||attributes.cancelAble));
	#>
	<div class="panel-footer <#=showDefaultBtnBody ? 'show' : 'hidden'#>">
		<div class="row">
			<div class="col-md-12 navbar-form navbar-right">
				<a href="javascript:void(0);" class="btn btn-default btnCreate <#if(!attributes.createAble){#>hidden<#}#>" style="margin-right: 15px;">添加</a>
				<a href="javascript:void(0);" class="btn btn-default btnSave <#if(!attributes.updateAble){#>hidden<#}#>" style="margin-right: 15px;">保存</a>
				<a href="javascript:void(0);" class="btn btn-default btnSearch <#if(!attributes.searchAble){#>hidden<#}#>" style="margin-right: 15px;">搜索</a>
				<a href="javascript:void(0);" class="btn btn-default btnCancel <#if(!attributes.cancelAble){#>hidden<#}#>" style="margin-right: 15px;">取消</a>
			</div>
		</div>
	</div>
</div>