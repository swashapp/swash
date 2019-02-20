console.log("Utils.js");
var Utils = (function() {
    'use strict';
    
    function notify(message) {
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/surf48.png"),
        "title": message.module + ":" + message.source,
        "message": JSON.stringify(message)
      });
    }

function jsonUpdate(src, newObj) {
    for (var prop in newObj) { 
        var val = newObj[prop];
        if (val != null && typeof val == "object") {// this also applies to arrays or null!
			if(Array.isArray(val)) {
				src[prop] = val;
			}
			else {
				if(!src[prop])
					src[prop] = {};	
				jsonUpdate(src[prop], val);
			}
        }
        else
            src[prop] = val;
        
    }
        
}

function wildcard(input, wc) {
    function regExpEscape (s) {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\$&');
    }
	var regex = new RegExp('^' + wc.split(/\*+/).map(regExpEscape).join('.*') + '$');
	if(!input.match(regex))
		return null;
	return input;
}

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
    
    return {
        jsonUpdate: jsonUpdate,
        wildcard: wildcard,
        notify: notify
    };
}());
export {Utils};