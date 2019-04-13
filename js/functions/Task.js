console.log("Task.js");
import {StorageHelper} from '../StorageHelper.js';
import {Utils} from '../Utils.js';
import {DataHandler} from '../DataHandler.js';


var Task = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
		if(browser.tabs.onUpdated.hasListener(registerTaskScripts))
			browser.tabs.onUpdated.removeListener(registerTaskScripts);
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
		if(module.functions.includes("task")){
			for(var item of module.task_matches) {
				cfilter.urls = arrayRemove(cfilter.urls,item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerTaskScripts))
				browser.tabs.onUpdated.removeListener(registerTaskScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerTaskScripts, cfilter);            
		}
    }

    function load_module(module){
		if(module.functions.includes("task")){
			for(var item of module.task_matches) {
				cfilter.urls.push(item);
			}
	        if(browser.tabs.onUpdated.hasListener(registerTaskScripts))
				browser.tabs.onUpdated.removeListener(registerTaskScripts);  
            if(cfilter.urls.length > 0) 			
				browser.tabs.onUpdated.addListener(registerTaskScripts, cfilter);            
		}

    }
	

	function registerTaskScripts(tabId, changeInfo, tabInfo) {
	console.log(tabId, changeInfo, tabInfo);        
	if(changeInfo.status == "loading")
		browser.tabs.executeScript(tabId, {
		  file: "/js/content_scripts/task_script.js",
		  allFrames: false,
		  runAt: "document_end"
		})
    }

	function createTask(info) {
		info.startTime = Date();
		StorageHelper.createTask(info);
	}
	
	async function sendTaskResult(info) {
		let task = await StorageHelper.endTask(info);
		task.endTime = Date();
		task.success = info.success;
		DataHandler.handle({
			origin: info.url,
			header:{
				function: "Task",
				module: info.moduleName,
				collector: info.name                                
			},
			data: {
				out: {
					task: task
				},
				schems: [					
					{jpath: "$.task", type: "text"}
				]
			}
		});
		
	}
	
	function manageTask(info) {
		if(!info.created) {
			
			createTask(info);
		} 
		else {
			sendTaskResult(info);
		}
	}
	
	async function injectTasks(url) {
        var modules = await StorageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("task")){			
					if(modules[module].is_enabled)
						for(var item of modules[module].task_matches) {
							if(Utils.wildcard(url, item)) {
								let tasks = modules[module].task.filter(function(cnt, index, arr){
									return cnt.is_enabled;
								});
                                let startedTasks = await StorageHelper.loadAllModuleTaskIds( modules[module].name);
								return {moduleName: modules[module].name, tasks: tasks, startedTasks: startedTasks};
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
		injectTasks: injectTasks,
		manageTask: manageTask
    };
}());
export {Task};