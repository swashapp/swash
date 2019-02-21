console.log("background-script.js");

import {Loader} from './Loader.js';
import {DataHandler} from './DataHandler.js';
import {AllModules} from './modules.js';

/* ***
This function will invoke on:
    1. update firefox
    2. install add-on
    3. update add-on
*/
browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " " + info.version +  " was installed");
    console.log("Registering modules.");
    console.log("onInstalled.js: " + AllModules);
    Loader.install(AllModules);
});

/* ***
Each content script, after successful injection on a page, will send a message to background script to request data.
This part handles such requests.
*/
browser.runtime.onMessage.addListener((message,sender, sendResponse) =>{
    if(message.type == "request_data"){
        sendResponse({data: Loader.load_content(message.url)});
    }
});

/* ***
Content scripts, will sends their captured data to background-script using messaging.
in this part, a handler is assigined to handle the messages.
*/
browser.runtime.onMessage.addListener((message,sender, sendResponse) =>{
    if(message.type == "content"){
        DataHandler.handle(message);
    }
});

/* ***
If UI has changed a config in data storage, a reload should be performed.
UI will modify data storage directly.
*/
//browser.storage.onChanged.addListener(Loader.reload);

/* ***
After a successful load of add-on,
the main loop will start.
*/
Loader.start();
 