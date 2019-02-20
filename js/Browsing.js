console.log("Browsing.js");
import {DataHelper} from './DataHelper.js';
var Browsing = (function() {
    'use strict';
    
    var callbacks = {};
    
    function send_msg(msg){
        browser.runtime.sendMessage(msg);
    }
    
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
        var failed = false;
        if(data.pattern_type === "regex"){
            var res = requestDetails.url.match(data.url_pattern);
            if(res== null) 
                failed = true;
        }
        if(data.pattern_type === "exact"){
            if(requestDetails.url != data.url_pattern){
                failed = true;
            }
        }
        if(!failed){
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
        browser.runtime.sendMessage({
            type: "browsing",
            data: msg
        });
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
                    let local_data = data;
                    let retval = null;
                    if(!local_data.target_listener || local_data.target_listener == "inspectRequest")
                        retval = inspectRequest_Data(module.name, local_data, x)
                    if(local_data.target_listener == "inspectReferrer")
                        retval = inspectReferrer(module.name,x)
                    if(local_data.target_listener == "inspectVisit")
                        retval = inspectVisit(module.name,x)
                    if(retval != null)
                        send_msg(retval);
                };
                if(!browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                    // default for filter and extraInfo
                    let filter = data.filter?data.filter:module.browsing_filter
                    let extraInfoSpec = data.extraInfoSpec?data.extraInfoSpec:module.browsing_extraInfoSpec
                    browser.webRequest.onBeforeRequest.addListener(callbacks[module.name+ "_" + data.name], filter, extraInfoSpec);
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