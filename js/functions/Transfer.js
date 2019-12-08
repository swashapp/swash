console.log("Transfer.js");

var transfer = (function() {
	var pattern = "swash://*";
	const regexp = "swash:\/\/(0x[a-fA-F0-9]{40})"
	
	
	function initModule(module){
	}

	
	function showPageOnTab(url_to_show) {
		return browser.windows.getAll({
			populate: true,
			windowTypes: ["normal"]
		  }).then((windowInfoArray) => {
			  browser.tabs.create({url: url_to_show, active: true}).then(x=>{ window.close(); });
		  });
	}

	function openTransferDialog(wallet){
		let url = browser.runtime.getURL("dashboard/index.html#/Transfer/" + wallet);
		return browser.windows.create({
			url: url,
			type: "popup"
		});						
	}
	function listener(requestDetails){
		let res = requestDetails.url.match(regexp);
	    let url = browser.runtime.getURL("dashboard/index.html#/Transfer/"+ res[1]);
		showPageOnTab(url);
	}

	function load(){
		if(!browser.webRequest.onBeforeRequest.hasListener(listener)){
            browser.webRequest.onBeforeRequest.addListener(listener, {urls: [pattern]}, ["blocking"]);
        }
		
		if(browser.tabs.onUpdated.hasListener(registerContentScripts))
			browser.tabs.onUpdated.removeListener(registerContentScripts);  
		browser.tabs.onUpdated.addListener(registerContentScripts);            
	}

	function unload(){
		if(browser.tabs.onUpdated.hasListener(registerContentScripts))
			browser.tabs.onUpdated.removeListener(registerContentScripts);

		
		if(browser.webRequest.onBeforeRequest.hasListener(listener)){
            browser.webRequest.onBeforeRequest.removeListener(listener);
        }   
	}
	
	function registerContentScripts(tabId, changeInfo, tabInfo) {
		if(changeInfo.status == "loading") {
			browser.tabs.executeScript(tabId, {
			  file: "/lib/browser-polyfill.js",
			  allFrames: false,
			  runAt: "document_start"
			}).then(result => {
				browser.tabs.executeScript(tabId, {
				  file: "/js/content_scripts/transfer_script.js",
				  allFrames: false,
				  runAt: "document_start"
				})				
			}).then(result => {
					browser.tabs.insertCSS(tabId, {
					file: "/css/transfer.css",
					allFrames: false,
					runAt: "document_start"
					})
			})
		}
    }
	
	return {
        load,
        unload,
		initModule,
		openTransferDialog
    };
}());
export {transfer};
