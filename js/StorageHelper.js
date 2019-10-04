console.log("StorageHelper.js");
import {Utils} from './Utils.js';
var StorageHelper = (function() {  
    
    var messages = {};
    const functionList = ["content", "browsing", "apiCall", "survey",  "context", "devtools", "task"]
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
        let x = browser.storage.local.get();
		return x;
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
	
	function updatePrivacyLevel(privacyLevel) {
		let key = "configs";
		let info = {privacyLevel: privacyLevel}
		storeData(key, info);
	}	
    
    async function saveModuleSettings(moduleName, settings) {
        var modules = await retrieveData("modules");        
        let ret = modules[moduleName];
		if(typeof settings.is_enabled != "undefined")
			ret.is_enabled = settings.is_enabled;
		for(let f of functionList) {
			if(typeof settings[f] !="undefined")
				updateFunctionSettings(ret, f, settings);
		}
        browser.storage.local.set({modules: modules});        
    }

    return {
        retrieveProfile,
        updateProfile,
        retrieveConfigs,
        updateConfigs,
        retrieveModules,
        updateModules,
		updatePrivacyLevel,
        retrieveFilters,
        retrieveAll,
		storeAll,
		saveModuleSettings,
		retrieveData,
		storeData,
        saveMessage,
		removeMessage,
        retrieveMessages,
		removeModule,
		createTask,
        endTask,
        loadAllModuleTaskIds,	   
    };
}());
export {StorageHelper};