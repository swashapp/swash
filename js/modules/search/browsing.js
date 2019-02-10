
function inspectBingSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	//console.log(requestDetails.url);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("q");
	if(!query)
		return;
	//
	var category = "";
	var pattern = /https:\/\/www\.bing\.com\/((([^\/\?\;]*)\/search)|(shop|maps|search))\?.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 4) {
			category = res[1].split("/")[0];
			if(category)
				console.log(query, category);
				return {
					query: query,
					category: category
				};				
	}	
	return;
	
}

function inspectYahooSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("p");
	if(!query)
		return;

	//
	var category = "";
	var pattern = /https:\/\/((.*)\.)?search\.yahoo\.com\/.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 2) {
		category = res[2]? res[2]: "web";
		console.log(query, category);
		return {
				query: query,
				category: category
			};
			
	}
	return;
}

function inspectGoogleSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("q");
	if(!query)
		return;	
	var c = searchParams.get("tbm");
	var category = c? c:"web";
	console.log(query, category);
	return {
			query: query,
			category: category
		};
}

function inspectAolSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("q");
	if(!query)
		return;
	//
	var category = "";
	var pattern = /https:\/\/search\.aol\.com\/aol\/([^\/\?\;]*)[\?|\;].*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 1) {
		category = res[1];			
	}
	console.log(query, category);
	return {
			query: query,
			category: category
		};

}

function inspectAskSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("q");
	if(!query)
		return;	
	//
	var category = "";
	var pattern = /https:\/\/www\.ask\.com\/(web|youtube)\?.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 1) {
		category = res[1];			
	}
	console.log(query, category);
	return {
			query: query,
			category: category
		};
}

function inspectBaiduSearch(requestDetails) {
	//console.log(`inspectRequest: ${config.name} `, requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;	
	var query = searchParams.get("wd");
	if(!query)
		query = searchParams.get("word");

	if(!query)
		return;
	//
	var category;
	var pattern = /http[s]?:\/\/(.*)\.baidu\.com\/.*/;
	var res = requestDetails.url.match(pattern);
	if(res!= null && res.length > 1) {
		category = res[1];			
	}

	console.log(query, category);
	return {
			query: query,
			category: category
		};
}


browser.webRequest.onBeforeRequest.addListener(inspectBingSearch,{urls: ["*://www.bing.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectYahooSearch,{urls: ["*://*.yahoo.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectGoogleSearch,{urls: ["*://www.google.com/search?*"]});
browser.webRequest.onBeforeRequest.addListener(inspectAolSearch,{urls: ["*://search.aol.com/aol/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectAskSearch,{urls: ["*://www.ask.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectBaiduSearch,{urls: ["*://*.baidu.com/*"]});