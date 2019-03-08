console.log("Loader.js");
import {StorageHelper} from './StorageHelper.js';
import {Browsing} from './Browsing.js';
import {Content} from './Content.js';
import {ApiCall} from './ApiCall.js';
import {Utils} from './Utils.js';
import {filterUtils} from './filterUtils.js';
import {ssConfig} from './manifest.js';
var Loader = (function() {
    'use strict';    
    function install(allModules){
        StorageHelper.retrieveAll().then(db => {
            console.log("db", db, Object.keys(db).length);
            if (db == null || db == undefined || Object.keys(db).length==0){
                db = {modules: {}, configs: {}, profile: {}, filters: [], privacyData: [], messages: {}};                
                db.configs.Id = Utils.uuid();
                db.configs.salt = Utils.uuid();
            }
            try{
				Utils.jsonUpdate(db.configs, ssConfig);
                allModules.forEach(module=>{            
                    console.log("Processing module:" + module.name + ", version:" + module.version);
                    
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
           console.log("install: ", db);
           StorageHelper.storeAll(db);
           
        });
        
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
		browser.storage.sync.get("configs").then(c => {
			c.configs.is_enabled = true;
			browser.storage.sync.set(c);
			init(true);
			Content.load();
			Browsing.load();
			ApiCall.load();			
		})	
    }
    

    function stop(){
		browser.storage.sync.get("configs").then(c => {
			c.configs.is_enabled = false;
			browser.storage.sync.set(c);		
			init(false);
			Content.unload();
			Browsing.unload();
			ApiCall.unload();
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
	}
	
    function unload_module(module) {
		Content.unload_module(module);
		Browsing.unload_module(module);
		ApiCall.unload_module(module);		
	}
	
	function load() {
		browser.storage.sync.get("configs").then(c => {
			if(c.configs.is_enabled) {
				init(true);
				Content.load();
				Browsing.load();
				ApiCall.load();				
			} 
			else {
				init(false);
				Content.unload();
				Browsing.unload();
				ApiCall.unload();								
			}			
		})		
	}
	
	function config_module(moduleName, settings) {
		StorageHelper.saveModuleSettings(moduleName, settings).then(x => {
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
        restart: restart,
		config_module: config_module
    };
}());
export {Loader};
