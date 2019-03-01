
function sendMessage(message) {
	return browser.runtime.sendMessage(message)
}

var helper = (function() {
    function loadFilters(){
		let message = {
			obj: "StorageHelper",
			func: "retrieveData",
			params: ["filters"]
		}
        return sendMessage(message);
    }
    function load(){
		let message = {
			obj: "StorageHelper",
			func: "retrieveAll",
			params: []
		}
        return sendMessage(message);		
    }
    function save(data){        
        console.log(data);
    }
    function saveFilters(data){
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["filters", data]
		}
        return sendMessage(message);
    }
    function saveProfile(data){
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["profile", data]
		}
        return sendMessage(message);		
    }
	function saveConfigs(data){
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["configs", data]
		}
        return sendMessage(message);		       
    }
	function config_module(moduleName, settings) {
		let message = {
			obj: "Loader",
			func: "config_module",
			params: [moduleName, settings]
		}
        return sendMessage(message);		       		
	}
	function startAuth(moduleName) {
		let message = {
			obj: "ApiCall",
			func: "start_oauth",
			params: [moduleName]
		}
        return sendMessage(message);		       		
	}
	function start() {
		let message = {
			obj: "Loader",
			func: "start",
			params: []
		}
        return sendMessage(message);		       		
	}

	function stop() {
		let message = {
			obj: "Loader",
			func: "stop",
			params: []
		}
        return sendMessage(message);		       		
	}
	
	
	return {
        load: load,
        save: save,
		stop: stop,
		start: start,
		config_module: config_module,
        loadFilters: loadFilters,
		saveFilters: saveFilters,
		saveProfile: saveProfile,
		saveConfigs: saveConfigs,
		startAuth: startAuth
    };
}());
