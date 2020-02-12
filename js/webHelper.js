function sendMessage(message) {
	return browser.runtime.sendMessage(message)
}

var helper = (function () {
	function handleFilter() {
		let message = {
			obj: "pageAction",
			func: "handleFilter",
			params: []
		}
		return sendMessage(message);
	}
	function isCurrentDomainFiltered() {
		let message = {
			obj: "pageAction",
			func: "isCurrentDomainFiltered",
			params: []
		}
		return sendMessage(message);
	}	
	function loadFilters() {
		let message = {
			obj: "storageHelper",
			func: "retrieveData",
			params: ["filters"]
		}
		return sendMessage(message);
	}
	function loadPrivacyData() {
		let message = {
			obj: "storageHelper",
			func: "retrieveData",
			params: ["privacyData"]
		}
		return sendMessage(message);
	}

	function loadMessages() {
		let message = {
			obj: "databaseHelper",
			func: "getAllMessages",
			params: []
		}
		return sendMessage(message);
	}

	function cancelSending(msgId) {
		let message = {
			obj: "dataHandler",
			func: "cancelSending",
			params: [msgId]
		}
		return sendMessage(message);
	}

	function loadModules() {
		let message = {
			obj: "storageHelper",
			func: "retrieveModules",
			params: []
		}
		return sendMessage(message);
	}

	function load() {
		let message = {
			obj: "storageHelper",
			func: "retrieveAll",
			params: []
		}
		return sendMessage(message);
	}
	function save(data) {
	}
	function saveFilters(data) {
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["filters", data]
		}
		return sendMessage(message);
	}


	function savePrivacyData(data) {
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["privacyData", data]
		}
		return sendMessage(message);
	}

	function saveProfile(data) {
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["profile", data]
		}
		return sendMessage(message);
	}

	function saveModule(data) {
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["modules", data]
		}
		return sendMessage(message);
	}

	function removeModule(data) {
		let message = {
			obj: "storageHelper",
			func: "removeModule",
			params: [data]
		}
		return sendMessage(message);
	}

	function saveConfigs(data) {
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["configs", data]
		}
		return sendMessage(message);
	}
	function configModule(moduleName, settings) {
		let message = {
			obj: "loader",
			func: "configModule",
			params: [moduleName, settings]
		}
		return sendMessage(message);
	}
	function startAuth(moduleName) {
		let message = {
			obj: "apiCall",
			func: "startOauth",
			params: [moduleName]
		}
		return sendMessage(message);
	}
	function removeAuth(moduleName) {
		param = {};
		param[moduleName] = {};
		param[moduleName].access_token = "";
		let message = {
			obj: "storageHelper",
			func: "updateModules",
			params: [param]
		}
		return sendMessage(message);
	}

	function isConnected(moduleName) {
		let message = {
			obj: "apiCall",
			func: "isConnected",
			params: [moduleName]
		}
		return sendMessage(message);
	}

	function start() {
		let message = {
			obj: "loader",
			func: "start",
			params: []
		}
		return sendMessage(message);
	}

	function reload() {
		let message = {
			obj: "loader",
			func: "reload",
			params: []
		}
		return sendMessage(message);
	}


	function stop() {
		let message = {
			obj: "loader",
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
			obj: "dataHandler",
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
			obj: "storageHelper",
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

	function getDataBalance(address) {
		let message = {
			obj: "communityHelper",
			func: "getDataBalance",
			params: [address]
		}
		return sendMessage(message);
	}

	function getEthBalance(address) {
		let message = {
			obj: "communityHelper",
			func: "getEthBalance",
			params: [address]
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

	function getCumulativeEarnings() {
		let message = {
			obj: "communityHelper",
			func: "getCumulativeEarnings",
			params: []
		}
		return sendMessage(message);
	}
	
	function getTotalBalance() {
		let message = {
			obj: "communityHelper",
			func: "getTotalBalance",
			params: []
		}
		return sendMessage(message);
	}

	function withdraw() {
		let message = {
			obj: "communityHelper",
			func: "withdrawEarnings",
			params: []
		}
		return sendMessage(message);
	}
	
	function getVersion() {
		let message = {
			obj: "storageHelper",
			func: "getVersion",
			params: []
		}
		return sendMessage(message);
	}

	function loadWallets(){
		let message = {
			obj: "storageHelper",
			func: "retrieveData",
			params: ["wallets"]
		}
		return sendMessage(message);
	}

	function saveWallets(data){
		let message = {
			obj: "storageHelper",
			func: "storeData",
			params: ["wallets", data]
		}
		return sendMessage(message);
	}

	function withdrawTo(address, amount) {
		let message = {
			obj: "communityHelper",
			func: "withdrawTo",
			params: [address, amount]
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
		getEthBalance,
		withdraw,
		getAvailableBalance,
		getCumulativeEarnings,
		getTotalBalance,
		updatePrivacyLevel,
		decryptWallet,
		getVersion,
		handleFilter,
		isCurrentDomainFiltered,
		loadWallets,
		saveWallets,
		withdrawTo
	};
}());

console.log(helper);