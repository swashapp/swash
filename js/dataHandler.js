console.log("dataHandler.js");
import {filterUtils} from './filterUtils.js';
import {privacyUtils} from './privacyUtils.js';
import {storageHelper} from './storageHelper.js';
import {databaseHelper} from './databaseHelper.js';
import {stream} from './stream.js';
import {streamConfig} from './streamConfig.js'

var dataHandler = (function() {
    'use strict';
    var streams = {}
	function getUserAgent()
    {
		if(typeof browser.runtime.getBrowserInfo === "function")
			return browser.runtime.getBrowserInfo();
		return navigator.userAgent;
    }

    function getAllInstalledPlugins()
    {
        return browser.management.getAll();
    }

	function getBrowserLanguage()
    {
        return navigator.language;
    }
	
    function getPlatformInfo()
    {
        return browser.runtime.getPlatformInfo();
    }
    
	async function getProxyStatus() {
		let proxySetting = await browser.proxy.settings.get({});
		return {httpProxyAll: proxySetting.value.httpProxyAll, proxyDNS: proxySetting.value.proxyDNS, proxyMode: proxySetting.value.mode};
	}
    
	function getVersion(){
        return browser.runtime.getManifest().version;
    }
	
    async function getScreenshot() {
		let img = "";
		if(typeof browser.tabs.captureTab === "function")
			img = await browser.tabs.captureTab();
		return img;
    }
    
	function cancelSending(msgId) {
		databaseHelper.removeMessage(msgId);
		//clearTimeout(msgId);
		//storageHelper.removeMessage(msgId);	
	}
	
	async function sendDelayedMessages() {
		let confs = await storageHelper.retrieveConfigs();
		let time = Number((new Date()).getTime()) - confs.delay*60000;
		let rows = await databaseHelper.getReadyMessages(time);
		for(let row of rows) {
			let message = row.message;
			delete message.origin;
			streams[message.header.module].produceNewEvent(message);
		}
		databaseHelper.removeReadyMessages(time);
	}
	
	async function sendData(message, delay) {
		if(delay) {
			databaseHelper.insertMessage(message);			
		}
		else {
			delete message.origin;
			streams[message.header.module].produceNewEvent(message);        
		}		
	}
	
	
    async function prepareAndSend(message, module, delay, tabId) {
        if(!streams[message.header.module])
            streams[message.header.module] = stream(streamConfig[module.name].streamId, streamConfig[module.name].apiKey);
		if(module.context){
			let bct_attrs = module.context.filter(function(ele,val){return (ele.type=="browser" && ele.is_enabled)});
			if(bct_attrs.length > 0) {
				for(let ct of bct_attrs){
					switch(ct.name) {
						case "agent":
							message.header.agent = await getUserAgent();
							break;
						case "installedPlugins":
							message.header.installedPlugins = await getAllInstalledPlugins();
							break;
						case "platform":
							message.header.platform = await getPlatformInfo();
							break;
						case "screenshot":
							message.header.screenshot = await getScreenshot();
							break;        
						case "language":
							message.header.language = getBrowserLanguage();
							break;
						case "proxyStatus":
							message.header.proxyStatus = await getProxyStatus();
					}
				}
			}

			
			let cct_attrs = module.context.filter(function(ele,val){return (ele.type=="content" && ele.is_enabled) });			
			            
			if(cct_attrs.length > 0 && tabId) {
				var connectPort = browser.tabs.connect(
				  tabId,
				  {name: "content-attributes"}
				);            
				connectPort.onMessage.addListener(function(attrs) {
					for(let attrName of Object.keys(attrs)) {
						message.header[attrName] = attrs[attrName];
					}
					sendData(message, delay);
				  
				});
				return true;
			}
			
		}
		sendData(message, delay);
		return false;
    }
    
    async function handle(message, tabId) {        
		if(!message.origin)
			message.origin = "undetermined";
		let db = await storageHelper.retrieveAll();
        let filters = db.filters;
        if(filterUtils.filter(message.origin, filters))
            return;
        let modules = db.modules;
        let configs = db.configs;
        let profile = db.profile;
		let privacyData = db.privacyData;
		let delay = configs.delay;
            
        message.identity = {};
        message.identity.uid = privacyUtils.identityPrivacy(configs.Id, modules[message.header.module].mId, configs.privacyLevel*2).id ;
        //message.identity.walletId = profile.walletId;
        //message.identity.email = profile.email;
        message.header.privacyLevel = configs.privacyLevel;
        message.header.version = getVersion();   
        enforcePolicy(message, modules[message.header.module].mSalt, configs.salt, privacyData);
        prepareAndSend(message, modules[message.header.module], delay, tabId)
    }
    function enforcePolicy(message, mSalt, salt, privacyData) {
		message.header.privacyLevel *=2;
        let data = {};
        let schems = message.data.schems;               
        var ptr = JsonPointer;
        for(let d of schems) {
            let jpointers = JSONPath.JSONPath({path: d.jpath, resultType: "pointer" ,json: message.data.out});
            if(jpointers)
            {
                for (let jp of jpointers) {
                    var val = ptr.get(message.data.out, jp);
                    val = privacyUtils.objectPrivacy(val, d.type, message, mSalt, salt, privacyData)
                    ptr.set(data, jp, val, true);               
                }                
            }
        }
        message.data = data;
        return message;
    }
    
    return {
        handle,
		cancelSending,
		sendDelayedMessages,
        enforcePolicy
    };
}());
export {dataHandler};