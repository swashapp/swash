console.log("background-script.js");
import {pageAction} from './pageAction.js';
import {memberManager} from './memberManager.js';
import {Loader} from './Loader.js';
import {DataHandler} from './DataHandler.js';
import {StorageHelper} from './StorageHelper.js';
import {DatabaseHelper} from './DatabaseHelper.js';
import {privacyUtils} from './privacyUtils.js';
import {communityHelper} from './communityHelper.js';
import {AllModules} from './modules.js';
import {ApiCall} from './functions/ApiCall.js';
import {Content} from './functions/Content.js';
import {Context} from './functions/Context.js';
import {Task} from './functions/Task.js';
import {pushStream} from './push.js';



/* ***
This function will invoke on:
    1. update firefox
    2. install add-on
    3. update add-on
*/
browser.runtime.onInstalled.addListener((info) => {
	if(info.reason == "update" || info.reason == "install")
		Loader.install(AllModules).then(() => {Loader.reload()});
});

/* ***
Each content script, after successful injection on a page, will send a message to background script to request data.
This part handles such requests.
*/
browser.runtime.onMessage.addListener((message,sender, sendResponse) =>{
    if(sender.tab)
		message.params.push(sender.tab.id);
	let objList = {
		StorageHelper: StorageHelper,
		DatabaseHelper: DatabaseHelper,
		privacyUtils: privacyUtils,
		ApiCall: ApiCall,
		Loader: Loader,
		Content: Content,
        DataHandler: DataHandler,
        pushStream: pushStream,
		Context: Context,
		Task: Task,
		communityHelper: communityHelper,
		pageAction: pageAction
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
	if (confs) {
		Loader.reload();
	}
})
let mgmtInterval = setInterval(memberManager.immediateJoinStrategy, 6000);

