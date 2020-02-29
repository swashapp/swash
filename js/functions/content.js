console.log("content.js");
import {storageHelper} from '../storageHelper.js';
import {utils} from '../utils.js';
import {dataHandler} from '../dataHandler.js';
import {browserUtils} from '../browserUtils.js'


var content = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
	async function initModule(module){
		if(module.functions.includes("content")) {			
			let info = await browserUtils.getPlatformInfo();
//			let platform = 'mobile';
			let platform = module.content_mapping[info.os];
			if(!platform || typeof platform === "undefined")
				platform = 'desktop';

			module.content = module[platform];
		}
	}
		
	
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerContentScripts))
			browser.tabs.onUpdated.removeListener(registerContentScripts);
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
		if(module.functions.includes("content")){
			for(var item of module.content_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerContentScripts))
				browser.tabs.onUpdated.removeListener(registerContentScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerContentScripts);            
		}
    }

    function loadModule(module){
		if(module.is_enabled){
			if(module.functions.includes("content")){
				for(var item of module.content_matches) {
					cfilter.urls.push(item);
				}
				if(browser.tabs.onUpdated.hasListener(registerContentScripts))
					browser.tabs.onUpdated.removeListener(registerContentScripts);  
				if(cfilter.urls.length > 0) 			
					browser.tabs.onUpdated.addListener(registerContentScripts);            
			}			
		}
    }
	

	function registerContentScripts(tabId, changeInfo, tabInfo) {
		if(changeInfo.status == "loading") {
			let injectScript = false;
			for(let filter of cfilter.urls) {
				if(utils.wildcard(tabInfo.url, filter)) {
					injectScript = true;
					break;
				}
			}
			if(!injectScript)
				return;
			browser.tabs.executeScript(tabId, {
			  file: "/lib/browser-polyfill.js",
			  allFrames: false,
			  runAt: "document_start"
			}).then(result => {
				browser.tabs.executeScript(tabId, {
				  file: "/js/content_scripts/content_script.js",
				  allFrames: false,
				  runAt: "document_start"
				})				
			})
		}
    }

	async function injectCollectors(url) {
        var modules = await storageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("content")){	
				if(modules[module].is_enabled)
					for(var item of modules[module].content_matches) {
						if(utils.wildcard(url, item)) {
							let content = modules[module].content.filter(function(cnt, index, arr){
								return (cnt.is_enabled && utils.wildcard(url, cnt.url_match));
							});
							return {moduleName: modules[module].name, content: content};
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
		injectCollectors
    };
}());
export {content};