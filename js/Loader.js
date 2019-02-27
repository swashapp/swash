console.log("Loader.js");
import {StorageHelper} from './StorageHelper.js';
import {Browsing} from './Browsing.js';
import {Content} from './Content.js';
import {Utils} from './Utils.js';
import {filterUtils} from './filterUtils.js';
var Loader = (function() {
    'use strict';    
    function install(allModules){
        StorageHelper.retrieveAll().then(db => {
            console.log("db", db, Object.keys(db).length);
            if (db == null || db == undefined || Object.keys(db).length==0){
                db = {modules: {}, configs: {}, profile: {}, filters: []};                
                db.configs.Id = Utils.uuid();
            }
            try{
                allModules.forEach(module=>{            
                    console.log("Processing module:" + module.name + ", version:" + module.version);
                    
					if(!db.modules[module.name])
                    {
						db.modules[module.name] = {};
                        db.modules[module.name].mId = Utils.uuid();
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

    
    function start(){
		Content.load();
        Browsing.load();
        //ApiCall.load();
    }
    

    function stop(){
		Content.unload();
        Browsing.unload();
    }

	function restart() {
		stop();
		start();
    }
    
    function start_module(module) {
		Content.load_module(module);
		Browsing.load_module(module);
	}
	
    function stop_module(module) {
		Content.unload_module(module);
		Browsing.unload_module(module);
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
        restart: restart
    };
}());
export {Loader};
