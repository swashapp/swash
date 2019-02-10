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
	req = {
		method: apiInfo.method,
		headers:{
            'Content-Type': apiInfo.content_type
		}			
	}
    if(apiInfo.headers){
        for (var key in apiInfo.headers) {
           if (apiInfo.headers.hasOwnProperty(key)) {
              req.headers[key]= apiInfo.headers[key];
           }
        }
    }
    if(access_token){
        if(apiInfo.bearer){
            req.headers["Authorization"] = "Bearer ".concat(access_token)
        }else{
            apiInfo.params.access_token = access_token;
        }
    }
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