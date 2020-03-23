console.log("background.js");

import {allModules} from './modules.js';
import {browserUtils} from './browserUtils.js'
import {configManager} from './configManager.js'
import {storageHelper} from './storageHelper.js';

var objList = {}

async function dynamicImport() {
	return {
		storageHelper: (await import('./storageHelper.js')).storageHelper,
		databaseHelper: (await import('./databaseHelper.js')).databaseHelper,
		privacyUtils: (await import('./privacyUtils.js')).privacyUtils,
		apiCall: (await import('./functions/apiCall.js')).apiCall,
		loader: (await import('./loader.js')).loader,
		content: (await import('./functions/content.js')).content,
		dataHandler: (await import('./dataHandler.js')).dataHandler,
		pushStream: (await import('./push.js')).pushStream,
		context: (await import('./functions/context.js')).context,
		communityHelper: (await import('./communityHelper.js')).communityHelper,
		task: (await import('./functions/task.js')).task,
		pageAction: (await import('./pageAction.js')).pageAction,
		transfer: (await import('./functions/transfer.js')).transfer,
		onBoarding: (await import ('./onboarding/onBoarding.js')).onBoarding,
		memberManager: (await import ('./memberManager.js')).memberManager
	}
}

/* ***
	This function will invoke on:
	1. update firefox
	2. install add-on
	3. update add-on
*/
browser.runtime.onInstalled.addListener(async (info) => {
	// debugger;
	console.log("Start installing...")
	await configManager.importAll();
	if(Object.keys(objList).length == 0)
		objList = await dynamicImport();
	
	if (info.reason === "update" || info.reason === "install") {
		objList.onBoarding.isNeededOnBoarding().then((isNeeded) => {
			if (isNeeded)
				objList.onBoarding.openOnBoarding();
			else
				objList.loader.install(allModules, null).then(() => {
					objList.loader.reload()
				});
		});			
	}
});


configManager.loadAll().then(async () => {
	console.log("Start loading...")
	if(Object.keys(objList).length == 0)
		objList = await dynamicImport();
	/* Set popup menu for desktop versions */

	browserUtils.getPlatformInfo().then(info => {
		browserUtils.isMobileDevice().then(res => {
			if (res) {
				browser.browserAction.onClicked.addListener(async () =>
					browser.tabs.create({url: '/dashboard/index.html#/Settings',})
				);
			} else {
				browser.browserAction.setPopup({popup: 'popup/popup.html',});
			}
		})
	});

	/* ***
	Each content script, after successful injection on a page, will send a message to background script to request data.
	This part handles such requests.
	*/
	browser.runtime.onMessage.addListener((message, sender, sendResponse) => {

		if (sender.tab)
			message.params.push(sender.tab.id);
		sendResponse(objList[message.obj][message.func](...message.params));
	});



	/* ***
	If UI has changed a config in data storage, a reload should be performed.
	UI will modify data storage directly.
	*/
	//browser.storage.onChanged.addListener(loader.reload);

	/* ***
	After a successful load of add-on,
	the main loop will start.
	*/
	storageHelper.retrieveConfigs().then(confs => {
		if (confs) {
			objList.loader.reload();
			
		}
	});
	
	objList.memberManager.tryJoin();
	configManager.updateSchedule();	
})	