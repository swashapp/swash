import {Loader} from './Loader.js';
console.log("Hello world!");
	browser.runtime.onMessage.addListener(notify);
    browser.runtime.onMessage.addListener(content_script_messages);

function content_script_messages(message,sender, sendResponse){
    if(message.type == "request_data"){
        sendResponse({data: Loader.load_content(message.url)});
    }
}


Loader.start();

function notify(message,sender, sendResponse) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("link.png"),
    "title": message.type,
    "message": JSON.stringify(message)
  });
    sendResponse({response: "Response from background script"});

}






var STREAM_ID = '************************'
var API_KEY = '**********************************'
var settings = {};
// Create the client and give the API key to use by default
var client = new StreamrClient({
  apiKey: API_KEY
})

// Wrap event generation and producion into this method
function produceNewEvent(msg) {
  
  // Produce the event to the Stream
  console.log("produceNewEvent ", msg);
  client.produceToStream(STREAM_ID, msg)
    .then(() => {
      console.log('Sent successfully: ' + JSON.stringify(msg))
    })
    .catch((err) => {
      console.errorlog(err)
    })
}





function tabs_onUpdated(tabId, changeInfo, tab){
    console.log("tabs_onUpdated", tabId, changeInfo, tab);
	if(tab.status == "complete")
	{
		var msg = {"action": "History", "wallet_id": settings.user.wallet_id, "email": settings.user.email, "url": tab.url, "title": tab.title}
		produceNewEvent(msg);
	}
}
function bookmark_onCreated(id, bookmark){
	console.log("bookmark_onCreated", bookmark);
	var msg = {"action": "bookmark", "wallet_id": settings.user.wallet_id, "email": settings.user.email, "bookmark": bookmark};
	produceNewEvent(msg);

	}

	
function inspectRequest(requestDetails) {
	console.log("inspectRequest", requestDetails);
	var searchParams = (new URL(requestDetails.url)).searchParams;
	var query = searchParams.get("q");
	if(query == null)
		query = searchParams.get("p");
	var msg = {"action": "search", "wallet_id": settings.user.wallet_id, "email": settings.user.email, "url": requestDetails.url, "Search": query};
	produceNewEvent(msg);
}
	
function bind(setting){
    console.log("Binding!", setting);
    try{
    // remove all listeners 
    browser.bookmarks.onCreated.removeListener(bookmark_onCreated);
    browser.tabs.onUpdated.removeListener(tabs_onUpdated);
    }catch(err){
        console.error(err);
    }
    // set new listener based on setting
    if(setting.browse.chk_bookmarks){
        console.log("setting.browse.chk_bookmarks");
        browser.bookmarks.onCreated.addListener(bookmark_onCreated);
    }
    if(setting.browse.chk_history){
        console.log("setting.browse.chk_history");
        browser.tabs.onUpdated.addListener(tabs_onUpdated);
    }
    //browser.history.onVisited.removeListener(history_onVisited);
    if(setting.browse.chk_search){
        console.log("setting.browse.chk_search");
        browser.webRequest.onBeforeRequest.addListener(inspectRequest,{urls: ["*://www.bing.com/search?*","*://search.yahoo.com/search*","*://www.google.com/search?*","*://search.aol.com/aol/search?*","*://www.ask.com/web?*"]});
    }	
}

function loadSetting(){
    browser.storage.sync.get("settings").then(storage => { settings =storage.settings;
        bind(settings);}
    );
}

browser.storage.onChanged.addListener(loadSetting);
loadSetting();