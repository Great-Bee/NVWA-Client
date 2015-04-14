/**
 * Adapted from the official plugin text.js
 *
 * Uses UnderscoreJS micro-templates : http://documentcloud.github.com/underscore/#template
 * @author Julien Cabanès <julien@zeeagency.com>
 * @version 0.2
 * 
 * @license RequireJS text 0.24.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */

(function(){define("tpl",[],function(){return function(){}})})(),define("tpl!hello.tpl",function(){return function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments)};with(obj||{})__p.push("<h1>Hello ",world,"</h1>");return __p.join("")}}),require({paths:{tpl:"../../tpl"}},["tpl!hello.tpl"],function(e){console.log("helloTpl",e),document.body.innerHTML+=e({world:"Worrrrrld"})}),define("main",function(){});