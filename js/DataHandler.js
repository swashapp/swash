console.log("DataHandler.js");
import {Utils} from './Utils.js';
import {filterUtils} from './filterUtils.js';
import {privacyUtils} from './privacyUtils.js';
import {StorageHelper} from './StorageHelper.js';
import {stream} from './stream.js';

var DataHandler = (function() {
    'use strict';
    
	function getUserAgent()
    {
        return browser.runtime.getBrowserInfo();
    }

    function getAllInstalledPlugins()
    {
        return browser.management.getAll();
    }


    function getPlatformInfo()
    {
        return browser.runtime.getPlatformInfo();
    }
    
    function getVersion(){
        return browser.runtime.getManifest().version;
    }
	
	function cancelSending(msgId) {
		clearTimeout(msgId);
		StorageHelper.removeMessage(msgId);		
	}
	
	async function sendData(message, delayedSend) {
		if(delayedSend) {
			let id = setTimeout(function(){ 
				delete message.origin;
				stream.produceNewEvent(message);
				StorageHelper.removeMessage(id);
			}, 60000);
			let msg = {};
			msg[id] = message;
			await StorageHelper.storeData("messages", msg);			
		}
		else {
			delete message.origin;
			stream.produceNewEvent(message);        
		}
		
	}
    async function handle(message) {
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
		let delayedSend = configs.delayedMessage;
            
		message.header.agent = await getUserAgent();
        message.header.version = getVersion();   
        message.header.platform = await getPlatformInfo();
        message.identity = {};
        message.identity.uid = configs.Id;
        message.identity.walletId = profile.walletId;
        message.identity.email = profile.email;
        message.header.privacyLevel = modules[message.header.module].privacy_level;
        enforcePolicy(message, modules[message.header.module].mSalt, configs.salt, privacyData);
		sendData(message, delayedSend);
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
		cancelSending: cancelSending
    };
}());
export {DataHandler};