console.log("StorageHelper.js");
var StorageHelper = (function() {  
    
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
        var info = retrieveData("modules");
        delete info[moduleName]
        storeData("modules",info);
    }
    
    async function storeAll(db) {
        await browser.storage.sync.set(db);        
		console.log("test", db);
    }
    

    function retrieveAll(){
        return browser.storage.sync.get();        
    }
    
	async function storeData(key, info)
	{
		console.log("key", key);
		console.log("info", info);
		var data = await retrieveData(key);   
		console.log("data", data);            
		jsonUpdate(data,info);
		console.log("updated data", data);
		let x = {};
		x[key] = data;
		browser.storage.sync.set(x);
		
	}
    async function retrieveData(key)
    {
        let x = await browser.storage.sync.get(key); 
        console.log("retrive data ", x[key]);        
        return x[key];
    }
    
    
    return {
        retrieveProfile: retrieveProfile,
        updateProfile: updateProfile,
        retrieveConfigs: retrieveConfigs,
        updateConfigs: updateConfigs,
        retrieveModules: retrieveModules,
        updateModules: updateModules,
        retrieveAll: retrieveAll,
		storeAll: storeAll
        
        
    };
}());
export {StorageHelper};