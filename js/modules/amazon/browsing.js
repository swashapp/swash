
function inspectSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	//top search
	var query = "";
	var pattern = /^https:\/\/www\.amazon\.com\/s\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("field-keywords");
		var url = searchParams.get("url");
		return {
			query: query,
			category: url
		}
	}
	return null;
}

function inspectReferrer(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	return { 
		url: requestDetails.url,
		originUrl: requestDetails.originUrl		
	};
}

function inspectVisit(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	return { 
		url: requestDetails.url
	};
}

browser.webRequest.onBeforeRequest.addListener(inspectSearch,{urls: ["*://www.amazon.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer,{urls: ["*://www.amazon.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectVisit,{urls: ["*://www.amazon.com/*"]});
