var browserUtils = (function() {
	function getUserAgent()
    {
		return navigator.userAgent;
    }

    function getAllInstalledPlugins()
    {
        /*return browser.management.getAll();*/
    }

	function getBrowserLanguage()
    {
        return navigator.language;
    }
	
    async function getPlatformInfo()
    {
		if(navigator.platform && navigator.platform.startsWith("Win"))
			return {os: 'win'};	
		let platformInfoPromise =  browser.runtime.getPlatformInfo();
		return platformInfoPromise.then((platformInfo) => {
			return platformInfo;
		}).catch((error) => {	
			return {os: 'android'};
		})		
    }
    
	async function isMobileDevice() {
		let os = (await getPlatformInfo()).os;
		return os === 'android';
	}

	function getVersion(){
        return browser.runtime.getManifest().version;
    }
	
	return {
		getUserAgent,
		getAllInstalledPlugins,
		getBrowserLanguage,
		getPlatformInfo,
		getVersion,
		isMobileDevice
    };
}())

export {browserUtils}