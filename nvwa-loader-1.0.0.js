/*
 RequireJS 2.1.8 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
/*
  NVWA Loader is for Greatbee business base on requrirejs. Copyright (c) 2014, Greatbee
  Author: carl@greatbee.com
  See: http://www.greatbee.com
 */
var requirejs,require,define;
(function(Z){function H(b){return"[object Function]"===L.call(b)}function I(b){return"[object Array]"===L.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function M(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));d-=1);}}function s(b,c){return ga.call(b,c)}function l(b,c){return s(b,c)&&b[c]}function F(b,c){for(var d in b)if(s(b,d)&&c(b[d],d))break}function Q(b,c,d,h){c&&F(c,function(c,j){if(d||!s(b,j))h&&"string"!==typeof c?(b[j]||(b[j]={}),Q(b[j],
c,d,h)):b[j]=c});return b}function u(b,c){return function(){return c.apply(b,arguments)}}function aa(b){throw b;}function ba(b){if(!b)return b;var c=Z;y(b.split("."),function(b){c=c[b]});return c}function A(b,c,d,h){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=h;d&&(c.originalError=d);return c}function ha(b){function c(a,f,b){var e,m,c,g,d,h,j,i=f&&f.split("/");e=i;var n=k.map,p=n&&n["*"];if(a&&"."===a.charAt(0))if(f){e=l(k.pkgs,f)?i=[f]:i.slice(0,i.length-
1);f=a=e.concat(a.split("/"));for(e=0;f[e];e+=1)if(m=f[e],"."===m)f.splice(e,1),e-=1;else if(".."===m)if(1===e&&(".."===f[2]||".."===f[0]))break;else 0<e&&(f.splice(e-1,2),e-=2);e=l(k.pkgs,f=a[0]);a=a.join("/");e&&a===f+"/"+e.main&&(a=f)}else 0===a.indexOf("./")&&(a=a.substring(2));if(b&&n&&(i||p)){f=a.split("/");for(e=f.length;0<e;e-=1){c=f.slice(0,e).join("/");if(i)for(m=i.length;0<m;m-=1)if(b=l(n,i.slice(0,m).join("/")))if(b=l(b,c)){g=b;d=e;break}if(g)break;!h&&(p&&l(p,c))&&(h=l(p,c),j=e)}!g&&
h&&(g=h,d=j);g&&(f.splice(0,d,g),a=f.join("/"))}return a}function d(a){z&&y(document.getElementsByTagName("script"),function(f){if(f.getAttribute("data-requiremodule")===a&&f.getAttribute("data-requirecontext")===i.contextName)return f.parentNode.removeChild(f),!0})}function h(a){var f=l(k.paths,a);if(f&&I(f)&&1<f.length)return d(a),f.shift(),i.require.undef(a),i.require([a]),!0}function $(a){var f,b=a?a.indexOf("!"):-1;-1<b&&(f=a.substring(0,b),a=a.substring(b+1,a.length));return[f,a]}function n(a,
f,b,e){var m,B,g=null,d=f?f.name:null,h=a,j=!0,k="";a||(j=!1,a="_@r"+(L+=1));a=$(a);g=a[0];a=a[1];g&&(g=c(g,d,e),B=l(r,g));a&&(g?k=B&&B.normalize?B.normalize(a,function(a){return c(a,d,e)}):c(a,d,e):(k=c(a,d,e),a=$(k),g=a[0],k=a[1],b=!0,m=i.nameToUrl(k)));b=g&&!B&&!b?"_unnormalized"+(M+=1):"";return{prefix:g,name:k,parentMap:f,unnormalized:!!b,url:m,originalName:h,isDefine:j,id:(g?g+"!"+k:k)+b}}function q(a){var f=a.id,b=l(p,f);b||(b=p[f]=new i.Module(a));return b}function t(a,f,b){var e=a.id,m=l(p,
e);if(s(r,e)&&(!m||m.defineEmitComplete))"defined"===f&&b(r[e]);else if(m=q(a),m.error&&"error"===f)b(m.error);else m.on(f,b)}function v(a,f){var b=a.requireModules,e=!1;if(f)f(a);else if(y(b,function(f){if(f=l(p,f))f.error=a,f.events.error&&(e=!0,f.emit("error",a))}),!e)j.onError(a)}function w(){R.length&&(ia.apply(G,[G.length-1,0].concat(R)),R=[])}function x(a){delete p[a];delete T[a]}function E(a,f,b){var e=a.map.id;a.error?a.emit("error",a.error):(f[e]=!0,y(a.depMaps,function(e,c){var g=e.id,
d=l(p,g);d&&(!a.depMatched[c]&&!b[g])&&(l(f,g)?(a.defineDep(c,r[g]),a.check()):E(d,f,b))}),b[e]=!0)}function C(){var a,f,b,e,m=(b=1E3*k.waitSeconds)&&i.startTime+b<(new Date).getTime(),c=[],g=[],j=!1,l=!0;if(!U){U=!0;F(T,function(b){a=b.map;f=a.id;if(b.enabled&&(a.isDefine||g.push(b),!b.error))if(!b.inited&&m)h(f)?j=e=!0:(c.push(f),d(f));else if(!b.inited&&(b.fetched&&a.isDefine)&&(j=!0,!a.prefix))return l=!1});if(m&&c.length)return b=A("timeout","Load timeout for modules: "+c,null,c),b.contextName=
i.contextName,v(b);l&&y(g,function(a){E(a,{},{})});if((!m||e)&&j)if((z||da)&&!V)V=setTimeout(function(){V=0;C()},50);U=!1}}function D(a){s(r,a[0])||q(n(a[0],null,!0)).init(a[1],a[2])}function J(a){var a=a.currentTarget||a.srcElement,b=i.onScriptLoad;a.detachEvent&&!W?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=i.onScriptError;(!a.detachEvent||W)&&a.removeEventListener("error",b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function K(){var a;for(w();G.length;){a=
G.shift();if(null===a[0])return v(A("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));D(a)}}var U,X,i,N,V,k={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{},config:{}},p={},T={},Y={},G=[],r={},S={},L=1,M=1;N={require:function(a){return a.require?a.require:a.require=i.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?a.exports:a.exports=r[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){var b=
l(k.pkgs,a.map.id);return(b?l(k.config,a.map.id+"/"+b.main):l(k.config,a.map.id))||{}},exports:r[a.map.id]}}};X=function(a){this.events=l(Y,a.id)||{};this.map=a;this.shim=l(k.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};X.prototype={init:function(a,b,c,e){e=e||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&(c=u(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;
this.ignore=e.ignore;e.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;i.startTime=(new Date).getTime();var a=this.map;if(this.shim)i.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],u(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=
this.map.url;S[a]||(S[a]=!0,i.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var e=this.exports,m=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(H(m)){if(this.events.error&&this.map.isDefine||j.onError!==aa)try{e=i.execCb(c,m,b,e)}catch(d){a=d}else e=i.execCb(c,m,b,e);this.map.isDefine&&((b=this.module)&&void 0!==b.exports&&b.exports!==
this.exports?e=b.exports:void 0===e&&this.usingExports&&(e=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",v(this.error=a)}else e=m;this.exports=e;if(this.map.isDefine&&!this.ignore&&(r[c]=e,j.onResourceLoad))j.onResourceLoad(i,this.map,this.depMaps);x(c);this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=
!0)}}else this.fetch()}},callPlugin:function(){var a=this.map,b=a.id,d=n(a.prefix);this.depMaps.push(d);t(d,"defined",u(this,function(e){var m,d;d=this.map.name;var g=this.map.parentMap?this.map.parentMap.name:null,h=i.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(e.normalize&&(d=e.normalize(d,function(a){return c(a,g,!0)})||""),e=n(a.prefix+"!"+d,this.map.parentMap),t(e,"defined",u(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),
d=l(p,e.id)){this.depMaps.push(e);if(this.events.error)d.on("error",u(this,function(a){this.emit("error",a)}));d.enable()}}else m=u(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),m.error=u(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];F(p,function(a){0===a.map.id.indexOf(b+"_unnormalized")&&x(a.map.id)});v(a)}),m.fromText=u(this,function(e,c){var d=a.name,g=n(d),B=O;c&&(e=c);B&&(O=!1);q(g);s(k.config,b)&&(k.config[d]=k.config[b]);try{j.exec(e)}catch(ca){return v(A("fromtexteval",
"fromText eval for "+b+" failed: "+ca,ca,[b]))}B&&(O=!0);this.depMaps.push(g);i.completeLoad(d);h([d],m)}),e.load(a.name,h,m,k)}));i.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){T[this.map.id]=this;this.enabling=this.enabled=!0;y(this.depMaps,u(this,function(a,b){var c,e;if("string"===typeof a){a=n(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=l(N,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;t(a,"defined",u(this,function(a){this.defineDep(b,
a);this.check()}));this.errback&&t(a,"error",u(this,this.errback))}c=a.id;e=p[c];!s(N,c)&&(e&&!e.enabled)&&i.enable(a,this)}));F(this.pluginMaps,u(this,function(a){var b=l(p,a.id);b&&!b.enabled&&i.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};i={config:k,contextName:b,registry:p,defined:r,urlFetched:S,defQueue:G,Module:X,makeModuleMap:n,
nextTick:j.nextTick,onError:v,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");var b=k.pkgs,c=k.shim,e={paths:!0,config:!0,map:!0};F(a,function(a,b){e[b]?"map"===b?(k.map||(k.map={}),Q(k[b],a,!0,!0)):Q(k[b],a,!0):k[b]=a});a.shim&&(F(a.shim,function(a,b){I(a)&&(a={deps:a});if((a.exports||a.init)&&!a.exportsFn)a.exportsFn=i.makeShimExports(a);c[b]=a}),k.shim=c);a.packages&&(y(a.packages,function(a){a="string"===typeof a?{name:a}:a;b[a.name]={name:a.name,
location:a.location||a.name,main:(a.main||"main").replace(ja,"").replace(ea,"")}}),k.pkgs=b);F(p,function(a,b){!a.inited&&!a.map.unnormalized&&(a.map=n(b))});if(a.deps||a.callback)i.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(Z,arguments));return b||a.exports&&ba(a.exports)}},makeRequire:function(a,f){function d(e,c,h){var g,k;f.enableBuildCallback&&(c&&H(c))&&(c.__requireJsBuild=!0);if("string"===typeof e){if(H(c))return v(A("requireargs",
"Invalid require call"),h);if(a&&s(N,e))return N[e](p[a.id]);if(j.get)return j.get(i,e,a,d);g=n(e,a,!1,!0);g=g.id;return!s(r,g)?v(A("notloaded",'Module name "'+g+'" has not been loaded yet for context: '+b+(a?"":". Use require([])"))):r[g]}K();i.nextTick(function(){K();k=q(n(null,a));k.skipMap=f.skipMap;k.init(e,c,h,{enabled:!0});C()});return d}f=f||{};Q(d,{isBrowser:z,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];if(-1!==f&&(!("."===g||".."===g)||1<f))d=b.substring(f,b.length),b=
b.substring(0,f);return i.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return s(r,n(b,a,!1,!0).id)},specified:function(b){b=n(b,a,!1,!0).id;return s(r,b)||s(p,b)}});a||(d.undef=function(b){w();var c=n(b,a,!0),f=l(p,b);delete r[b];delete S[c.url];delete Y[b];f&&(f.events.defined&&(Y[b]=f.events),x(b))});return d},enable:function(a){l(p,a.id)&&q(a).enable()},completeLoad:function(a){var b,c,e=l(k.shim,a)||{},d=e.exports;for(w();G.length;){c=G.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===
a&&(b=!0);D(c)}c=l(p,a);if(!b&&!s(r,a)&&c&&!c.inited){if(k.enforceDefine&&(!d||!ba(d)))return h(a)?void 0:v(A("nodefine","No define call for "+a,null,[a]));D([a,e.deps||[],e.exportsFn])}C()},nameToUrl:function(a,b,c){var e,d,h,g,i,n;if(j.jsExtRegExp.test(a))g=a+(b||"");else{e=k.paths;d=k.pkgs;g=a.split("/");for(i=g.length;0<i;i-=1)if(n=g.slice(0,i).join("/"),h=l(d,n),n=l(e,n)){I(n)&&(n=n[0]);g.splice(0,i,n);break}else if(h){a=a===h.name?h.location+"/"+h.main:h.location;g.splice(0,i,a);break}g=g.join("/");
g+=b||(/\?/.test(g)||c?"":".js");g=("/"===g.charAt(0)||g.match(/^[\w\+\.\-]+:/)?"":k.baseUrl)+g}return k.urlArgs?g+((-1===g.indexOf("?")?"?":"&")+k.urlArgs):g},load:function(a,b){j.load(i,a,b)},execCb:function(a,b,c,e){return b.apply(e,c)},onScriptLoad:function(a){if("load"===a.type||ka.test((a.currentTarget||a.srcElement).readyState))P=null,a=J(a),i.completeLoad(a.id)},onScriptError:function(a){var b=J(a);if(!h(b.id))return v(A("scripterror","Script error for: "+b.id,a,[b.id]))}};i.require=i.makeRequire();
return i}var j,w,x,C,J,D,P,K,q,fa,la=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ma=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ja=/^\.\//;w=Object.prototype;var L=w.toString,ga=w.hasOwnProperty,ia=Array.prototype.splice,z=!!("undefined"!==typeof window&&navigator&&window.document),da=!z&&"undefined"!==typeof importScripts,ka=z&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,W="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),E={},t={},R=[],O=
!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(H(requirejs))return;t=requirejs;requirejs=void 0}"undefined"!==typeof require&&!H(require)&&(t=require,require=void 0);j=requirejs=function(b,c,d,h){var q,n="_";!I(b)&&"string"!==typeof b&&(q=b,I(c)?(b=c,c=d,d=h):b=[]);q&&q.context&&(n=q.context);(h=l(E,n))||(h=E[n]=j.s.newContext(n));q&&h.configure(q);return h.require(b,c,d)};j.config=function(b){return j(b)};j.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,
4)}:function(b){b()};require||(require=j);j.version="2.1.8";j.jsExtRegExp=/^\/|:|\?|\.js$/;j.isBrowser=z;w=j.s={contexts:E,newContext:ha};j({});y(["toUrl","undef","defined","specified"],function(b){j[b]=function(){var c=E._;return c.require[b].apply(c,arguments)}});if(z&&(x=w.head=document.getElementsByTagName("head")[0],C=document.getElementsByTagName("base")[0]))x=w.head=C.parentNode;j.onError=aa;j.createNode=function(b){var c=b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):
document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};j.load=function(b,c,d){var h=b&&b.config||{};if(z)return h=j.createNode(h,c,d),h.setAttribute("data-requirecontext",b.contextName),h.setAttribute("data-requiremodule",c),h.attachEvent&&!(h.attachEvent.toString&&0>h.attachEvent.toString().indexOf("[native code"))&&!W?(O=!0,h.attachEvent("onreadystatechange",b.onScriptLoad)):(h.addEventListener("load",b.onScriptLoad,!1),h.addEventListener("error",
b.onScriptError,!1)),h.src=d,K=h,C?x.insertBefore(h,C):x.appendChild(h),K=null,h;if(da)try{importScripts(d),b.completeLoad(c)}catch(l){b.onError(A("importscripts","importScripts failed for "+c+" at "+d,l,[c]))}};z&&M(document.getElementsByTagName("script"),function(b){x||(x=b.parentNode);if(J=b.getAttribute("data-main"))return q=J,t.baseUrl||(D=q.split("/"),q=D.pop(),fa=D.length?D.join("/")+"/":"./",t.baseUrl=fa),q=q.replace(ea,""),j.jsExtRegExp.test(q)&&(q=J),t.deps=t.deps?t.deps.concat(q):[q],!0});
define=function(b,c,d){var h,j;"string"!==typeof b&&(d=c,c=b,b=null);I(c)||(d=c,c=null);!c&&H(d)&&(c=[],d.length&&(d.toString().replace(la,"").replace(ma,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));if(O){if(!(h=K))P&&"interactive"===P.readyState||M(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return P=b}),h=P;h&&(b||(b=h.getAttribute("data-requiremodule")),j=E[h.getAttribute("data-requirecontext")])}(j?j.defQueue:
R).push([b,c,d])};define.amd={jQuery:!0};j.exec=function(b){return eval(b)};j(t)}})(this);
/*! tpl.js 0.3.1, github.com/niceue/tpl.js */
!function(n){function t(n,t){var i=e(n);return t?i(t):i}function e(n){n=n||"","#"===n.charAt(0)&&(n=document.getElementById(n.substring(1)).innerHTML);for(var e,i,r,_=function(n){return n.trim?n.trim():n.replace(/^\s*|\s*$/g,"")},u=function(n){return n.replace(/('|\\|\r?\n)/g,"\\$1")},f=t.begin,s=t.end,c=t.variable,d=c||"$",o="var "+d+"="+d+"||this,__='',___,                echo=function(s){__+=s},                include=function(t,d){__+=tpl(t).call(d||"+d+")};"+(c?"":"with($||{}){"),g=f.length,l=s.length,a=n.indexOf(f);-1!=a&&(e=i?a+g:n.indexOf(s),!(a>e));)o+="__+='"+u(n.substring(0,a))+"';",i?(n=n.substring(g+l+1),i--):(r=_(n.substring(a+g,e)),"#"===r?i=1:0===r.indexOf("=")?(r=r.substring(1),o+="___="+r+";typeof ___!=='undefined'&&(__+=___);"):o+="\n"+r+"\n"),n=n.substring(e+l),a=n.indexOf(f+(i?"#"+s:""));return o+="__+='"+u(n)+"'"+(c?";":"}")+"return __",new Function(d,o)}t.begin="<#",t.end="#>",n.tpl=t,"function"==typeof define&&define("tpl",[],function(){return t})}(this);


var $nvwa = {
  version : "1.0.0"
};

//定义全局loader
var loaderEle = null;
var scriptList = document.getElementsByTagName('script') || [];
var scriptNum = scriptList.length;
for (var i = 0; i < scriptNum; i++) {
    var tmpScript = scriptList[i];
    var src = tmpScript.src;
    if (src.indexOf("nvwa-loader") >= 0) {
        loaderEle = tmpScript;
    }
}
var staticDomain = loaderEle.src;
staticDomain = staticDomain.substr(0,staticDomain.indexOf('nvwa-loader'));
window._staticDomain = staticDomain;

window._loader = loaderEle;

//预加载列表
var preLoadList = [];

//加载语言包
var lang = loaderEle.getAttribute('lang') || 'zh_CN';
window._lang = lang;

//配置预加载
var preload = loaderEle.getAttribute('preload');
if (preload && preload.length > 0) {
    var _list = preload.split(',');
    var num = _list.length;
    for (var i = 0; i < num; i++) {
        preLoadList.push(_list[i]);
    }
}

//定义全局的Debug模式
window._debug = loaderEle.getAttribute("debug") == "true";
window._log = function(log){
  if(window._debug && console){
    console.log(log);
  }
}

//读取API配置，如果没有，则默认是当前浏览器地址的Domain
var api = loaderEle.getAttribute("api");
if (api) {
    window._api = api;
}

//JSON is allowed
var jsonp = loaderEle.getAttribute("jsonp");
if (jsonp) {
    window._jsonp = (jsonp == 'true');
}

// global config, import all data-* as _config
if(loaderEle.dataset){
    window._config = loaderEle.dataset;
}
else{
    // below ie 11
    window._config = {};
    (function(){
        var attributes = loaderEle.attributes,
            toUpperCase = function (n0) {
                return n0.charAt(1).toUpperCase();
            },
            attribute, attrVal, attrName, propName;
        for(var i=0;i<attributes.length;i++){
            attribute = attributes[i];
            if (attribute && attribute.name &&
                    (/^data-\w[\w\-]*$/).test(attribute.name)) {
                attrVal = attribute.value;
                attrName = attribute.name;
                // Change to CamelCase
                propName = attrName.substr(5).replace(/-./g, toUpperCase);
                window._config[propName] = attrVal;
            }
        }
    })();
}

//获取皮肤设置
var skin = loaderEle.getAttribute("skin");
if (skin && skin.length > 0) {
    window._skin = skin;
}

//NVWA API
var nvwaAPI = window._loader.getAttribute('nvwa-api');
var baseUrl=staticDomain+window._loader.getAttribute('baseUrl')||staticDomain + 'js';
if(!nvwaAPI){
    nvwaAPI = document.location.origin;
}
window._nvwaAPI = nvwaAPI;

requirejs.config({
    baseUrl: baseUrl,
    paths: {
        //Path
        // lib: 'lib',
        // plugin: 'plugin',
        // compressed: 'compressed',
        // achilles: '..',

        // business: bizBase,

        'js':'../js',
        'build':'../../build',
		'text': "bower_components/text",
        //achy
        // 'achy': 'bower_components/achy/achy',
        'yestrap': '../css/yestrap',
        'yestrap_light': '../css/yestrap_light',
        'main': '../css/main',
        

        bootstrap: 'bower_components/bootstrap/dist',
        bootstrapjs: 'bower_components/bootstrap/dist/js/bootstra.min',
        jquery: 'bower_components/jquery/dist/jquery.min',
        backbone: 'bower_components/backbone/backbone',
        lodash: 'bower_components/lodash/dist/lodash.min',

        // underscore: 'lib/lodash.underscore.min',
        // jqueryui: 'lib/jquery.ui-1.10.3.min',
        // d3: 'lib/d3/d3.min',
        // angular: 'lib/angular.min',

        'marionette': 'bower_components/marionette/lib/core/backbone.marionette',
        'backbone.wreqr':  'bower_components/backbone.wreqr/lib/backbone.wreqr',
        'backbone.babysitter':  'bower_components/backbone.babysitter/lib/backbone.babysitter',
        'bootstrap-combobox':  'bower_components/bootstrap-combobox/js/bootstrap-combobox',
        'bootstrap-input-combobox':  'bower_components/bootstrap-input-combobox/js/combobox',
        'bootstrap-select':  'bower_components/bootstrap-select/js/bootstrap-select',
        'bootstrap-checkbox':  'bower_components/bootstrap-checkbox/js/bootstrap-checkbox',
        'radio':  'bower_components/iCheck/icheck.min',
        'datetimepicker': "bower_components/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min",
        'datetimepicker_lang':"bower_components/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN",
        'tags_input':"bower_components/bootstrap-tagsinput/build/bootstrap-tagsinput.min",
        'datatables':'bower_components/datatables/media/js/jquery.dataTables.min',
        'highcharts': 'bower_components/Highcharts/js/highcharts',
        'nvwaAPI': window._nvwaAPI,
        'nvwaScripts': window._nvwaAPI + '/nvwa/script'

        //Plugin
        // text: "plugin/text",
        // tpl: 'plugin/tpl',
        // css: 'plugin/css',
        // caret: 'plugin/jquery.caret',
        // atwho: 'plugin/jquery.atwho',
        // mustache: 'plugin/mustache',
        // amcharts: 'plugin/amcharts',
        // atmosphere: "plugin/atmosphere-2.0",
        // percent: "plugin/percent/percent",
        // autocomplete: "plugin/jquery-ui-autocomplete/js/jquery-ui-1.10.3.custom.min",
        // dragdrop: "plugin/jquery-ui-autocomplete/js/jquery-ui-1.10.3.custom.min",
        // timepicker: "plugin/bootstrap-timepicker.min",
        // tagit: 'plugin/tag-it.min',

        // ueditor_config: 'plugin/ueditor/ueditor.config',
        // ueditor_lang: 'plugin/ueditor/lang/zh-cn/zh-cn',
        // ueditor: 'plugin/ueditor/ueditor.all.min',
        // peity: 'plugin/jquery.peity',
        // datatables: 'plugin/jquery.dataTables.min',
        // datatables_scroller: 'plugin/dataTables.scroller.min',
        // 'datatables-fixedheader': 'plugin/dataTables.fixedHeader.min',
        // qtip: 'plugin/jquery.qtip.min',
        // uiRouter: 'plugin/angular-ui-router.min',

        //Code Editor
        // codemirror:'plugin/codemirror-4.1/codemirror',
        // jseditor:'plugin/codemirror-4.1/javascript',

        // i18n: 'compressed/i18n/'
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
		//	deps: ['jquery'],
            exports: 'Backbone'
        },
        // 'underscore': {
        //     exports: '_'
        // },
        'mustache': {
            exports: 'Mustache'
        },
        'atwho': {
            deps: ['jquery', 'caret']
        },
        'highcharts_exporting': {
            deps: ['highcharts']
        },
        'autocomplete': {
            deps: ['jquery']
        },
        'dragdrop': {
            deps: ['jquery']
        },
        'peity': {
            deps: ['jquery']
        },
        'tagit':{
            deps: ['autocomplete']
        },
        'ueditor_config': {

        },
        'ueditor':{
            deps: ['ueditor_config'],
            exports: 'UE'
        },
        // 'datatables_scroller': {
        //     deps: ['datatables']
        // },
        'uiRouter': {
            deps: ['angular']
        },
        'bootstrapjs': {
            deps: ['jquery']
        },
        'codemirror':{
            exports: 'CodeMirror'
        },
        'jseditor': {
            deps: ['codemirror']
        },
        'datetimepicker_lang':{
            deps: ['datetimepicker']
        }
    },
    config: {
        text: {
            useXhr: function(url, protocol, hostname, port) {
                return true;
            }
        }
    }
});

//默认加载preLoadList
requirejs(preLoadList, function() {
    if(window.$){
        $.ajaxPrefilter(function(opt, originalOpts, xhr){
            xhr.then(function(data){
                if(data.code && data.code === -407){
                    location.reload();
                }
            });
        });
    }

    var index = loaderEle.getAttribute("index") || "index";
    //加载业务
    requirejs([index], function(bizHandler) {
        if (bizHandler) {
            bizHandler.init();
        }
    });
});
