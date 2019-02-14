var Content = (function() {
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
    
    function send_msg(msg){
        browser.runtime.sendMessage(msg);
    }
    
    function public_callback(module_name,data, event){
        msg = {};
        data.objects.forEach(x=>{
            var obj = null;
            if(x.selector == ""){
                obj = event.target
            }else{
                obj = jQuery(x.selector);
            }
            if(obj != null)
                if(x.property == "innerHTML"){
                    msg[x.name] = obj.innerHTML
                }
                // TODO complete it
            }
        });
        send_msg(msg);
    }
    
    function unload_module(module){
        module.events.forEach(obj=>{
            if(! callbacks[module.name]){
                callbacks[module.name] = {};
            }
            callback = callbacks[module.name][obj.selector + "_" + obj.event_name]
            if(obj.selector == ""){
                // window
                window.removeEventListener(obj.event_name, callback);
            }else{
                var doms = jQuery(obj.selector).forEach(dom=>{
                    dom.removeEventListener(obj.event_name, callback);
                });
            }
        });
    }

    function load_module(module){
        module.events.forEach(obj=>{
            if(! callbacks[module.name]){
                callbacks[module.name] = {};
            }
            callback = function(x){public_callback(module.name,obj, x)};
            callbacks[module.name][obj.selector + "_" + obj.event_name] = callback
            if(obj.selector == ""){
                // document
                document.addEventListener(obj.event_name, callback);
            }else{
                var doms = jQuery(obj.selector).forEach(dom=>{
                    dom.addEventListener(obj.event_name, callback);
                });
            }
        });
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