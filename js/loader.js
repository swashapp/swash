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
import {apiCall} from "./functions/apiCall.js";
import {pushStream} from "./push.js"
import {onBoarding} from "./onBoarding.js"


var loader = (function() {
    'use strict';
    var dbHelperInterval;
	var configs;
	var modules;
	var intervalId = 0;

	
	function initConfs() {
		configs = configManager.getAllConfigs();
		modules = configManager.getAllModules();
	}

    async function isDbCreated(db) {
        return !(db == null || Object.keys(db).length === 0);
    }

    async function install() {
        
        let db = await storageHelper.retrieveAll();		

        if (!await isDbCreated(db)) {
			console.log("Creating new DB");
            db = {modules: {}, configs: {}, profile: {}, filters: [], wallets: [], privacyData: [], tasks: {}, onBoardings: {}};
            db.configs.Id = utils.uuid();
            db.configs.salt = utils.uuid();
            db.configs.delay = 2;
            await communityHelper.createWallet();
            db.profile.encryptedWallet = await communityHelper.getEncryptedWallet(db.configs.salt);
            utils.jsonUpdate(db.configs, ssConfig);
        }
        try {
			//backup old database
			db._backup = JSON.stringify(db);
			
            //wallets added from version 1.0.3
            if (!db.wallets)
                db.wallets = [];

			//onBoarding added from version 1.0.8
            if (!db.onBoardings)
                db.onBoardings = {};
			//from version 1.0.9 move wallet to profile object for safety
			console.log(`Update Swash from version ${db.configs.version} to ${ssConfig.version}`);
			if(db.configs.version <= '1.0.8' && db.configs.encryptedWallet) {
				console.log(`moving private key from configs to profile`);
				db.profile.encryptedWallet = db.configs.encryptedWallet;
			}
			
            db.configs.version = ssConfig.version;
			
			//keeping defined filters and updating internal filters
			console.log(`Updating exculde urls`);
            let newFilters = db.filters.filter(function (f, index, arr) {
                return (!f.internal);
            });
            for (let f of internalFilters) {
                newFilters.push(f)
            }
            db.filters = newFilters;
			
			//updating modules
			console.log(`Updating modules`);
			db.modules = await onModulesUpdated();
			
			//updating configurations
			utils.jsonUpdate(db.configs, configs)
        } catch (exp) {
            console.error(exp);
        }
        return storageHelper.storeAll(db);
    }

	
	
	function onInstalled() {
		reload();
		updateSchedule();
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

	
	async function onModulesUpdated() {
		let dbModules = await storageHelper.retrieveModules();
		if(!dbModules)
			dbModules = {};
		for (let moduleName in modules){
			let module = modules[moduleName];
			if (!dbModules[module.name] || module.version > dbModules[module.name].version) {
				console.log(`Module ${module.name} updated to ${module.version}`);
				module.mId = utils.uuid();
				module.mSalt = utils.uuid();
				for (let func of functions) {
					await func.initModule(module);
				}
				dbModules[module.name] = module;
			}
		}
		return dbModules;
	}
	
	
	function onConfigsUpdated() {
		pushStream.init();
		memberManager.init();
		dataHandler.init();
		communityHelper.init();
		onBoarding.init();
		apiCall.init();
		initConfs();
	}
	
	async function onUpdatedAll() {		
		console.log("Storing updated configs");
		onConfigsUpdated();
		await storageHelper.updateData("configs", configs);		
		
		console.log("Storing updated modules");				
		let dbModules = await onModulesUpdated();
		await storageHelper.storeData("modules", dbModules);
	}
	
	
	async function updateSchedule() {
		async function update() {
			await configManager.updateAll();
			await onUpdatedAll();
		}
		if(intervalId > 0)
			clearInterval(intervalId);
		await update();		
		intervalId = setInterval(update, configs.manifest.updateInterval)
	}
	
	
    return {
		initConfs,
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
