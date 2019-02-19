console.log("background-script.js");
import {Loader} from './Loader.js';
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


browser.storage.onChanged.addListener(Loader.start);
 