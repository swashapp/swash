console.log("Content.js");
import {StorageHelper} from './StorageHelper.js';
import {Utils} from './Utils.js';
import {DataHandler} from './DataHandler.js';
import {filterUtils} from './filterUtils.js';

var Content = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerContentScripts))
			browser.tabs.onUpdated.removeListener(registerContentScripts);
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
		if(module.functions.includes("content")){
			for(var item of module.content_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContentScripts))
				browser.tabs.onUpdated.removeListener(registerContentScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContentScripts, cfilter);            
		}
    }

    function load_module(module){
		if(module.functions.includes("content")){
			for(var item of module.content_matches) {
				cfilter.urls.push(item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContentScripts))
				browser.tabs.onUpdated.removeListener(registerContentScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContentScripts, cfilter);            
		}

    }
	

	function registerContentScripts(tabId, changeInfo, tabInfo) {
	console.log(tabId, changeInfo, tabInfo);        
	if(changeInfo.status == "loading")
		browser.tabs.executeScript(tabId, {
		  file: "/js/content_script.js",
		  allFrames: false,
		  runAt: "document_end"
		})
    }

	async function injectCollectors(url) {
        var modules = await StorageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("content")){			
					if(modules[module].is_enabled)
						for(var item of modules[module].content_matches) {
							if(Utils.wildcard(url, item)) {
								return {moduleName: modules[module].name, content: modules[module].content};
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
		injectCollectors: injectCollectors
    };
}());
export {Content};