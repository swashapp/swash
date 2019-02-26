console.log("StorageHelper.js");
var StorageHelper = (function() {  
    
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
        storeData("modules",info);
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
		jsonUpdate(data,info);
		let x = {};
		x[key] = data;
		browser.storage.sync.set(x);
		
	}
    async function retrieveData(key)
    {
        let x = await browser.storage.sync.get(key); 
        return x[key];
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
		storeAll: storeAll
        
        
    };
}());
export {StorageHelper};