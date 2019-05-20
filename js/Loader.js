console.log("Loader.js");
import {StorageHelper} from './StorageHelper.js';
import {DatabaseHelper} from './DatabaseHelper.js';
import {DataHandler} from './DataHandler.js';
import {Browsing} from './functions/Browsing.js';
import {Content} from './functions/Content.js';
import {ApiCall} from './functions/ApiCall.js';
import {Survey} from './functions/Survey.js';
import {Context} from './functions/Context.js';
import {Devtools} from './functions/Devtools.js';
import {Task} from './functions/Task.js';
import {Utils} from './Utils.js';
import {filterUtils} from './filterUtils.js';
import {ssConfig} from './manifest.js';
var Loader = (function() {
    'use strict';
    var dbHelperInterval;
    function install(allModules){		
        return StorageHelper.retrieveAll().then(db => {
            if (db == null || db == undefined || Object.keys(db).length==0){
                db = {modules: {}, configs: {}, profile: {}, filters: [], privacyData: [], tasks: {}};                
                db.configs.Id = Utils.uuid();
                db.configs.salt = Utils.uuid();
				db.configs.delay = 1;
            }
            try{
				Utils.jsonUpdate(db.configs, ssConfig);
                allModules.forEach(module=>{            
					if(!db.modules[module.name])
                    {
						db.modules[module.name] = {};
                        module.mId = Utils.uuid();
                        module.mSalt = Utils.uuid();
                    }
                    if(module.functions.includes("apiCall"))
					{
						module.apiConfig.redirect_url = ApiCall.getCallBackURL(module.name)
					}
					
                    Utils.jsonUpdate(db.modules[module.name], module);                
                });
            }
            catch(exp){
                console.log(exp);
            }
            //TODO: prefrences: apply previous user configuration
            // Utils.jsonUpdate(db.modules, db.prefrence);
           return StorageHelper.storeAll(db);
           
        });
        
    }
	
	function changeIconOnUpdated(tabId, changeInfo, tabInfo) {    
		StorageHelper.retrieveConfigs().then(configs => { if(configs.is_enabled) {
			StorageHelper.retrieveFilters().then(filters => {
					if(filterUtils.filter(tabInfo.url, filters))
						browser.browserAction.setIcon({path: "icons/surf19g.png"});
					else 
						browser.browserAction.setIcon({path: "icons/surf19.png"});
				});		
			}			
		})
    }


    function init(isEnabled) {
		if(isEnabled) {
			browser.tabs.onUpdated.addListener(changeIconOnUpdated);
			browser.browserAction.setIcon({path: "icons/surf19.png"});			
		}
		else {
			if(browser.tabs.onUpdated.hasListener(changeIconOnUpdated))		
				browser.tabs.onUpdated.removeListener(changeIconOnUpdated);
			browser.browserAction.setIcon({path: "icons/surf19g.png"});					
		}			
	}

	
    function start(){		
		browser.storage.local.get("configs").then(c => {
			c.configs.is_enabled = true;
			browser.storage.local.set(c);
			init(true);
			Content.load();
			Browsing.load();
			ApiCall.load();	
			Survey.load();
			Context.load();
			Devtools.load();
			Task.load();
		})	
    }
    

    function stop(){
		browser.storage.local.get("configs").then(c => {
			c.configs.is_enabled = false;
			browser.storage.local.set(c).then(() => {
				init(false);
				Content.unload();
				Browsing.unload();
				ApiCall.unload();
				Survey.unload();
				Context.unload();
				Devtools.unload();
				Task.unload();				
			})		
		})
    }

	function restart() {
		stop();
		start();
    }
    
    function load_module(module) {
		Content.load_module(module);
		Browsing.load_module(module);
		ApiCall.load_module(module);
		Survey.load_module(module);
		Context.load_module(module);
		Devtools.load_module(module);
		Task.load_module(module);
	}
	
    function unload_module(module) {
		Content.unload_module(module);
		Browsing.unload_module(module);
		ApiCall.unload_module(module);
		Survey.unload_module(module);
		Context.unload_module(module);
		Devtools.unload_module(module);
		Task.unload_module(module);
	}
	
	function load() {		
		browser.storage.local.get("configs").then(c => {
			dbHelperInterval = setInterval(function(){
				DatabaseHelper.init();
				DataHandler.sendDelayedMessages();
				}, 10000);
			if(c.configs.is_enabled) {
				init(true);
				Content.load();
				Browsing.load();
				ApiCall.load();
				Survey.load();
				Context.load();
				Devtools.load();
				Task.load();
			} 
			else {
				init(false);
				Content.unload();
				Browsing.unload();
				ApiCall.unload();								
				Survey.unload();
				Context.unload();
				Devtools.unload();
				Task.unload();
			}			
		})		
	}
	
	function reload() {		
		browser.storage.local.get("configs").then(c => {
            clearInterval(dbHelperInterval);
			dbHelperInterval = setInterval(function(){
				DatabaseHelper.init();
				DataHandler.sendDelayedMessages();
				}, 10000);
			init(false);
			Content.unload();
			Browsing.unload();
			ApiCall.unload();								
			Survey.unload();
			Context.unload();
			Devtools.unload();
			Task.unload();
			if(c.configs.is_enabled) {
				init(true);
				Content.load();
				Browsing.load();
				ApiCall.load();
				Survey.load();
				Context.load();
				Devtools.load();
				Task.load();
			}					
		})		
	}
	
	function config_module(moduleName, settings) {
		return StorageHelper.saveModuleSettings(moduleName, settings).then(x => {
			StorageHelper.retrieveModules().then(modules => {
				let module = modules[moduleName];
				unload_module(module);
				if(settings.is_enabled)
					load_module(module);								
			});
		});
	}
    function register(module){
        var data = {modules: {}}
        data.modules[module.name] = module
        data.modules[module.name].mId = Utils.generateUUID();
        StorageHelper.updateModules(data);
    }
    
    function unregister(module){
        StorageHelper.removeModules(module.name);
    }
    
    function update(module){
        var data = {modules: {}}
        data.modules[module.name] = module
        StorageHelper.updateModules(data);
    }
    
    function installation_status(module){
        var modules = StorageHelper.retrieveModules();
        if(! modules[module.name]){
            return "new"
        }else{
            if(module.dead == 1){
                return "dead"
            }
            if(module.version > modules[module.name].version){
                return "version"
            }
            if(module.version == modules[module.name].version){
                return "unchanged"
            }
        }
        return "unknown";
    }
    
    return {
        install: install,
        start: start,
        stop: stop,
		load: load,
		reload: reload,
        restart: restart,
		config_module: config_module
    };
}());
export {Loader};
