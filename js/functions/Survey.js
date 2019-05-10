console.log("Survey.js");
import {StorageHelper} from '../StorageHelper.js';
import {Utils} from '../Utils.js';

var Survey = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerSurveyScripts))
			browser.tabs.onUpdated.removeListener(registerSurveyScripts);
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
		if(module.functions.includes("survey")){
			for(var item of module.survey_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerSurveyScripts))
				browser.tabs.onUpdated.removeListener(registerSurveyScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerSurveyScripts);            
		}
    }

    function load_module(module){
		if(module.functions.includes("survey")){
			for(var item of module.survey_matches) {
				cfilter.urls.push(item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerSurveyScripts))
				browser.tabs.onUpdated.removeListener(registerSurveyScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerSurveyScripts);            
		}

    }
	

	function registerSurveyScripts(tabId, changeInfo, tabInfo) {
		let injectScript = false;
		for(let filter of cfilter.urls) {
			if(Utils.wildcard(tabInfo.url, filter)) {
				injectScript = true;
				break;
			}
		}
		if(!injectScript)
			return;
	
		if(changeInfo.status == "loading") {
			
			browser.tabs.executeScript(tabId, {
			  file: "/lib/jquery.js",
			  allFrames: false,
			  runAt: "document_end"
			}).then(result => {
				browser.tabs.executeScript(tabId, {
				  file: "/lib/browser-polyfill.js",
				  allFrames: false,
				  runAt: "document_end"
				}).then(result => {
					browser.tabs.executeScript(tabId, {
					  file: "/lib/survey.jquery.min.js",
					  allFrames: false,
					  runAt: "document_end"
					}).then(result => {
						browser.tabs.executeScript(tabId, {
						  file: "/js/content_scripts/survey_script.js",
						  allFrames: false,
						  runAt: "document_end"
						}).then(result => {
						browser.tabs.insertCSS(tabId, {
						  file: "/survey/css/survey.min.css"
						  })
						})
					})
				})
			})
		}
	}

	async function injectSurvey(url) {
        var modules = await StorageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("survey")){			
				if(modules[module].is_enabled)
					for(var item of modules[module].survey_matches) {
						if(Utils.wildcard(url, item)) {
							let surveys = modules[module].survey.filter(function(ele){
								return ele.is_enabled == true;
							});
							return {moduleName: modules[module].name, surveys: surveys};
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
		injectSurvey: injectSurvey
    };
}());
export {Survey};