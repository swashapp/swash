
function getVideoStatus(){
    var duration = document.getElementsByClassName("ytp-time-duration")[0].innerHTML
    var current = document.getElementsByClassName("ytp-time-current")[0].innerHTML
    return {
        duration: duration,
        current: current
    }
}

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
			type: name,
            videoStatus: getVideoStatus()
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
			type: type,
            videoStatus: getVideoStatus()
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

browser.webRequest.onBeforeRequest.addListener(inspectAjax,{urls: ["*://www.youtube.com/*"]},["requestBody"]);
browser.webRequest.onBeforeRequest.addListener(inspectSearch,{urls: ["*://www.youtube.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectVisit,{urls: ["*://www.youtube.com/*"]});
browser.webRequest.onBeforeRequest.addListener(inspectReferrer,{urls: ["*://www.youtube.com/*"]});