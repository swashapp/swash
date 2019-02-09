function extractAccessToken(redirectUri) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1)
    return null;
  let params = new URLSearchParams(m[1].split("#")[1]);
  return params.get("access_token");
}

function validate(requestDetails) {
    redirectURL = requestDetails.url;
    validateToken(redirectURL);
    browser.tabs.remove(requestDetails.tabId);
    return {cancel: true};  
}
function validateToken(redirectURL) {
  const accessToken = extractAccessToken(redirectURL);
  if (!accessToken) {
    throw "Authorization failure";
  }
  req = {
		method: "GET",
		URI: config.apiConfig.validation_uri,
		content_type: "application/x-www-form-urlencoded",
		params:{
			input_token: accessToken,
		},
		response_type: "json"
	}

  function checkResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.status != 200) {
        reject("Token validation error");
      }
      response.json().then((json) => {
        if (json.data.app_id && (json.data.app_id === config.apiConfig.client_id)) {
          resolve([accessToken,json]);
        } else {
          reject("Token validation error");
        }
      });
    });
  }

  return apiCall(config.apiConfig.api_endpoint, req, accessToken).then(checkResponse);
}

function storeToken(data) {   
    console.log("saving access token", data);
    info = {
        tokenInfo: data[1].data
    }
    info.tokenInfo.token = data[0];
    storeData(config.name, info);
    console.log("access token save done");    
}


function authorize(scope) {
	AUTH_URL =`${config.apiConfig.auth_url}?display=popup&client_id=${config.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(config.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(scope.join(' '))}`;
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  });
}

function getAccessToken(scope) {
  return authorize(scope).then(validateToken).then(storeToken);
}

browser.webRequest.onBeforeRequest.addListener(validate, {urls: [`${config.apiConfig.redirect_url}*`]}, ["blocking"]);