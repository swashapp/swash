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
    
    async function removeModule(moduleName){
        var info = await retrieveData("modules");
        delete info[moduleName]
        browser.storage.local.set({modules:info});
    }
    
    function saveMessage(msg, id) {
        messages[id] = msg;
    }
    
	function removeMessage(id) {
        /*
        var info = await retrieveData("messages");
        delete info[id];
        browser.storage.local.set({messages:info});*/
        delete messages[id];
	}
    
    function retrieveMessages() {
        return messages;
    }
	
    async function storeAll(db) {
        await browser.storage.local.set(db);        
    }
    

    function retrieveAll(){
        return browser.storage.local.get();        
    }
    
	async function storeData(key, info)
	{
		var data = await retrieveData(key);   
		Utils.jsonUpdate(data,info);
		let x = {};
		x[key] = data;
		browser.storage.local.set(x);
	}
    
    async function retrieveData(key)
    {
        let x = await browser.storage.local.get(key); 
        return x[key];
    }
	
	async function createTask(info) {
		var tasks = await retrieveData("tasks");
        if(!tasks[info.moduleName])
            tasks[info.moduleName] = {};
		tasks[info.moduleName][info.name] = {
			startTime: info.startTime,
            taskId: info.taskId,
			endTime: -1,
			success: "unknown"
		}
        let x = {};
		x["tasks"] = tasks;
		browser.storage.local.set(x);
	}
	
	async function endTask(info) {
		var tasks = await retrieveData("tasks");
        if(!info || !tasks[info.moduleName] || !tasks[info.moduleName][info.name])
            return;
		var res = Object.assign({}, tasks[info.moduleName][info.name]);
        delete tasks[info.moduleName][info.name];
        
        let x = {};
		x["tasks"] = tasks;
		browser.storage.local.set(x);        
        return res;        
	}
	
    async function loadAllModuleTaskIds(moduleName) {
		var tasks = await retrieveData("tasks");
        return tasks[moduleName];        
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
		if(settings.browsing_filter)
			ret.browsing_filter.urls = settings.browsing_filter.urls;
		updateFunctionSettings(ret, "content", settings);
		updateFunctionSettings(ret, "browsing", settings);
		updateFunctionSettings(ret, "apiCall", settings);
		updateFunctionSettings(ret, "survey", settings);
		updateFunctionSettings(ret, "context", settings);
		updateFunctionSettings(ret, "devtools", settings);
		updateFunctionSettings(ret, "task", settings);
        browser.storage.local.set({modules: modules});        
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
        retrieveMessages: retrieveMessages,
		removeModule: removeModule,
		createTask: createTask,
        endTask: endTask,
        loadAllModuleTaskIds: loadAllModuleTaskIds
        
        
    };
}());
export {StorageHelper};