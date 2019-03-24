console.log("StorageHelper.js");
import {Utils} from './Utils.js';
var StorageHelper = (function() {  
    
    var messages = {};
    
    function retrieveProfile(){
        return retrieveData("profile");
    }

    function updateProfile(info){
        storeData("profile",info)
    }

    function retrieveFilters() {
        return retrieveData("filters");
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
        var info = retrieveData("modules");
        delete info[moduleName]
        browser.storage.sync.set({modules:info});
    }
    
    function saveMessage(msg, id) {
        messages[id] = msg;
    }
    
	function removeMessage(id) {
        /*
        var info = await retrieveData("messages");
        delete info[id];
        browser.storage.sync.set({messages:info});*/
        delete messages[id];
	}
    
    function retrieveMessages() {
        return messages;
    }
	
    async function storeAll(db) {
        await browser.storage.sync.set(db);        
    }
    

    function retrieveAll(){
        return browser.storage.sync.get();        
    }
    
	async function storeData(key, info)
	{
		var data = await retrieveData(key);   
		Utils.jsonUpdate(data,info);
		let x = {};
		x[key] = data;
		browser.storage.sync.set(x);
	}
    
    async function retrieveData(key)
    {
        let x = await browser.storage.sync.get(key); 
        return x[key];
    }
	
	function updateFunctionSettings(module, functionName, settings) {
		if(module.functions.includes(functionName)) {
			for (let item of module[functionName]) {
				item.is_enabled = settings[functionName][item.name]
			}
		}		
	}
    
    async function saveModuleSettings(moduleName, settings) {
        var modules = await retrieveData("modules");        
        let ret = modules[moduleName];
		ret.is_enabled = settings.is_enabled;
		ret.privacy_level = settings.privacy_level;
		updateFunctionSettings(ret, "content", settings);
		updateFunctionSettings(ret, "browsing", settings);
		updateFunctionSettings(ret, "apiCall", settings);
        browser.storage.sync.set({modules: modules});        
    }

    return {
        retrieveProfile: retrieveProfile,
        updateProfile: updateProfile,
        retrieveConfigs: retrieveConfigs,
        updateConfigs: updateConfigs,
        retrieveModules: retrieveModules,
        updateModules: updateModules,
        retrieveFilters: retrieveFilters,
        retrieveAll: retrieveAll,
		storeAll: storeAll,
		saveModuleSettings: saveModuleSettings,
		retrieveData: retrieveData,
		storeData: storeData,
        saveMessage: saveMessage,
		removeMessage: removeMessage,
        retrieveMessages: retrieveMessages
        
        
    };
}());
export {StorageHelper};