function sendMessage(message) {
	return browser.runtime.sendMessage(message)
}

var helper = (function () {
	function loadFilters() {
		let message = {
			obj: "StorageHelper",
			func: "retrieveData",
			params: ["filters"]
		}
		return sendMessage(message);
	}
	function loadPrivacyData() {
		let message = {
			obj: "StorageHelper",
			func: "retrieveData",
			params: ["privacyData"]
		}
		return sendMessage(message);
	}

	function loadMessages() {
		let message = {
			obj: "DatabaseHelper",
			func: "getAllMessages",
			params: []
		}
		return sendMessage(message);
	}

	function cancelSending(msgId) {
		let message = {
			obj: "DataHandler",
			func: "cancelSending",
			params: [msgId]
		}
		return sendMessage(message);
	}

	function loadModules() {
		let message = {
			obj: "StorageHelper",
			func: "retrieveModules",
			params: []
		}
		return sendMessage(message);
	}

	function load() {
		let message = {
			obj: "StorageHelper",
			func: "retrieveAll",
			params: []
		}
		return sendMessage(message);
	}
	function save(data) {
	}
	function saveFilters(data) {
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["filters", data]
		}
		return sendMessage(message);
	}


	function savePrivacyData(data) {
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["privacyData", data]
		}
		return sendMessage(message);
	}

	function saveProfile(data) {
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["profile", data]
		}
		return sendMessage(message);
	}

	function saveModule(data) {
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["modules", data]
		}
		return sendMessage(message);
	}

	function removeModule(data) {
		let message = {
			obj: "StorageHelper",
			func: "removeModule",
			params: [data]
		}
		return sendMessage(message);
	}

	function saveConfigs(data) {
		let message = {
			obj: "StorageHelper",
			func: "storeData",
			params: ["configs", data]
		}
		return sendMessage(message);
	}
	function configModule(moduleName, settings) {
		let message = {
			obj: "Loader",
			func: "configModule",
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

	function reload() {
		let message = {
			obj: "Loader",
			func: "reload",
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

	function enforcePolicy(msg, mSalt, salt, privacyData) {
		let message = {
			obj: "DataHandler",
			func: "enforcePolicy",
			params: [msg, mSalt, salt, privacyData]
		}
		return sendMessage(message);
	}

	function identityPrivacy(id, mId, privacyLevel) {
		let message = {
			obj: "privacyUtils",
			func: "identityPrivacy",
			params: [id, mId, privacyLevel]
		}
		return sendMessage(message);
	}


	function updatePrivacyLevel(privacyLevel) {
		let message = {
			obj: "StorageHelper",
			func: "updatePrivacyLevel",
			params: [privacyLevel]
		}
		return sendMessage(message);
	}

	function decryptWallet(encryptedWallet, password) {
		let message = {
			obj: "communityHelper",
			func: "decryptWallet",
			params: [encryptedWallet, password]
		}
		return sendMessage(message);
	}

	function getKeyInfo() {
		let message = {
			obj: "communityHelper",
			func: "getWalletInfo",
			params: []
		}
		return sendMessage(message);
	}

	function getDataBalance() {
		let message = {
			obj: "communityHelper",
			func: "getBalance",
			params: []
		}
		return sendMessage(message);
	}

	function getAvailableBalance() {
		let message = {
			obj: "communityHelper",
			func: "getAvailableBalance",
			params: []
		}
		return sendMessage(message);
	}

	function withdraw() {
		let message = {
			obj: "communityHelper",
			func: "withrawEarnings",
			params: []
		}
		return sendMessage(message);
	}
	
	function getVersion() {
		let message = {
			obj: "StorageHelper",
			func: "getVersion",
			params: []
		}
		return sendMessage(message);
	}

	return {
		load,
		save,
		stop,
		start,
		reload,
		configModule,
		loadModules,
		loadFilters,
		saveFilters,
		saveProfile,
		saveConfigs,
		startAuth,
		removeAuth,
		isConnected,
		subscribe,
		unsubscribe,
		savePrivacyData,
		loadPrivacyData,
		loadMessages,
		cancelSending,
		saveModule,
		removeModule,
		enforcePolicy,
		identityPrivacy,
		getKeyInfo,
		getDataBalance,
		withdraw,
		getAvailableBalance,
		updatePrivacyLevel,
		decryptWallet,
		getVersion
	};
}());

console.log(helper);