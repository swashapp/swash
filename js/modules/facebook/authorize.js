console.log("modules/facebook/authorize.js");
import {Facebook} from './manifest.js';
Facebook.apiConfig = {
    redirect_url = browser.identity.getRedirectURL(),
    client_id: "355488065290314",
    api_endpoint: "https://graph.facebook.com/v3.2",
    auth_url: 'https://www.facebook.com/v3.2/dialog/oauth'
}

Facebook.auth_init = function(redirect_url){
    var handle = function (requestDetails) {
        browser.tabs.remove(requestDetails.tabId);
        return {cancel: true};
    }
    browser.webRequest.onBeforeRequest.addListener(handle, {urls: [`${redirect_url}*`]}, ["blocking"]);
}

Facebook.auth_flow = function (apiConfig, scope) {    
    AUTH_URL =`${apiConfig.auth_url}?display=popup&client_id=${apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(scope.join(' '))}`;
    function extractAccessToken(redirectUri) {
        let m = redirectUri.match(/[#?](.*)/);
        if (!m || m.length < 1)
            return null;
        let params = new URLSearchParams(m[1].split("#")[1]);
        const accessToken = params.get("access_token");
        if (!accessToken)
            throw "Authorization failure";
        return accessToken
    }
    
    return browser.identity.launchWebAuthFlow({
        interactive: true,
        url: AUTH_URL
    }).then(extractAccessToken);
    //return authorize(scope).then(validateToken).then(handler);
}

Facebook.validate_token = {
    name: "validate_token",
    description: "",
    method: "GET",
    URI: "/debug_token",
    content_type: "application/x-www-form-urlencoded",
    permissions: ["email","user_birthday","user_hometown","user_location"],
    params:{
        input_token: accessToken,
    },
    response_type: "json",
    verifyResponse(response) {
    return new Promise((resolve, reject) => {
          if (response.status != 200) {
            reject("Token validation error");
          }
          response.json().then((json) => {
            if (json.data.app_id && (json.data.app_id === Facebook.apiConfig.client_id)) {
              resolve([accessToken,json]);
            } else {
              reject("Token validation error");
            }
          });
        });
    }
}

function fbBatchCall(apiInfoList)
{
	let gettingItem = retrieveData(config.name);
	gettingItem.then(item => {
		access_token = item[config.name].tokenInfo.token;
		endpoint = config.apiConfig.api_endpoint;
		var batch = [];
		for(apiInfo of apiInfoList)
		{
			switch(apiInfo.method)
			{
				case "GET":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI.concat("?", serialize(apiInfo.params))			
					}	
					break;
				case "POST":
					item = {
						method: apiInfo.method,
						relative_url: apiInfo.URI,
						body: serialize(apiInfo.params)
					}
					break;
				default:
			}
			batch.push(item);			
		}
		aInfo = {
			method: "POST",
			URI: "/",
			content_type: "application/x-www-form-urlencoded",
			params: {
				batch: JSON.stringify(batch)
			}
		}
		apiCall(endpoint, aInfo, access_token).then(verifyBatchResponse).then(resp => console.log(resp));				
	})	
}

function verifyBatchResponse(response) {
	return new Promise((resolve, reject) => {
		if (response.status != 200) {
			reject("Token validation error");
		}
		response.json().then((json) => {				
			resolve(json.data);
		});
	});	
}