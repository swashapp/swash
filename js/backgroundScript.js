import {pageAction} from './pageAction.js';
import {memberManager} from './memberManager.js';
import {loader} from './loader.js';
import {dataHandler} from './dataHandler.js';
import {storageHelper} from './storageHelper.js';
import {databaseHelper} from './databaseHelper.js';
import {privacyUtils} from './privacyUtils.js';
import {communityHelper} from './communityHelper.js';
import {allModules} from './modules.js';
import {apiCall} from './functions/apiCall.js';
import {content} from './functions/content.js';
import {context} from './functions/context.js';
import {task} from './functions/task.js';
import {transfer} from './functions/transfer.js';
import {pushStream} from './push.js';
import {browserUtils} from './browserUtils.js'
import {onBoarding} from './onboarding/onBoarding.js';

/* ***
This function will invoke on:
    1. update firefox
    2. install add-on
    3. update add-on
*/
browser.runtime.onInstalled.addListener((info) => {
    // debugger;
    if (info.reason === "update" || info.reason === "install") {
        onBoarding.isNeededOnBoarding().then((isNeeded) => {
            if (isNeeded)
                onBoarding.openOnBoarding();
            else
                loader.install(allModules, null).then(() => {
                    loader.reload()
                });
        });
    }
});

/* ***
Each content script, after successful injection on a page, will send a message to background script to request data.
This part handles such requests.
*/
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (sender.tab)
        message.params.push(sender.tab.id);
    let objList = {
        storageHelper: storageHelper,
        databaseHelper: databaseHelper,
        privacyUtils: privacyUtils,
        apiCall: apiCall,
        loader: loader,
        content: content,
        dataHandler: dataHandler,
        pushStream: pushStream,
        context: context,
        task: task,
        communityHelper: communityHelper,
        pageAction: pageAction,
        transfer: transfer,
        onBoarding: onBoarding,
    };
    sendResponse(objList[message.obj][message.func](...message.params));
});


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
        loader.reload();
    }
});
let mgmtInterval = setInterval(memberManager.immediateJoinStrategy, 6000);


