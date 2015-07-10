<video <#if(attributes&&$nvwa.string.isVerify(attributes.src)){#> src="<#=attributes.src#>"<#}#> 
	<#if(attributes&&attributes.width){#> width="<#=attributes.width#>"<#}#> 
	<#if(attributes&&attributes.height){#> height="<#=attributes.height#>"<#}#> 
	<#if(videoConfig&&videoConfig.controls){#> controls="controls" <#}#> 
	<#if(videoConfig&&videoConfig.autoplay){#> autoplay="autoplay" <#}#> 
	<#if(videoConfig&&videoConfig.loop){#> loop="loop" <#}#> 
	>
您的浏览器不支持 video 标签。
</video>