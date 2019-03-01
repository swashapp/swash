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

    async function handle(message) {
        console.log("DataHandler", message);
        let modules = await StorageHelper.retrieveModules();
		//message.header.agent = getUserAgent();
		//message.header.version = 
        message.header.privacyLevel = modules[message.header.module].privacy_level;
        enforcePolicy(message);
		stream.produceNewEvent(message);        
    }
    function enforcePolicy(message) {
        /*
            message = {
                header: {
                    agent: "firefox",
                    version: "62.1",
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
        
        let moduleName = message.header.module;
        let data = message.data.out;
        let schems = message.data.schems;       
        //var ptr = JsonPointer.noConflict();
        var ptr = JsonPointer;
        for(let d of schems) {
            let jpointers = JSONPath.JSONPath({path: d.jpath, resultType: "pointer" ,json: data});
            for (let jp of jpointers) {
                var val = ptr.get(data, jp);
                val = privacyUtils.objectPrivacy(val, d.type, message.header.privacyLevel)
                ptr.set(data, jp, val);               
            }
        }
        message.data = data;
        return message;
    }
    
    return {
        handle: handle
    };
}());
export {DataHandler};