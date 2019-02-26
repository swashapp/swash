import {AllModules} from '../../modules.js';
import {DataHandler} from './DataHandler.js';
import {StorageHelper} from './StorageHelper.js';

// TODO: handle ETAG
// TODO: handle batch requests
var ApiCall = (function() {
     
    var callbacks = {};
    
    function save_access_token(module,token) {
        var data = {modules: {}}
        data.modules[module.name].access_token = token;
        StorageHelper.updateModules(data);
    }
    
    async function get_access_token(module){
        var mds = await StorageHelper.retrieveModules()
        for(var m of mds){
            if(m.name == module.name){
                return m.access_token
            }
        }
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
    
    function send_message(module,data, msg){
        DataHandler.handle({
                    header:{
                        function: "apiCall",
                        module: module.name,
                        collector: data.name                              
                    },
                    data: {
						out: {
							msg
						},
						schems: data.schems
                    }
                })
    }
    
    function fetch_apis(module){
        get_access_token(module).then(access_token => {
            if(access_token){
                module.api_list.forEach(data=>{
                    if(data.is_enabled)
                        apiCall(module.apiConfig.api_endpoint, data, access_token).then(data.verifyResponse).then(msg =>{ send_message(module,data,msg)});
                }
            } 
        });
    }
    
    function unload_module(module){
        clearInterval(callbacks[module.name]);
    }

    function load_module(module){
        callbacks[module.name] = setInterval(function(x){
            fetch_apis(module);
        },5000);
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module
    };
}());