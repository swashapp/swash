function extractAccessToken(redirectUri) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1)
    return null;
  let params = new URLSearchParams(m[0].split("#")[1]);
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
			access_token: accessToken,
		},
		response_type: "json"
	}

  function checkResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.status != 200) {
        reject("Token validation error");
      }
      response.json().then((json) => {
        if (json.aud && (json.aud === config.apiConfig.client_id)) {
          resolve([accessToken,json]);
        } else {
          reject("Token validation error");
        }
      });
    });
  }

  return apiCall(config.apiConfig.validation_endpoint, req, accessToken).then(checkResponse);
}

function storeToken(data) {   
    console.log("saving access token", data);
    info = {
        tokenInfo: data[1],
    }
    info.tokenInfo.token = data[0];
    storeData(config.name, info);
    console.log("access token save done");    
}


function authorize(scope) {
	AUTH_URL =`${config.apiConfig.auth_url}?client_id=${config.apiConfig.client_id}&response_type=token&redirect_uri=${encodeURIComponent(config.apiConfig.redirect_url)}&state=345354345&scope=${encodeURIComponent(scope.join(' '))}`;
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  });
}

function getAccessToken(scope) {
  return authorize(scope).then(validateToken).then(storeToken);
  //return authorize(scope).then(storeToken);
}

function list_scopes(){
    return {
        "https://www.googleapis.com/auth/youtube": "Manage your YouTube account",
"https://www.googleapis.com/auth/youtube.force-ssl": "See, edit, and permanently delete your YouTube videos, ratings, comments and captions",
"https://www.googleapis.com/auth/youtube.readonly": "View your YouTube account",
"https://www.googleapis.com/auth/youtube.upload": "Manage your YouTube videos",
"https://www.googleapis.com/auth/youtubepartner": "View and manage your assets and associated content on YouTube",
"https://www.googleapis.com/auth/youtubepartner-channel-audit":	"View private information of your YouTube channel relevant during the audit process with a YouTube partner"
    }
}



//browser.webRequest.onBeforeRequest.addListener(validate, {urls: [`${config.apiConfig.redirect_url}*`]}, ["blocking"]);



/* TEST */
function test_getAccessToken(){
        return getAccessToken(["https://www.googleapis.com/auth/youtubepartner-channel-audit","https://www.googleapis.com/auth/youtube","https://www.googleapis.com/auth/youtube.force-ssl",
"https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtubepartner",]);
}


/*  TEST END */
