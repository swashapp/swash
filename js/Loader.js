console.log("Loader.js");
import {DataHelper} from './DataHelper.js';
import {Browsing} from './Browsing.js';
import {jsonUpdate} from './utils.js';
var Loader = (function() {
    'use strict';
    
    function install(allModules){
        DataHelper.retrieveAll().then(db => {
            console.log("db", db, Object.keys(db).length);
            if (db == null || db == undefined || Object.keys(db).length==0){
                db = {modules: {}, configs: {}, profile: {}};                
            }
            try{
                allModules.forEach(module=>{            
                    console.log("Processing module:" + module.name + ", last_updates_at:" + module.last_updates_at);
                    jsonUpdate(db.modules, module);                
                });
            }
            catch(exp){
                console.log(exp);
            }
            //TODO: prefrences: apply previous user configuration
            // jsonUpdate(db.modules, db.prefrence);
           console.log("install: ", db);
           DataHelper.stroreAll(db).then(x => DataHelper.retrieveAll().then(y => console.log(y)));
           
        });
        
    }
    
    function start(){
        DataHelper.retrieveModules().then(modules => modules.forEach(module => {
            if(module.functions.includes("content")){
                browser.contentScripts.register({
                  "js": [{file: "/js/content_script.js"}],
                  "matches": [module.content_matches],
                  "allFrames": true,
                  "runAt": "document_start"
                });
            }
        }));
        Browsing.load();
    }
    
    function load_content(url){
        var retval = [];
        DataHelper.retrieveModules().forEach(module => {
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
        DataHelper.updateModules(data);
    }
    
    function unregister(module){
        DataHelper.removeModules(module.name);
    }
    
    function update(module){
        var data = {modules: {}}
        data.modules[module.name] = module
        DataHelper.updateModules(data);
    }
    
    function installation_status(module){
        var modules = DataHelper.retrieveModules();
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
console.log("Loader-end1.js");
export {Loader};
console.log("Loader-end2.js");