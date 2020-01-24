import {utils} from '../utils.js';
import {allModules} from '../modules.js';
import {dataHandler} from '../dataHandler.js';
import {storageHelper} from '../storageHelper.js';
import {browserUtils} from '../browserUtils.js';
// TODO: handle ETAG
// TODO: handle batch requests
var apiCall = (function() {
	
    const API_CALL_INTERVAL = 15*1000;
	const DELAY_BETWEEN_CALLS = 1*1000;
		
    var callbacks = [];
	var extId = "authsaz@gmail.com"
	
	function initModule(module){
		if(module.functions.includes("apiCall"))
			module.apiConfig.redirect_url = getCallBackURL(module.name)
	}
    
	function getCallBackURL(moduleName) {
        let cbURL = "https://callbacks.swashapp.io/" + sha256(extId) + "/" +moduleName.toLowerCase();
		return cbURL;
	}
	
	async function isConnected(moduleName) {
		let modules = await storageHelper.retrieveModules();
		for(var moduleN in modules) {
			var module = modules[moduleN]
			if(module.name == moduleName){
				if(module.access_token && module.access_token != "")
					return (true);
				return (false);
			}
		}
	}
    function startOauth(moduleName) {
		var filter = {
				urls: [
					"https://callbacks.swashapp.io/*"
				]
			};
		if(!browser.webRequest.onBeforeRequest.hasListener(extractToken))
			browser.webRequest.onBeforeRequest.addListener(extractToken, filter);			
        storageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
            if(module.name == moduleName){
				let auth_url = `${module.apiConfig.auth_url}?client_id=${module.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(module.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(module.apiConfig.scopes.join(' '))}`
				return browserUtils.isMobileDevice().then((result) =>{
					if(result) {
						return browser.tabs.create({
							url: auth_url
						});
					}
					return browser.windows.create({
						url: auth_url,
						type: "popup"
					});
				});
            }
        }});
	}
    
    function extractToken(details) {
		storageHelper.retrieveModules().then(modules => {for(var moduleN in modules) {
            var module = modules[moduleN]
			if(module.functions.includes("apiCall")){
				//let urlObj = new URL(details.url);
				if(details.url.startsWith(getCallBackURL(moduleN))){
					var rst = details.url.match(module.apiConfig.access_token_regex);
					if(rst){
						saveAccessToken(module, rst[1]);
					}
                    browser.tabs.remove(details.tabId);
				}
			}
		}});
		
		return null;               
	}
    function saveAccessToken(module,token) {
        var data = {};
		data[module.name] = {};
        data[module.name].access_token = token;
        storageHelper.updateModules(data);
    }
    
    function getAccessToken(moduleName){
        return storageHelper.retrieveModules().then(mds => {
            for(var m in mds){
                if(mds[m].name == moduleName){
                    if(validateToken(mds[m]))
                        return {token: mds[m].access_token, module: mds[m]}
                    return {token: "", module: mds[m]}
                }                
            }
            return {token: "", module: {}}
        })
        
    }
    
	function prepareMessage(response,module,data) {
		try {
			return response.json();			
		}
		catch {
			return {};
		}
	}
    
    function getEtag(response){
        return response.headers.get("ETag");
    }
    
    function saveEtags(module_name, eTags){
        storageHelper.retrieveModules().then(modules=>{        
            var data = {};
            data[module_name] = {};
            data[module_name].apiCall = modules[module_name].apiCall            
            for(let aapi of data[module_name].apiCall){
                aapi.etag = eTags[aapi.name]
            }
            storageHelper.updateModules(data);
            // TODO: review when concorent saveEtags called, what will done!
        });
    }
	
    function purgeAccessToken(module){
        saveAccessToken(module,null);
        // TODO notify token has expired
    }
    
	function validateToken(module){
        if(module.access_token){
            let apiInfo = module.validate_token
            apiInfo.params= {};
            apiInfo.params[apiInfo.token_param_name] = module.access_token
                
            return apiCall(module.validate_token.endpoint, apiInfo, module.access_token).then(response=> {
                if (response.status != 200) {
                    purgeAccessToken(module);
                    return false;
                }
                return response.json().then((json) => {
                    let jpointers = JSONPath.JSONPath({path: module.validate_token.required_jpath, json: json});
                    if (jpointers.length >0) {
                      return true;
                    } else {
                        purgeAccessToken(module);                        
                        return false;
                    }
                }).catch(error => {
					purgeAccessToken(module);
				});
            }).catch(error => {
				purgeAccessToken(module);
				});
        }
        return false;
        
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
				data = utils.serialize(apiInfo.params);
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
				data = utils.serialize(apiInfo.params);

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
        storageHelper.retrieveModules().then(modules => {for(var module in modules) {
			if(modules[module].functions.includes("apiCall")){
					unloadModule(modules[module]);
			}
        }});
    }

    function load(){
        storageHelper.retrieveModules().then(modules => {for(var module in modules) {
			if(modules[module].functions.includes("apiCall")){
					loadModule(modules[module]);
			}
        }});
    }
    
    function sendMessage(module,data, msg){
        dataHandler.handle({
                    origin: module.apiConfig.api_endpoint + data.URI,
                    header:{
                        function: "apiCall",
                        module: module.name,
                        collector: data.name                              
                    },
                    data: {
						out: msg,
						schems: data.schems
                    }
                })
    }
    
    function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }
    
    function fetchApis(moduleName){
        var etags = {}
        getAccessToken(moduleName).then(resp => {
            if(resp.token){
				let i = 0;
                resp.module.apiCall.forEach((data)=>{                    
                    if(data.is_enabled){
                        var s = setTimeout(function(){
                                callbacks[moduleName].apiCalls = utils.arrayRemove(callbacks[moduleName].apiCalls, s);
                                apiCall(resp.module.apiConfig.api_endpoint, data, resp.token)
                                    .then(q=> {
                                        let et = getEtag(q);
                                        etags[data.name] = et
                                        return prepareMessage(q) 
                                    })
                                    .then(msg =>{ sendMessage(resp.module,data,msg)});
                        }, DELAY_BETWEEN_CALLS*i);
						i++;
                        callbacks[moduleName].apiCalls.push(s);
                    }
                });
            } 
        }).then(a=>{
            if(!utils.isEmpty(etags))
                saveEtags(resp.module.name, etags)
        });
    }
    
    function unloadModule(module){
		if(module.functions.includes("apiCall")) {
			if(callbacks[module.name]) {
				clearInterval(callbacks[module.name].interval);
                if(callbacks[module.name].apiCalls) {
                    for(let s of callbacks[module.name].apiCalls)
                        clearTimeout(s);	
                }
            }
			callbacks[module.name] = {};
		}
	}

    function loadModule(module){
		unloadModule(module);
		if(module.is_enabled){
			if(module.functions.includes("apiCall")) {			
				fetch_apis(module.name);
				let crURL = getCallBackURL(module.name);			
				callbacks[module.name] = {interval: -1, apiCalls: []};
				callbacks[module.name].interval = setInterval(function(x){
					fetchApis(module.name);
				},API_CALL_INTERVAL);
			}			
		}
    }
    
    return {
		initModule,
        load,
        unload,
        unloadModule,
        loadModule,
		startOauth,
		getCallBackURL,
		isConnected
    };
}());
export {apiCall};