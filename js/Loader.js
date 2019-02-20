console.log("Loader.js");
import {StorageHelper} from './StorageHelper.js';
import {Browsing} from './Browsing.js';
import {Utils} from './Utils.js';
var Loader = (function() {
    'use strict';
    
    function install(allModules){
        StorageHelper.retrieveAll().then(db => {
            console.log("db", db, Object.keys(db).length);
            if (db == null || db == undefined || Object.keys(db).length==0){
                db = {modules: {}, configs: {}, profile: {}};                
            }
            try{
                allModules.forEach(module=>{            
                    console.log("Processing module:" + module.name + ", version:" + module.version);
					if(!db.modules[module.name])
						db.modules[module.name] = {};
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
    
    function start(){
        StorageHelper.retrieveModules().then(modules => {for (var module in modules) {
            if(modules[module].functions.includes("content")){
                browser.contentScripts.register({
                  "js": [{file: "/js/content_script.js"}],
                  "matches": modules[module].content_matches,
                  "allFrames": true,
                  "runAt": "document_start"
                });
            }
        }});
        Browsing.load();
    }
    
    function load_content(url){
        var retval = [];
        StorageHelper.retrieveModules().forEach(module => {
            if(module.functions.includes("content")){
                var matched = false;
                module.content_matches.forEach(mtch=>{
                    if(url.match(mtch)){
                        matched = true;
                    }
                });
                if(matched){
                    module.content.forEach(data=>{            
                        retval.push(data); 
                    });
                }
            }
        });
        return retval;
    }
    
    function stop(){
        Browsing.unload();
    }
    
    function register(module){
        var data = {modules: {}}
        data.modules[module.name] = module
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
        stop: stop
    };
}());
export {Loader};
