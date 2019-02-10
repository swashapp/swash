function inspectSearch(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	//top search
	var query = "";
	var pattern = /^https:\/\/www\.facebook\.com\/search\/top\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("q");
		return {
			query: query,
			type: "top"
		};
	}
	//Search query
	query = "";
	var pattern = /^https:\/\/www\.facebook\.com\/search\/str\/([^\/]*)\/.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 1) {
		query = res[1];	
		return {
			query: query,
			type: "str"
		};
	}
	//auto complete search
	pattern = /^https:\/\/www.facebook.com\/typeahead\/search\/facebar\/query\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("value");
		return {
			query: query,
			type: "facebar"
		};
	}
	
	//warn serach
	pattern = /^https:\/\/www\.facebook\.com\/search\/browse\/warm\/requestargs\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("query");
		return {
			query: query,
			type: "warm"
		};
	}
	
	//facebar survay
	pattern = /^https:\/\/www\.facebook\.com\/search\/facebar_survey\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("query");
		return {
			query: query,
			type: "facebar_survey"
		};
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
		url: requestDetails.url,
	};
}


browser.webRequest.onBeforeRequest.addListener(inspectSearch,{urls: ["*://www.facebook.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectVisit,{urls: ["*://www.facebook.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer,{urls: ["*://www.facebook.com/*"]});