console.log("Context.js");
import {StorageHelper} from '../StorageHelper.js';
import {Utils} from '../Utils.js';
import {DataHandler} from '../DataHandler.js';


var Context = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerContextScripts))
			browser.tabs.onUpdated.removeListener(registerContextScripts);
    }

    function load(){        
        StorageHelper.retrieveModules().then(modules => {
            for (var module in modules) {
				if(modules[module].is_enabled)
					load_module(modules[module]);
            }        
        });
    }
    
    function unload_module(module){
		function arrayRemove(arr, value) {
		   return arr.filter(function(ele){
			   return ele != value;
		   });
		}
		if(module.functions.includes("context")){
			for(var item of module.context_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContextScripts))
				browser.tabs.onUpdated.removeListener(registerContextScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContextScripts);            
		}
    }

    function load_module(module){
		if(module.functions.includes("context")){
			for(var item of module.context_matches) {
				cfilter.urls.push(item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContextScripts))
				browser.tabs.onUpdated.removeListener(registerContextScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContextScripts);            
		}

    }
	

	function registerContextScripts(tabId, changeInfo, tabInfo) {
		let injectScript = false;
		for(let filter of cfilter.urls) {
			if(Utils.wildcard(tabInfo.url, filter)) {
				injectScript = true;
				break;
			}
		}
		if(changeInfo.status == "loading")
			browser.tabs.executeScript(tabId, {
			  file: "/lib/browser-polyfill.js",
			  allFrames: false,
			  runAt: "document_start"
			}).then(result => {
				browser.tabs.executeScript(tabId, {
				  file: "/js/content_scripts/context_script.js",
				  allFrames: false,
				  runAt: "document_start"
				})				
			})
    }

	async function injectAttrCollectors(url) {
        var modules = await StorageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("context")){			
					if(modules[module].is_enabled)
						for(var item of modules[module].context_matches) {
							if(Utils.wildcard(url, item)) {
								let context = modules[module].context.filter(function(cnt, index, arr){
									return (cnt.is_enabled && cnt.type=="content");
								});
								return {moduleName: modules[module].name, context: context};
							}							
				}
			}
		}    
		return;	
	}
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module,
		injectAttrCollectors: injectAttrCollectors
    };
}());
export {Context};