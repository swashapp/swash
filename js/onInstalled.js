import {Loader} from './Loader.js';
import {AllModules} from './modules.js';
browser.management.onInstalled.addListener((info) => {
    console.log(info.name + " " + info.version +  " was installed");
    console.log("Registering modules.");
    console.log("onInstalled.js: " + AllModules);
    Loader.install(AllModules);
});
