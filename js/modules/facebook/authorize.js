/* exported getAccessToken */

const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = "355488065290314";
const SCOPES = ["user_likes", "email", "user_friends"];
const AUTH_URL =`https://www.facebook.com/v3.2/dialog/oauth\
?display=popup&\
client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&state=345354345\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;


const VALIDATION_BASE_URL="https://graph.facebook.com/debug_token";

function extractAccessToken(redirectUri) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1)
    return null;
  let params = new URLSearchParams(m[1].split("#")[1]);
  return params.get("access_token");
}

function validate2(requestDetails) {
    redirectURL = requestDetails.url;
    validate(redirectURL);
    browser.tabs.remove(requestDetails.tabId);
    return {cancel: true};  
}
function validate(redirectURL) {
  const accessToken = extractAccessToken(redirectURL);
  if (!accessToken) {
    throw "Authorization failure";
  }
  const validationURL = `${VALIDATION_BASE_URL}?input_token=${accessToken}&access_token=${accessToken}`;
  const validationRequest = new Request(validationURL, {
    method: "GET"
  });

  function checkResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.status != 200) {
        reject("Token validation error");
      }
      response.json().then((json) => {
        if (json.data.app_id && (json.data.app_id === CLIENT_ID)) {
          resolve([accessToken,json]);
        } else {
          reject("Token validation error");
        }
      });
    });
  }

  return fetch(validationRequest).then(checkResponse);
}

function storeData(data) {   
    console.log("saving access token", data);
    info = {
        facebook: {
            tokenInfo: data[1].data
        }
    }
    info.facebook.tokenInfo.token = data[0]
    browser.storage.sync.set(info);
    console.log("access token save done");    
}


function authorize() {
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: AUTH_URL
  });
}

function getAccessToken() {
  return authorize().then(validate).then(storeData);
}

browser.webRequest.onBeforeRequest.addListener(validate2, {urls: [`${REDIRECT_URL}*`]}, ["blocking"]);