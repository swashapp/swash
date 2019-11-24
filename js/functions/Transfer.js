console.log("Transfer.js");
import {StorageHelper} from '../StorageHelper.js';
import {Utils} from '../Utils.js';
import {DataHandler} from '../DataHandler.js';

var Transfer = (function() {
	var pattern = "https://transfer.swashapp.io/*";
	const regexp = "https:\/\/transfer\.swashapp\.io\/(0x[a-fA-F0-9]{40})"
	
	function showPageOnTab(url_to_show) {
		return browser.windows.getAll({
			populate: true,
			windowTypes: ["normal"]
		  }).then((windowInfoArray) => {
			  browser.tabs.create({url: url_to_show, active: true}).then(x=>{ window.close(); });
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
	}

	function unload(){
		if(browser.webRequest.onBeforeRequest.hasListener(listener)){
            browser.webRequest.onBeforeRequest.removeListener(listener);
        }   
	}
	
	return {
        load: load,
        unload: unload
    };
}());
export {Transfer};