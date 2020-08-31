function sendMessage(message) {
	return browser.runtime.sendMessage(message);
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
			func: "updateData",
			params: ["filters", data]
		}
		return sendMessage(message);
	}


	function savePrivacyData(data) {
		let message = {
			obj: "storageHelper",
			func: "updateData",
			params: ["privacyData", data]
		}
		return sendMessage(message);
	}

	function saveProfile(data) {
		let message = {
			obj: "storageHelper",
			func: "updateData",
			params: ["profile", data]
		}
		return sendMessage(message);
	}

	function saveModule(data) {
		let message = {
			obj: "storageHelper",
			func: "updateData",
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
			func: "updateData",
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
		param[moduleName] = {apiCall: {}};
		param[moduleName].apiCall.access_token = "";
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

	function generateJWT() {
		let message = {
			obj: "communityHelper",
			func: "generateJWT",
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
			func: "updateData",
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

	function withdrawAllTo(address, amount) {
		let message = {
			obj: "communityHelper",
			func: "withdrawAllTo",
			params: [address, amount]
		}
		return sendMessage(message);
	}

	async function getWithdrawAllToTransactionFee(targetAddress) {
		let message = {
			obj: "communityHelper",
			func: "getWithdrawAllToTransactionFee",
			params: [targetAddress]
		}
		return sendMessage(message);
	}

	async function getSponsoredWithdrawTransactionFee(targetAddress) {
		let message = {
			obj: "communityHelper",
			func: "getSponsoredWithdrawTransactionFee",
			params: [targetAddress]
		}
		return sendMessage(message);
	}

	function isNeededOnBoarding() {
		let message = {
			obj: "onboarding",
			func: "isNeededOnBoarding",
			params: []
		};
		return sendMessage(message);
	}

	function getOnboardingFlow() {
		let message = {
			obj: "onboarding",
			func: "getOnboardingFlow",
			params: []
		};
		return sendMessage(message);
	}

	function submitOnBoarding() {
		let message = {
			obj: "onboarding",
			func: "submitOnBoarding",
			params: []
		};
		return sendMessage(message);
	}

	function startOnBoarding(onboardingName, tabId) {
		let message = {
			obj: "onboarding",
			func: "startOnBoarding",
			params: [onboardingName, tabId]
		};
		return sendMessage(message);
	}

	function startOnBoardingOAuth(onboardingName) {
		let message = {
			obj: "onboarding",
			func: "startOnBoardingOAuth",
			params: [onboardingName]
		};
		return sendMessage(message);
	}

	function loadFile(file) {
		let message = {
			obj: "onboarding",
			func: "loadFile",
			params: [file]
		};
		return sendMessage(message);
	}

	function applyConfig(config) {
		let message = {
			obj: "onboarding",
			func: "applyConfig",
			params: [config]
		};
		return sendMessage(message);
	}

	function saveConfig() {
		let message = {
			obj: "onboarding",
			func: "saveConfig",
			params: []
		};
		return sendMessage(message);
	}

	function getFilesList(onboardingName) {
		let message = {
			obj: "onboarding",
			func: "getFilesList",
			params: [onboardingName]
		};
		return sendMessage(message);
	}

	function downloadFile(onboardingName, fileId) {
		let message = {
			obj: "onboarding",
			func: "downloadFile",
			params: [onboardingName, fileId]
		};
		return sendMessage(message);
	}

	function uploadFile(onboardingName) {
		let message = {
			obj: "onboarding",
			func: "uploadFile",
			params: [onboardingName]
		};
		return sendMessage(message);
	}

	function writeTo3BoxSpace(seed) {
		let message = {
			obj: "onboarding",
			func: "writeTo3BoxSpace",
			params: [seed]
		};
		return sendMessage(message);
	}

	function getFrom3BoxSpace(seed) {
		let message = {
			obj: "onboarding",
			func: "getFrom3BoxSpace",
			params: [seed]
		};
		return sendMessage(message);
	}

	function save3BoxMnemonic(mnemonic) {
		let message = {
			obj: "onboarding",
			func: "save3BoxMnemonic",
			params: [mnemonic]
		};
		return sendMessage(message);
	}

	function get3BoxMnemonic() {
		let message = {
			obj: "onboarding",
			func: "get3BoxMnemonic",
			params: []
		};
		return sendMessage(message);
	}

	function openOnBoarding() {
		let message = {
			obj: "onboarding",
			func: "openOnBoarding",
			params: []
		};
		return sendMessage(message);
	}

	function saveProfileInOnBoarding(gender, age, income) {
		let message = {
			obj: "onboarding",
			func: "saveProfileInfo",
			params: [gender, age, income]
		};
		return sendMessage(message);
	}

	function createAndSaveWallet() {
		let message = {
			obj: "onboarding",
			func: "createAndSaveWallet",
			params: []
		};
		return sendMessage(message);
	}

	function joinSwash() {
		let message = {
			obj: "swashApiHelper",
			func: "joinSwash",
			params: []
		};
		return sendMessage(message);
	}

	function getReferralRewards() {
		let message = {
			obj: "swashApiHelper",
			func: "getReferralRewards",
			params: []
		};
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
		withdrawTo,
		withdrawAllTo,
		getWithdrawAllToTransactionFee,
		getSponsoredWithdrawTransactionFee,
		startOnBoarding,
		isNeededOnBoarding,
		getOnboardingFlow,
		submitOnBoarding,
		startOnBoardingOAuth,
		loadFile,
		applyConfig,
		saveConfig,
		getFilesList,
		downloadFile,
		uploadFile,
		writeTo3BoxSpace,
		getFrom3BoxSpace,
		save3BoxMnemonic,
		get3BoxMnemonic,
		openOnBoarding,
		saveProfileInOnBoarding,
		createAndSaveWallet,
		joinSwash,
		getReferralRewards,
		generateJWT
	};
}());