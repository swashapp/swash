import {configManager} from './configManager.js'
import {storageHelper} from './storageHelper.js';
import {databaseHelper} from './databaseHelper.js';
import {communityHelper} from './communityHelper.js';
import {dataHandler} from './dataHandler.js';
import {utils} from './utils.js';
import {functions} from './functions.js';
import {pageAction} from './pageAction.js';
import {internalFilters} from './internalFilters.js';
import {ssConfig} from './manifest.js';
import {browserUtils} from './browserUtils.js';
import {memberManager} from './memberManager.js';

var loader = (function() {
    'use strict';
    var dbHelperInterval;

    async function isDbCreated(db) {
        return !(db == null || Object.keys(db).length === 0);
    }

    async function install(allModules, db) {
        if (db == null)
            db = await storageHelper.retrieveAll();

        if (!await isDbCreated(db)) {
            db = {modules: {}, configs: {}, profile: {}, filters: [], wallets: [], privacyData: [], tasks: {}, onBoardings: {}};
            db.configs.Id = utils.uuid();
            db.configs.salt = utils.uuid();
            db.configs.delay = 2;
            communityHelper.createWallet();
            db.profile.encryptedWallet = await communityHelper.getEncryptedWallet(db.configs.salt);
            utils.jsonUpdate(db.configs, ssConfig);
        }
        try {
            //wallets added from version 1.0.3
            if (!db.wallets)
                db.wallets = [];

			//onBoarding added from version 1.0.8
            if (!db.onBoardings)
                db.onBoardings = {};
			//from version 1.0.9 move wallet to profile object for safety
			if(db.configs.version <= '1.0.8' && db.configs.encryptedWallet)
				db.profile.encryptedWallet = db.configs.encryptedWallet;
			
            db.configs.version = ssConfig.version;
            let newFilters = db.filters.filter(function (f, index, arr) {
                return (!f.internal);
            });
            for (let f of internalFilters) {
                newFilters.push(f)
            }
            db.filters = newFilters;
            for (let moduleName in allModules) {
				let module = allModules[moduleName];
                if (!db.modules[module.name] || module.version !== db.modules[module.name].version) {
                    db.modules[module.name] = {};
                    module.mId = utils.uuid();
                    module.mSalt = utils.uuid();
                    for (let func of functions) {
                        await func.initModule(module);
                    }
                    utils.jsonUpdate(db.modules[module.name], module);
                }
            }
			utils.jsonUpdate(db.configs, configManager.getAllConfigs())
        } catch (exp) {
            console.error(exp);
        }
        return storageHelper.storeAll(db);
    }

	function onInstalled() {
		reload();
		configManager.updateSchedule();
		memberManager.tryJoin();	
	}

	
    function changeIconOnUpdated(tabId, changeInfo, tabInfo) {
        if (!changeInfo.url || !tabInfo.active)
            return;
        pageAction.loadIcons(tabInfo.url);
    }

    function changeIconOnActivated(activeInfo) {
        browser.tabs.get(activeInfo.tabId).then((tabInfo) => {
            if (tabInfo.url) {
                pageAction.loadIcons(tabInfo.url);
            }
        })
    }

    function init(isEnabled) {
		if(isEnabled) {			
			if(!browser.tabs.onUpdated.hasListener(changeIconOnUpdated))	
				browser.tabs.onUpdated.addListener(changeIconOnUpdated);
			if(!browser.tabs.onActivated.hasListener(changeIconOnActivated))	
				browser.tabs.onActivated.addListener(changeIconOnActivated)
			browser.tabs.query({active: true, currentWindow: true}).then(activeTab => {
				if(activeTab.length > 0)
					pageAction.loadIcons(activeTab[0].url);				
			});	
		}
		else {			
			if(browser.tabs.onUpdated.hasListener(changeIconOnUpdated))	
				browser.tabs.onUpdated.removeListener(changeIconOnUpdated);
			if(browser.tabs.onActivated.hasListener(changeIconOnActivated))	
				browser.tabs.onActivated.removeListener(changeIconOnActivated);
			browser.tabs.query({active: true, currentWindow: true}).then(activeTab => {
				if(activeTab.length > 0)
					pageAction.loadIcons(activeTab[0].url);				
			});
		}			
	}
	
	function loadFunctions() {
		for(let func of functions){
			func.load();
		}
	}
	
	function unloadFunctions() {
		for(let func of functions){
			func.unload();
		}
	}
	
	function functionsLoadModule(module){
		for(let func of functions){
			func.loadModule(module);
		}
	}
	
	function functionsUnLoadModule(module){
		for(let func of functions){
			func.unloadModule(module);
		}
	}
	
    function start(){
		let config = {is_enabled: true}
		storageHelper.updateConfigs(config).then(() => {
			init(true);
			loadFunctions();			
		})	
    }
    

    function stop(){		
		let config = {is_enabled: false};
		storageHelper.updateConfigs(config).then(() => {
			init(false);
			unloadFunctions();			
		})
    }

	function restart() {
		stop();
		start();
    }
    
	async function load() {		
		storageHelper.retrieveAll().then(async (db) => {
			dbHelperInterval = setInterval(function(){
				databaseHelper.init();
				dataHandler.sendDelayedMessages();
				}, 10000);
			let x = await communityHelper.loadWallet(db.profile.encryptedWallet, db.configs.salt);
			if(db.configs.is_enabled) {
				init(true);
				loadFunctions();
			} 
			else {
				init(false);
				unloadFunctions();
			}			
		})		
	}
	
	async function reload() {		
		storageHelper.retrieveAll().then(async (db) => {
            clearInterval(dbHelperInterval);
            dbHelperInterval = setInterval(function () {
                databaseHelper.init();
                dataHandler.sendDelayedMessages();
            }, 10000);
            init(false);
            let x = await communityHelper.loadWallet(db.profile.encryptedWallet, db.configs.salt);
            unloadFunctions();
            if (db.configs.is_enabled) {
                init(true);
                loadFunctions();
            }
        })
    }

    function configModule(moduleName, settings) {
        return storageHelper.saveModuleSettings(moduleName, settings).then(x => {
            storageHelper.retrieveAll().then(db => {
                let module = db.modules[moduleName];
                functionsUnLoadModule(module);
                if (db.configs.is_enabled)
                    functionsLoadModule(module);
            });
        });
    }

    function register(module) {
        var data = {modules: {}}
        data.modules[module.name] = module
        data.modules[module.name].mId = utils.generateUUID();
        storageHelper.updateModules(data);
    }

    function unregister(module) {
        storageHelper.removeModules(module.name);
    }

    function update(module) {
        var data = {modules: {}}
        data.modules[module.name] = module
        storageHelper.updateModules(data);
    }

    function installation_status(module) {
        var modules = storageHelper.retrieveModules();
        if (!modules[module.name]) {
            return "new"
        } else {
            if (module.dead === 1) {
                return "dead"
            }
            if (module.version > modules[module.name].version) {
                return "version"
            }
            if (module.version === modules[module.name].version) {
                return "unchanged"
            }
        }
        return "unknown";
    }

    return {
        isDbCreated,
        install,
		onInstalled,
        start,
        stop,
        load,
        reload,
        restart,
        configModule
    };
}());
export {loader};
