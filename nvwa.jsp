<%@ page import="org.springframework.web.context.WebApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="java.util.HashMap" %>
<%@ page pageEncoding="utf-8" %>
<!DOCTYPE html>
<html lang="zh-cn">
    <head>
        <meta charset="UTF-8">
        <title>NVWA 制作系统</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<%
        WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
        HashMap systemConfig = (HashMap) context.getBean("systemConfig");
    %>
 <!-- build:css build/css/nvwa-client-1.0.0.min-->
		<link rel="stylesheet" href="build/release-b8a7b4/css/nvwa-client-1.0.0.min.db776b.css">
 <!-- endbuild -->

 <!-- build:jsProducer build/js/nvwa-client-1.0.0.min -->
		<script src="<%=systemConfig.get("staticResourceUrl")%>/nvwa-loader-1.0.0.js"
		baseUrl = "build/release-b8a7b4/js"
		api=""
		skin=""
		debug = "true"
		lang = "zh_CN"
		jsonp = "true"
		nvwa-api=""
		preload = "build/release-b8a7b4/js/nvwa-client-util-1.0.0.min.ddaaa5.js,build/release-b8a7b4/js/nvwa-client-core-1.0.0.min.f71207.js,build/release-b8a7b4/js/nvwa-client-producer-1.0.0.min.697571.js" > </script>
 <!-- endbuild -->
    </head>
    <body>
        <div style="position:fixed;top:0px;right:0px;bottom:0px;left:0px;background-color:#777;">
            <span>系统载入中......</span>
        </div>
    </body>
</html>