console.log("background-script.js");

import {Loader} from './Loader.js';
import {DataHandler} from './DataHandler.js';
import {StorageHelper} from './StorageHelper.js';
import {AllModules} from './modules.js';
import {ApiCall} from './ApiCall.js';
import {Content} from './Content.js';
import {Survey} from './Survey.js';
import {pushStream} from './push.js';

/* ***
This function will invoke on:
    1. update firefox
    2. install add-on
    3. update add-on
*/
browser.runtime.onInstalled.addListener((info) => {
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
    message.tabId = sender.tab.id
	let objList = {
		StorageHelper: StorageHelper,
		ApiCall: ApiCall,
		Loader: Loader,
		Content: Content,
        DataHandler: DataHandler,
        pushStream: pushStream,
		Survey: Survey
	}
	sendResponse(objList[message.obj][message.func](...message.params));
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
StorageHelper.retrieveConfigs().then(confs => {
	Loader.load();
})

 