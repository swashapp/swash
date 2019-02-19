console.log("Browsing.js");
import {DataHelper} from './DataHelper.js';
var Browsing = (function() {
    'use strict';
    
    var callbacks = {};
    
    function inspectReferrer(moduleName,requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;
        console.log(requestDetails.url, requestDetails.originUrl);

        return { 
            url: requestDetails.url,
            originUrl: requestDetails.originUrl		
        };
    }

    function inspectVisit(moduleName,requestDetails) {
        //console.log(`inspectRequest: ${config.name} `, requestDetails);
        console.log(requestDetails.url)
        if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
            return;		
        return { 
            url: requestDetails.url
        };
    }
    
    function inspectRequest_Data(moduleName, data, requestDetails) {
        console.log("inspectRequest_Data", requestDetails.url, data.name);
        if(requestDetails.method != data.method){
            return;
        }
        if(data.pattern_type === "exact"){
            if(requestDetails.url == data.url_pattern){
                var retval = {};
                data.param.forEach(p => {
                    var val = null;
                    if(p.type === "form"){
                        val = requestDetails.requestBody.formData[data.key]
                    }
                    if(p.type === "query"){
                        val = (new URL(requestDetails.url)).searchParams.get(data.key)
                    }
                    retval[data.name] = val?val:data.default
                });
                return retval;
            }
        }
        if(data.pattern_type === "regex"){
            var res = requestDetails.url.match(data.url_pattern);
            if(res!= null) {
                var retval = {};
                data.param.forEach(p => {
                    var val = null;
                    if(p.type === "regex"){
                        val = res[data.group]
                    }
                    if(p.type === "form"){
                        val = requestDetails.requestBody.formData[data.key]
                    }
                    if(p.type === "query"){
                        val = (new URL(requestDetails.url)).searchParams.get(data.key)
                    }
                    if(val){
                        retval[data.name] = val
                    }else{
                        if(data.default){
                            retval[data.name] = data.default
                        }
                    }
                    
                });
                return retval;
            }
        }
        return;
    }
    
    function unload(){        
        DataHelper.retrieveModules().then(modules => {for(var module in modules){
            unload_module(modules[module]);
        }});
    }

    function load(){
        DataHelper.retrieveModules().then(modules => {for(var module in modules) {
            load_module(modules[module]);
        }});
    }
    
    function send_msg(msg){
        browser.runtime.sendMessage(msg);
    }
    
    function unload_module(module){
        if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{    
                if(browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                    browser.webRequest.onBeforeRequest.removeListener(callbacks[module.name+ "_" + data.name]);
                }
            });
        }
    }

    function load_module(module){
        if(module.functions.includes("browsing")){
            module.browsing.forEach(data=>{   
                callbacks[module.name + "_" + data.name] = function(x){
                    if(!data.target_listener && data.target_listener == "inspectRequest")
                        inspectRequest_data(module.name, data, x)
                    if(data.target_listener == "inspectReferrer")
                        inspectReferrer(module.name,x)
                    if(data.target_listener == "inspectVisit")
                        inspectVisit(module.name,x)
                };
                if(!browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                    browser.webRequest.onBeforeRequest.addListener(callbacks[module.name+ "_" + data.name],data.filter, data.extraInfoSpec);
                }
            });
        }
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());
export {Browsing};