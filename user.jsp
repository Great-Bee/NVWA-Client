<%@ page import="org.springframework.web.context.WebApplicationContext" %>
<%@ page import="org.springframework.web.context.support.WebApplicationContextUtils" %>
<%@ page import="java.util.HashMap" %>
<%@ page pageEncoding="utf-8" %>
<%
        WebApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
        HashMap systemConfig = (HashMap) context.getBean("systemConfig");
    %>
<!doctype html>
<html lang="zh-cn">
    <head>
        <meta charset="UTF-8">
        <title>NVWA 制作系统</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
         <!-- build:css build/css/nvwa-client-1.0.0.min-->
		<link rel="stylesheet" href="build/release-b8a7b4/css/nvwa-client-1.0.0.min.db776b.css">
 <!-- endbuild -->
  <!-- build:jsUser build/js/nvwa-client-1.0.0.min -->
		<script src="<%=systemConfig.get("staticResourceUrl")%>/nvwa-loader-1.0.0.js"
		baseUrl = "build/release-b8a7b4/js"
		api=""
		skin=""
		debug = "true"
		lang = "zh_CN"
		jsonp = "true"
		nvwa-api=""
		preload = "build/release-b8a7b4/js/nvwa-client-util-1.0.0.min.ddaaa5.js,build/release-b8a7b4/js/nvwa-client-core-1.0.0.min.f71207.js,build/release-b8a7b4/js/nvwa-client-user-1.0.0.min.8d9859.js" > </script>
 <!-- endbuild -->
        <style>

       
           .overlay {
            background: #080808;
            position: fixed;
            z-index: 99999;
            width: 100%;
            height: 100%;
            top: 0px;
            left: 0px;
           }

           .overlay ul {
            padding: 0; 
            margin: 300px auto 0;
            list-style: none;
            text-align: center;
            display: block;
           }

           .overlay ul li {
            width: 10px;
            height: 10px;
            background-color: white;
            box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.5);
            display: inline-block;
            border-radius: 50%;
            margin: 0 4px;
            -webkit-animation: loading 2.5s infinite;
            -moz-animation: loading 2.5s infinite;
            -o-animation: loading 2.5s infinite;
            -ms-animation: loading 2.5s infinite;
            animation: loading 2.5s infinite;
            
            -webkit-animation-fill-mode: both;
            -moz-animation-fill-mode: both;
            -o-animation-fill-mode: both;
            -ms-animation-fill-mode: both;
            animation-fill-mode: both;
            
            -webkit-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
            -moz-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
            -o-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
            -ms-animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
            animation-timing-function: cubic-bezier(0.030, 0.615, 0.995, 0.415);
           }

           .overlay ul li.li6  {
            -webkit-animation-delay: 0.1s;
            -moz-animation-delay: 0.1s;
            -o-animation-delay: 0.1s;
            -ms-animation-delay: 0.1s;
            animation-delay: 0.1s;
           }

           .overlay ul li.li5 {
            -webkit-animation-delay: 0.25s;
            -moz-animation-delay: 0.25s;
            -o-animation-delay: 0.25s;
            -ms-animation-delay: 0.25s;
            animation-delay: 0.25s;
           }
           .overlay ul li.li4 {
            -webkit-animation-delay: 0.5s;
            -moz-animation-delay: 0.5s;
            -o-animation-delay: 0.5s;
            -ms-animation-delay: 0.5s;
            animation-delay: 0.5s;
           }
           .overlay ul li.li3 {
            -webkit-animation-delay: 0.75s;
            -moz-animation-delay: 0.75s;
            -o-animation-delay: 0.75s;
            -ms-animation-delay: 0.75s;
            animation-delay: 0.75s;
           }
           .overlay ul li.li2  {
            -webkit-animation-delay: 1s;
            -moz-animation-delay: 1s;
            -o-animation-delay: 1s;
            -ms-animation-delay: 1s;
            animation-delay: 1s;
           }
           .overlay ul li.li1  {
            -webkit-animation-delay: 1.25s;
            -moz-animation-delay: 1.25s;
            -o-animation-delay: 1.25s;
            -ms-animation-delay: 1.25s;
            animation-delay: 1.25s;
           }

           @-webkit-keyframes loading {
            0% {-webkit-transform: translateX(-30px); opacity: 0}
            25% {opacity: 1}
            50% {-webkit-transform: translateX(30px); opacity: 0}
            100% {opacity: 0}
           }

           @-moz-keyframes loading {
            0% {-moz-transform: translateX(-30px); opacity: 0}
            25% {opacity: 1}
            50% {-moz-transform: translateX(30px); opacity: 0}
            100% {opacity: 0}
           }

           @-o-keyframes loading {
            0% {-o-transform: translateX(-30px); opacity: 0}
            25% {opacity: 1}
            50% {-o-transform: translateX(30px); opacity: 0}
            100% {opacity: 0}
           }

           @-ms-keyframes loading {
            0% {-ms-transform: translateX(-30px); opacity: 0}
            25% {opacity: 1}
            50% {-ms-transform: translateX(30px); opacity: 0}
            100% {opacity: 0}
           }

           @keyframes loading {
            0% {-ms-transform: translateX(-30px); opacity: 0}
            25% {opacity: 1}
            50% {-ms-transform: translateX(30px); opacity: 0}
            100% {opacity: 0}
           }
        </style>
    </head>
    <body style="margin-top: -19px;">
        <div class="overlay">
            <ul>
              <li class="li1"></li>
              <li class="li2"></li>
              <li class="li3"></li>
              <li class="li4"></li>
              <li class="li5"></li>
              <li class="li6"></li>
            </ul>
        </div>
    </body>
</html>