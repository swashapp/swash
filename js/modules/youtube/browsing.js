
function inspectAjax(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	var query = "";
	var pattern = /^https:\/\/www\.youtube\.com\/service_ajax.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var name = searchParams.get("name");
        var query = requestDetails.requestBody.formData.sej
		return {
			query: query,
			type: name
		};
	}
	
	return null;
}

function inspectSearch(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	var query = "";
	var pattern = /^https:\/\/www\.youtube\.com\/results.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("search_query");
        type = "top"
        if(query.startsWith("#") || query.startsWith("%23")){
            type = "hashTag"
        }
		return {
			query: query,
			type: type
		};
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
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	return { 
		url: requestDetails.url,
	};
}

browser.webRequest.onBeforeRequest.addListener(inspectAjax,{urls: ["*://www.youtube.com/*"]},["requestBody"]);
browser.webRequest.onBeforeRequest.addListener(inspectSearch,{urls: ["*://www.youtube.com/*"]});
browser.webNavigation.onBeforeNavigate.addListener(inspectVisit,{url: [{hostContains: "www.youtube.com"}]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer,{urls: ["*://www.youtube.com/*"]});