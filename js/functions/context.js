import {storageHelper} from '../storageHelper.js';
import {utils} from '../utils.js';
import {dataHandler} from '../dataHandler.js';


var context = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
	function initModule(module){
		
	}
	
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerContextScripts))
			browser.tabs.onUpdated.removeListener(registerContextScripts);
    }

    function load(){        
        storageHelper.retrieveModules().then(modules => {
            for (var module in modules) {				
					loadModule(modules[module]);
            }        
        });
    }
    
    function unloadModule(module){
		function arrayRemove(arr, value) {
		   return arr.filter(function(ele){
			   return ele != value;
		   });
		}
		if(module.functions.includes("context")){
			for(var item of module.contex.context_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContextScripts))
				browser.tabs.onUpdated.removeListener(registerContextScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContextScripts);            
		}
    }

    function loadModule(module){
		if(module.is_enabled){
			if(module.functions.includes("context")){
				for(var item of module.contex.context_matches) {
					cfilter.urls.push(item);
				}
				if(browser.tabs.onUpdated.hasListener(registerContextScripts))
					browser.tabs.onUpdated.removeListener(registerContextScripts);  
				if(cfilter.urls.length > 0) 			
					browser.tabs.onUpdated.addListener(registerContextScripts);            
			}			
		}
    }
	

	function registerContextScripts(tabId, changeInfo, tabInfo) {
		let injectScript = false;
		for(let filter of cfilter.urls) {
			if(utils.wildcard(tabInfo.url, filter)) {
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
        var modules = await storageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("context")){			
					if(modules[module].is_enabled)
						for(var item of modules[module].contex.context_matches) {
							if(utils.wildcard(url, item)) {
								let context = modules[module].context.items.filter(function(cnt, index, arr){
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
		initModule,
        load,
        unload,
        unloadModule,
        loadModule,
		injectAttrCollectors: injectAttrCollectors
    };
}());
export {context};