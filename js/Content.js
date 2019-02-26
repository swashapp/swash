console.log("Content.js");
import {StorageHelper} from './StorageHelper.js';
import {Utils} from './Utils.js';
import {DataHandler} from './DataHandler.js';

var Content = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerContentScripts))
			browser.tabs.onUpdated.removeListener(registerContentScripts);
		if(browser.tabs.onUpdated.hasListener(changeIconOnUpdated))
			browser.tabs.onUpdated.removeListener(changeIconOnUpdated);
    }

    function load(){        
        StorageHelper.retrieveModules().then(modules => {
            for (var module in modules) {
				if(modules[module].is_enabled)
					load_module(modules[module]);
            }        
        });
        browser.tabs.onUpdated.addListener(changeIconOnUpdated);
        //browser.tabs.onActivated.addListener(changeIconOnActivated);
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
	
	    function changeIconOnUpdated(tabId, changeInfo, tabInfo) {    
        StorageHelper.retrieveFilters().then(filters => {
            if(!filterUtils.filter(tabInfo.url, filters))
                browser.browserAction.setIcon({path: "icons/surf19g.png"});
            else 
                browser.browserAction.setIcon({path: "icons/surf19.png"});
        });
    }
/*    
    function changeIconOnActivated(activeInfo) {
        StorageHelper.retrieveFilters().then(filters => {
            browser.tabs.get(activeInfo.tabId).then(tabInfo => {
                if(filterUtils.filter(tabInfo.url, filters) == "")
                    browser.browserAction.setIcon({path: "icons/surf19g.png"});
                else 
                    browser.browserAction.setIcon({path: "icons/surf19.png"});                
            })
        });
    }
*/

	function registerContentScripts(tabId, changeInfo, tabInfo) {
	console.log(tabId, changeInfo, tabInfo);        
	if(changeInfo.status == "loading")
		browser.tabs.executeScript(tabId, {
		  file: "/js/content_script.js",
		  allFrames: false,
		  runAt: "document_end"
		})
    }

    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());
export {Content};