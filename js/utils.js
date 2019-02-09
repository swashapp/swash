function serialize(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function apiCall(endpoint, apiInfo, access_token)
{
	url = endpoint + apiInfo.URI;
	if(access_token)
		apiInfo.params.access_token = access_token;
	switch (apiInfo.content_type) {
		case "application/x-www-form-urlencoded":						
			data = serialize(apiInfo.params);
			break;
		case "application/json":
			data = JSON.stringify(apiInfo.params);			
			break;
		case "multipart/form-data":
			var formData = new FormData();
			for(var p in apiInfo.params)
				if (apiInfo.params.hasOwnProperty(p)) {
					formData.append(encodeURIComponent(p), encodeURIComponent(apiInfo.params[p]));
				}
				data = formData;
			break;
		default:
			data = serialize(apiInfo.params);

	} 
	req = {
		method: apiInfo.method,
		headers:{
		'Content-Type': apiInfo.content_type
		}			
	}
	switch (apiInfo.method) {
		case "GET":
			url = url.concat("?", data);
			break;
		case "POST":
			req.body = data;
		break;
	}
	
	return fetch(url, req);
}

function storeData(module, info)
{
	data = {};
	data[module] = info;
    browser.storage.sync.set(data);	
}

function retrieveData(module)
{
    return browser.storage.sync.get(module);
}