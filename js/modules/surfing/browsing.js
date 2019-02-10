
function inspectReferrer(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	if(requestDetails.type != "main_frame" || !requestDetails.originUrl)
		return;
	console.log(requestDetails.url, requestDetails.originUrl);

	return { 
		url: requestDetails.url,
		originUrl: requestDetails.originUrl		
	};
}

function inspectVisit(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	console.log(requestDetails.url)
	return { 
		url: requestDetails.url
	};
}

function getUserAgent()
{
	return browser.runtime.getBrowserInfo();
}

function getAllInstalledPlugins()
{
	return browser.management.getAll();
}


function getPlatformInfo()
{
	return browser.runtime.getPlatformInfo();
}

function inspectBookmark(id, bookmark){
	console.log(bookmark);
	return {
		bookmark: bookmark
	}
}

browser.webNavigation.onBeforeNavigate.addListener(inspectVisit,{url: [{}]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer, {urls: ["<all_urls>"]});
browser.bookmarks.onCreated.addListener(inspectBookmark);