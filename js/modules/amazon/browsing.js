
function inspectSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	//top search
	var query = "";
	var pattern = /^https:\/\/www\.amazon\.com\/s\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("field-keywords");
		if(!query)
			query = searchParams.get("k");
		if(!query)
			return;
		var url = searchParams.get("url");
		console.log(query, url);
		return {
			query: query,
			category: url
		}
	}
	return null;
}

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

browser.webNavigation.onBeforeNavigate.addListener(inspectSearch,{url: [{hostContains: "www.amazon.com"}]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer,{urls: ["*://www.amazon.com/*"]});
browser.webNavigation.onBeforeNavigate.addListener(inspectVisit,{url: [{hostContains: "www.amazon.com"}]});
