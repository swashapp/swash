console.log("DataHandler.js");
import {Utils} from './Utils.js';
import {filterUtils} from './filterUtils.js';
import {privacyUtils} from './privacyUtils.js';
import {StorageHelper} from './StorageHelper.js';
import {DatabaseHelper} from './DatabaseHelper.js';
import {stream} from './stream.js';

var DataHandler = (function() {
    'use strict';
    
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
		DatabaseHelper.removeMessage(msgId);
		//clearTimeout(msgId);
		//StorageHelper.removeMessage(msgId);	
	}
	
	async function sendDelayedMessages() {
		let confs = await StorageHelper.retrieveConfigs();
		let time = Number((new Date()).getTime()) - confs.delay*60000;
		let rows = await DatabaseHelper.getReadyMessages(time);
		for(let row of rows) {
			let message = row.message;
			delete message.origin;
			stream.produceNewEvent(message);
		}
		DatabaseHelper.removeReadyMessages(time);
	}
	
	async function sendData(message, delay) {
		if(delay) {
			DatabaseHelper.insertMessage(message);
			/*let id = setTimeout(function(){ 
				delete message.origin;
				stream.produceNewEvent(message);
				StorageHelper.removeMessage(id);
			}, 300000);
            StorageHelper.saveMessage(message, id);*/
		}
		else {
			delete message.origin;
			stream.produceNewEvent(message);        
		}		
	}
	
	
    async function prepareAndSend(message, module, delay, tabId) {
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
        console.log("DataHandler" + (Date()), message);		
		if(!message.origin)
			message.origin = "undetermined";
		let db = await StorageHelper.retrieveAll();
        let filters = db.filters;
        if(filterUtils.filter(message.origin, filters))
            return;
        let modules = db.modules;
        let configs = db.configs;
        let profile = db.profile;
		let privacyData = db.privacyData;
		let delay = configs.delay;
            
        message.identity = {};
        message.identity.uid = privacyUtils.identityPrivacy(configs.Id, modules[message.header.module].mId, modules[message.header.module].privacy_level) ;
        message.identity.walletId = profile.walletId;
        message.identity.email = profile.email;
        message.header.privacyLevel = modules[message.header.module].privacy_level;
        message.header.version = getVersion();   
        enforcePolicy(message, modules[message.header.module].mSalt, configs.salt, privacyData);
        prepareAndSend(message, modules[message.header.module], delay, tabId)
    }
    function enforcePolicy(message, mSalt, salt, privacyData) {
        /*
            message = {
                header: {
                    agent:  { name: "Firefox", vendor: "Mozilla", version: "65.0.2", buildID: "20190225143501" },
                    version: "1",
                    platform "win32",
                    module: "Amazon",
                    function: "Browsing",
                    collector: "search",
                    privacyLevel: 3
                }
                identity: {
                    walletId: "0x353d353433...",
                    email: "authsaz@gmail.com",
                    uid: "flerngokehfgofe..."                    
                }
                data: {
                    
                }
            }
        */
        

        let data = {};
        let schems = message.data.schems;       
        //var ptr = JsonPointer.noConflict();
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
        handle: handle,
		cancelSending: cancelSending,
		sendDelayedMessages: sendDelayedMessages,
        enforcePolicy: enforcePolicy
    };
}());
export {DataHandler};