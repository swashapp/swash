var Content = (function() {
    'use strict';
    
    var callbacks = {};
    
    function unload(){        
        DataHelper.retrieveModules().forEach(row => {
            unload_module(row);
        });
    }

    function load(){
        DataHelper.retrieveModules().forEach(row => {
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
        if(module.functions.includes("content")){
            module.content.forEach(obj=>{            
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
    }

    function load_module(module){
        if(module.functions.includes("content")){
            module.content.forEach(obj=>{
                if(obj.status == "enabled"){
                    if(! callbacks[module.name]){
                        callbacks[module.name] = {};
                    }
                    callback = function(x){public_callback(module.name,obj, x)};
                    callbacks[module.name][obj.selector + "_" + obj.event_name] = callback
                    if(obj.selector == ""){
                        // window
                        window.addEventListener(obj.event_name, callback);
                    }else{
                        var doms = jQuery(obj.selector).forEach(dom=>{
                            dom.addEventListener(obj.event_name, callback);
                        });
                    }
                }
            });
        }
    }
    
    return {
        load: load,
        unload: unload,
        load_module: load_module,
        unload_module: unload_module
    };
}());