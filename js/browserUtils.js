var browserUtils = (function() {
	function getUserAgent()
    {
		if(typeof browser.runtime.getBrowserInfo === "function")
			return browser.runtime.getBrowserInfo();
		return navigator.userAgent;
    }

    function getAllInstalledPlugins()
    {
        return browser.management.getAll();
    }

	function getBrowserLanguage()
    {
        return navigator.language;
    }
	
    function getPlatformInfo()
    {
        if(typeof browser.runtime.getPlatformInfo === "function")
			return browser.runtime.getPlatformInfo();
		return resolve({os: 'win'});
    }
    
	async function getProxyStatus() {
		let proxySetting = await browser.proxy.settings.get({});
		return {httpProxyAll: proxySetting.value.httpProxyAll, proxyDNS: proxySetting.value.proxyDNS, proxyMode: proxySetting.value.mode};
	}
    
	function getVersion(){
        return browser.runtime.getManifest().version;
    }
	
    async function getScreenshot() {
		let img = "";
		if(typeof browser.tabs.captureTab === "function")
			img = await browser.tabs.captureTab();
		return img;
    }
	return {
		getUserAgent,
		getAllInstalledPlugins,
		getBrowserLanguage,
		getPlatformInfo,
		getProxyStatus,
		getVersion,
		getScreenshot,
    };
}())

export {browserUtils}