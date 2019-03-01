import {AllModules} from './modules.js';
import {DataHandler} from './DataHandler.js';
import {StorageHelper} from './StorageHelper.js';

// TODO: handle ETAG
// TODO: handle batch requests
var ApiCall = (function() {
     
    var callbacks = {};
    
	function getCallBackURL(moduleName) {
		let extId = browser.runtime.id;
		let cbURL = "https://" + moduleName + "." + sha256(extId) + ".authsaz.com";
		return cbURL;
	}
    function start_oauth(moduleName) {
        StorageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
            if(module.name == moduleName){
				let auth_url = `${module.apiConfig.auth_url}?client_id=${module.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(module.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(module.apiConfig.scopes.join(' '))}`
                browser.identity.launchWebAuthFlow({
                    interactive: true,
                    url: auth_url
                });
            }
        }});
    }
    
    function extractToken(details) {
		StorageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
			if(module.functions.includes("apiCall")){
				let urlObj = new URL(details.url);
				if(module.apiConfig.redirect_url == urlObj.origin){
					var rst = details.url.match(module.apiConfig.access_token_regex);
					if(rst){
						save_access_token(module, rst[1]);
						browser.tabs.remove(details.tabId);
					}
				}
			}
		}});
		
		return null;               
	}
    function save_access_token(module,token) {
        var data = {};
		data[module.name] = {};
        data[module.name].access_token = token;
        StorageHelper.updateModules(data);
    }
    
    async function get_access_token(module){
        var mds = await StorageHelper.retrieveModules()
        for(var m in mds){
            if(mds[m].name == module.name){
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
        StorageHelper.retrieveModules().then(modules => {for(var module in modules) {
			if(modules[module].functions.includes("apiCall")){
					unload_module(modules[module]);
			}
        }});
    }

    function load(){
        StorageHelper.retrieveModules().then(modules => {for(var module in modules) {
			if(modules[module].functions.includes("apiCall")){
				if(modules[module].is_enabled)
					load_module(modules[module]);
			}
        }});
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
                });
            } 
        });
    }
    
    function unload_module(module){
		if(callbacks[module.name])
			clearInterval(callbacks[module.name]);
    }

    function load_module(module){
		let crURL = getCallBackURL(module.name);
		var filter = {
			urls: [
			crURL + "/*"
			]
		};
		browser.webRequest.onBeforeRequest.addListener(extractToken, filter);
        callbacks[module.name] = setInterval(function(x){
            fetch_apis(module);
        },50000);
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module,
		start_oauth: start_oauth,
		getCallBackURL: getCallBackURL
    };
}());
export {ApiCall};