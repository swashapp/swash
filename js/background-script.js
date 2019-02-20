console.log("background-script.js");
import {Loader} from './Loader.js';
import {DataHandler} from './DataHandler.js';
import {notify} from './utils.js';
import {AllModules} from './modules.js';


browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " " + info.version +  " was installed");
    console.log("Registering modules.");
    console.log("onInstalled.js: " + AllModules);
    Loader.install(AllModules);
});



browser.runtime.onMessage.addListener(DataHandler.handle);
browser.runtime.onMessage.addListener(content_script_messages);

function content_script_messages(message,sender, sendResponse){
    if(message.type == "request_data"){
        sendResponse({data: Loader.load_content(message.url)});
    }
}


Loader.start();





/*

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
*/

browser.storage.onChanged.addListener(Loader.start);
 