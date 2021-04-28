import {filterUtils} from './filterUtils.js';
import {privacyUtils} from './privacyUtils.js';
import {storageHelper} from './storageHelper.js';
import {databaseHelper} from './databaseHelper.js';
import {utils} from './utils.js';
import {stream} from './stream.js';
import {configManager} from './configManager.js';
import {browserUtils} from './browserUtils.js'
import {swashApiHelper} from './swashApiHelper.js'


let dataHandler = (function() {
    'use strict';
    let streams = {}
	let streamConfig;
    
	
	function init() {
		streamConfig = configManager.getConfig('stream')
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
			try{
				streams[message.header.category].produceNewEvent(message);
			}
			catch (err) {
				`failed to produce new event because of: ${err.message}`
			}
		}
		await databaseHelper.removeReadyMessages(time);
	}
	
	async function sendData(message, delay) {
		if(delay) {
			await databaseHelper.insertMessage(message);			
		}
		else {
			delete message.origin;
			streams[message.header.category].produceNewEvent(message);        
		}		
	}
	
	
    async function prepareAndSend(message, module, delay, tabId) {
        if(!streams[message.header.category])
            streams[message.header.category] = stream(streamConfig[module.category].streamId);
		if(module.context){
			let bct_attrs = module.context.filter(function(ele,val){return (ele.type==="browser" && ele.is_enabled)});
			if(bct_attrs.length > 0) {
				for(let ct of bct_attrs){
					switch(ct.name) {
						case "agent":
							message.header.agent = await browserUtils.getUserAgent();
							break;
						case "installedPlugins":
							message.header.installedPlugins = await browserUtils.getAllInstalledPlugins();
							break;
						case "platform":
							message.header.platform = await browserUtils.getPlatformInfo();
							break;
						case "language":
							message.header.language = browserUtils.getBrowserLanguage();
							break;
					}
				}
			}

			
			let cct_attrs = module.context.filter(function(ele,val){return (ele.type==="content" && ele.is_enabled) });
			            
			if(cct_attrs.length > 0 && tabId) {
				var connectPort = browser.tabs.connect(
				  tabId,
				  {name: "content-attributes"}
				);            
				connectPort.onMessage.addListener(async function(attrs) {
					for(let attrName of Object.keys(attrs)) {
						message.header[attrName] = attrs[attrName];
					}
					await sendData(message, delay);
				  
				});
				return true;
			}
			
		}
		await sendData(message, delay);
		return false;
    }
    
    async function handle(message, tabId) {  
		message.header.id = utils.uuid();      
		if(!message.origin)
			message.origin = "undetermined";
		let db = await storageHelper.retrieveAll();
		//Return if Swash is disabled or the origin is excluded or module/collector is disabled
        let filters = db.filters;
        let modules = db.modules;
		let collector = modules[message.header.module][message.header.function].items.find(element => {return(element.name ===  message.header.collector)})
        if(!db.configs.is_enabled
			|| filterUtils.filter(message.origin, filters)
			|| !modules[message.header.module].is_enabled
			|| !collector.is_enabled)
            return;
        let configs = db.configs;
        let profile = db.profile;
		let privacyData = db.privacyData;
		let delay = configs.delay;

		message.header.category = modules[message.header.module].category;
		message.header.privacyLevel = modules[message.header.module].privacyLevel;
		message.header.anonymityLevel = modules[message.header.module].anonymityLevel;
        message.header.version = browserUtils.getVersion();
		
        message.identity = {};
        message.identity.uid = privacyUtils.anonymiseIdentity(configs.Id, message, modules[message.header.module]);		
		let country = '';
		profile.country ? country = profile.country : country = (await swashApiHelper.getUserCountry());
		message.identity.country = country;
		message.identity.gender = profile.gender;
		message.identity.age = profile.age;
		message.identity.income = profile.income;
		message.identity.agent = await browserUtils.getUserAgent();
		message.identity.platform = await browserUtils.getPlatformInfo();
		message.identity.language = browserUtils.getBrowserLanguage();

		
        enforcePolicy(message, privacyData);
        prepareAndSend(message, modules[message.header.module], delay, tabId)
    }
    function enforcePolicy(message, privacyData) {		
        let data = message.data.out;
        let schems = message.data.schems;               
        var ptr = JsonPointer;
        for(let d of schems) {
            let jpointers = JSONPath.JSONPath({path: d.jpath, resultType: "pointer" ,json: message.data.out});
            if(jpointers)
            {
                for (let jp of jpointers) {
                    var val = ptr.get(message.data.out, jp);
                    val = privacyUtils.anonymiseObject(val, d.type, message, privacyData)
                    ptr.set(data, jp, val, true);               
                }                
            }
        }
        message.data = data;
        return message;
    }
    
    return {
		init,
        handle,
		cancelSending,
		sendDelayedMessages,
        enforcePolicy
    };
}());
export {dataHandler};
