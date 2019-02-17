var ApiCall = (function() {
    'use strict';
    var callbacks = {};
    
    function getModules(){
        // read storage
        return registered_modules;
    }
    
    function pushModule(module){
        // save in storage
    }
    
    function popModule(module){
        // remove in storage
    }
    
    
    function unload(){        
        getModules().forEach(row => {
            unload_module(row);
        });
    }

    function load(){
        getModules().forEach(row => {
            load_module(row);
        });
    }
    
    function unload_module(module){
        module.browsing.forEach(data=>{
            if(browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                browser.webRequest.onBeforeRequest.removeListener(callbacks[module.name+ "_" + data.name]);
            }
        }
    }

    function load_module(module){
        module.browsing.forEach(data=>{
            callbacks[module.name + "_" + data.name] = function(x){
                if(!module.target_listener || module.target_listener == "inspectRequest")
                    inspectRequest_data(module.name, data, x)
                if(module.target_listener == "inspectReferrer")
                    inspectReferrer(module.name,x)
                if(module.target_listener == "inspectVisit")
                    inspectVisit(module.name,x)
            };
            if(!browser.webRequest.onBeforeRequest.hasListener(callbacks[module.name+ "_" + data.name])){
                browser.webRequest.onBeforeRequest.addListener(callbacks[module.name+ "_" + data.name],module.filter, module.extraInfoSpec);
            }
        }
    }
        
    function unregister(module){
        popModule(module);
        unload_module(module);
    }

    function register(module){
        pushModule(module);
        load_module(module);
    }
    
    
    return {
        inspectRequest_Data: inspectRequest_Data,
        load: load,
        unload: unload,
        register: register,
        unregister: unregister,
        getModules: getModules
    };
}());