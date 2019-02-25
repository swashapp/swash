import {AllModules} from '../../modules.js';

var ApiCall = (function() {
     
    var callbacks = {};
    
    
    function storeToken(data) {
        info = {
            tokenInfo: data[1].data
        }
        info.tokenInfo.token = data[0];
        storeData(config.name, info);
        console.log("access token save done");    
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
		
		return fetch(url, req).then(apiInfo.verifyResponse);
	}
    
    function unload(){        
        AllModules.forEach(module => {
            unload_module(module);
        });
    }

    function load(){
        AllModules.forEach(module => {
            load_module(module);
        });
    }
    
    function unload_module(module){
        module.api_list.forEach(data=>{
            clearInterval(callbacks[module.name + "_" + data.name]);
        }
    }

    function load_module(module){
        module.api_list.forEach(data=>{
            callbacks[module.name + "_" + data.name] = setInterval(function(x){
                
            },5000);
        }
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());