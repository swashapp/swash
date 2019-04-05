
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
    function loadPrivacyData(){
		let message = {
			obj: "StorageHelper",
			func: "retrieveData",
			params: ["privacyData"]
		}
        return sendMessage(message);
    }

    function loadMessages(){
		let message = {
			obj: "StorageHelper",
			func: "retrieveMessages",
			params: []
		}
        return sendMessage(message);
    }

    function cancelSending(msgId){
		let message = {
			obj: "DataHandler",
			func: "cancelSending",
			params: [msgId]
		}
        return sendMessage(message);
    }
	
    function loadModules(){
		let message = {
			obj: "StorageHelper",
			func: "retrieveModules",
			params: []
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
	
	
    function savePrivacyData(data){
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["privacyData", data]
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

    function saveModule(data){
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["modules", data]
		}
        return sendMessage(message);		
    }
	
	function removeModule(data){
		let message = {
			obj: "StorageHelper",
			func: "removeModule",
			params: [data]
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
	function removeAuth(moduleName) {
		param = {};
		param[moduleName] = {};
		param[moduleName].access_token = "";
		let message = {
			obj: "StorageHelper",
			func: "updateModules",
			params: [param]
		}
        return sendMessage(message);		       					
	}
	
	function isConnected(moduleName) {
		let message = {
			obj: "ApiCall",
			func: "isConnected",
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
	
	function subscribe() {
		let message = {
			obj: "pushStream",
			func: "subscribe",
			params: []
		}
        return sendMessage(message);		       		
	}

	function unsubscribe() {
		let message = {
			obj: "pushStream",
			func: "unsubscribe",
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
		loadModules: loadModules,
        loadFilters: loadFilters,
		saveFilters: saveFilters,
		saveProfile: saveProfile,
		saveConfigs: saveConfigs,
		startAuth: startAuth,
		removeAuth: removeAuth,
		isConnected: isConnected,
        subscribe: subscribe,
        unsubscribe: unsubscribe,
		savePrivacyData: savePrivacyData,
		loadPrivacyData: loadPrivacyData,
		loadMessages: loadMessages,
		cancelSending: cancelSending,
		saveModule: saveModule,
		removeModule: removeModule
    };
}());
