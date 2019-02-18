var DataHelper = (function() {
    'use strict';
    
    function retrieveProfile(){
        return retrieveData("profile");
    }

    function updateProfile(info){
        storeData("profile",info)
    }

    function retrieveConfigs(){
        return retrieveData("configs");
    }

    function updateConfigs(info){
        storeData("configs",info)
    }

    function retrieveModules(){
        return retrieveData("modules");
    }

    function updateModules(info){
        storeData("modules",info)
    }
    
    function removeModules(moduleName){
        info = retrieveData("modules");
        delete info[moduleName]
        storeData("modules",info);
    }

    function storeData(key, info)
    {
        data = retrieveData(key);
        jsonUpdate(data,info)
        browser.storage.sync.set(data);
    }

    function retrieveData(key)
    {
        return browser.storage.sync.get(key);
    }
    
    function jsonUpdate(obj/*, …*/) {
        for (var i=1; i<arguments.length; i++) {
            for (var prop in arguments[i]) {
                var val = arguments[i][prop];
                if (typeof val == "object") // this also applies to arrays or null!
                    update(obj[prop], val);
                else
                    obj[prop] = val;
            }
        }
        return obj;
    }
    
    return {
        retrieveProfile: retrieveProfile,
        updateProfile: updateProfile,
        retrieveConfigs: retrieveConfigs,
        updateConfigs: updateConfigs,
        retrieveModules: retrieveModules,
        updateModules: updateModules,
        
        
    };
}());