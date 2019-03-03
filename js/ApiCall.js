import {Utils} from './Utils.js';
import {AllModules} from './modules.js';
import {DataHandler} from './DataHandler.js';
import {StorageHelper} from './StorageHelper.js';

// TODO: handle ETAG
// TODO: handle batch requests
var ApiCall = (function() {
     
    var callbacks = {};
    
	function getCallBackURL(moduleName) {
		let extId = browser.runtime.id;
		//let cbURL = "https://" + moduleName + "." + sha256(extId) + ".authsaz.com";
        let cbURL = "https://callbacks.authsaz.com/" + sha256(extId) + "/" +moduleName;
		return cbURL;
	}
	
	async function isConnected(moduleName) {
		let modules = await StorageHelper.retrieveModules();
		for(var moduleN in modules) {
			var module = modules[moduleN]
			if(module.name == moduleName){
				if(module.access_token && module.access_token != "")
					return (true);
				return (false);
			}
		}
	}
    function start_oauth(moduleName) {
        StorageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
            if(module.name == moduleName){
				let auth_url = `${module.apiConfig.auth_url}?client_id=${module.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(module.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(module.apiConfig.scopes.join(' '))}`
				return browser.windows.create({
					url: auth_url,
                    type: "popup"
				  });
				/*browser.identity.launchWebAuthFlow({
                    interactive: true,
                    url: auth_url
                });*/
            }
        }});
    }
    
    function extractToken(details) {
		StorageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
			if(module.functions.includes("apiCall")){
				//let urlObj = new URL(details.url);
				if(details.url.startsWith(getCallBackURL(moduleN))){
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
                if(await validateToken(mds[m]))
                    return mds[m].access_token
            }
        }
    }
    
	function prepareMessage(response) {
		return response.json();
	}
	
    function purge_access_token(module){
        save_access_token(module,null);
        // TODO notify token has expired
    }
    
	function validateToken(module){
        apiCall(module.validate_token.endpoint, module.validate_token, module.access_token).then(module.validate_token.verifyResponse).then(data=> {
            return true;
        },reject=>{
            purge_access_token(module);
            return false;
        })
    }
    
	function apiCall(endpoint, apiInfo, access_token)
	{
		let url = endpoint + apiInfo.URI;
		let req = {
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
		let data = "";
		switch (apiInfo.content_type) {
			case "application/x-www-form-urlencoded":						
				data = Utils.serialize(apiInfo.params);
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
				data = Utils.serialize(apiInfo.params);

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
                module.apiCall.forEach(data=>{
                    if(data.is_enabled)
                        apiCall(module.apiConfig.api_endpoint, data, access_token).then(prepareMessage).then(msg =>{ send_message(module,data,msg)});
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
                "https://callbacks.authsaz.com/*"
			]
		};
		browser.webRequest.onBeforeRequest.addListener(extractToken, filter, ["blocking"]);
        //browser.tabs.onUpdated.addListener(extractToken_tabs, filter);
        callbacks[module.name] = setInterval(function(x){
            fetch_apis(module);
        },5000000);
    }
    
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module,
		start_oauth: start_oauth,
		getCallBackURL: getCallBackURL,
		isConnected: isConnected
    };
}());
export {ApiCall};