console.log("modules/youtube/authorize.js");
import {Youtube} from './manifest.js';

// TODO: remove scopes that are not necessary
Youtube.apiConfig = {
            client_id: "279095781364-1q6ki5adn4ufvfu0689hh3pl8u1upqoi.apps.googleusercontent.com",
            api_endpoint: "https://www.googleapis.com/youtube/v3",
            auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
            access_token_regex: "access_token=([^&]*)",
            scopes: [   "https://www.googleapis.com/auth/youtube",
                        "https://www.googleapis.com/auth/youtube.force-ssl",
                        "https://www.googleapis.com/auth/youtube.readonly",
                        "https://www.googleapis.com/auth/youtube.upload",
                        "https://www.googleapis.com/auth/youtubepartner",
                        "https://www.googleapis.com/auth/youtubepartner-channel-audit"
                        ]
        }
Youtube.validate_token = {
    name: "validate_token",
    description: "",
    method: "GET",
    endpoint: "https://www.googleapis.com/oauth2/v3",
    URI: "/tokeninfo",
    token_param_name:"key",
    content_type: "application/x-www-form-urlencoded",
    response_type: "json",
    required_jpath:"$.expires_in",
}
/*
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



/ * TEST * /
function test_getAccessToken(){
        return getAccessToken(["https://www.googleapis.com/auth/youtubepartner-channel-audit","https://www.googleapis.com/auth/youtube","https://www.googleapis.com/auth/youtube.force-ssl",
"https://www.googleapis.com/auth/youtube.readonly","https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtubepartner",]);
}


/ *  TEST END */
