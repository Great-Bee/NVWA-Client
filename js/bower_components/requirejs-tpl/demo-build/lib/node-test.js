var requirejs=require("requirejs");requirejs.config({nodeRequire:require}),requirejs({paths:{tpl:"../../tpl"}},["tpl!hello.tpl"],function(e){console.log(e({world:"Worrrrrld"}))});