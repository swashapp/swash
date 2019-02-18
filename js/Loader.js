var Loader = (function() {
    'use strict';
    
    function install(allModules){
        allModules.forEach(module=>{
            console.log("Processing module:" + module.name + ", last_updates_at:" + module.last_updates_at);
            var i_status = installation_status(module);
            if(i_status == "new"){
                console.log("New, Is loading");
                register(module);
            }
            if(i_status == "version"){
                console.log("Updated, updating");
                update(module);
            }
            if(i_status == "dead"){
                console.log("Obsolete, removing");
                unregister(module);
            }
        });    
    }
    
    function start(){
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