function inspectRequest(requestDetails) {
	console.log(`inspectRequest: ${config.name} `, requestDetails);
	//top search
	var query = "";
	var pattern = /^https:\/\/www\.facebook\.com\/search\/top\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("q");
		return query;
	}
	//Search query
	query = "";
	var pattern = /^https:\/\/www\.facebook\.com\/search\/str\/([^\/]*)\/.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 1) {
		query = res[1];	
		return query;
	}
	//auto complete search
	pattern = /^https:\/\/www.facebook.com\/typeahead\/search\/facebar\/query\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("value");
		return query;
	}
	
	//warn serach
	pattern = /^https:\/\/www\.facebook\.com\/search\/browse\/warm\/requestargs\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("query");
		return query;
	}
	
	//facebar survay
	pattern = /^https:\/\/www\.facebook\.com\/search\/facebar_survey\/.*/;
	if(pattern.test(requestDetails.url))
	{
		var searchParams = (new URL(requestDetails.url)).searchParams;
		var query = searchParams.get("query");
		return query;
	}
	
	return null;
}

browser.webRequest.onBeforeRequest.addListener(inspectRequest,{urls: ["*://www.facebook.com/*"]});