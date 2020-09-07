import {utils} from './utils.js'
var privacyUtils = (function() {
    'use strict';
    var basicIdentity = "";
    var moduleIdentity = {};
    var categoryIdentity = {};
    
    function anonymiseIdentity(id, message, module) {
        basicIdentity = basicIdentity ? basicIdentity : sha256(id);                

        switch(message.header.anonymityLevel) {
            case 0:
                return basicIdentity;
            case 1:
                categoryIdentity[module.category] = categoryIdentity[module.category] ? categoryIdentity[module.category] : sha256(`${id}${module.category}`);
                return sha256(`${basicIdentity}${categoryIdentity[module.category]}`)
            case 2:
                moduleIdentity[module.name] = moduleIdentity[module] ? moduleIdentity[module] : sha256(`${id}${module.name}`);
                return sha256(`${basicIdentity}${moduleIdentity[module.name]}`);
            case 3:
                return sha256(`${basicIdentity}${message.header.id}`);
            default:
                return sha256(`${basicIdentity}${message.header.id}`);
    
        }
    }
    
	
    function anonymiseUrl(url, message) {
        let urlObj = new URL(url);
        switch(message.header.privacyLevel) {
            case 0:            
                return urlObj.href;
            case 1:
                for (let item of urlObj.searchParams)
                    urlObj.searchParams.set(item[0], "")
                return urlObj.href;
            case 2:
                var path = urlObj.pathname.split("/");
                for (let item in path) {
                    if(path[item]) {
                        path[item] = sha256(path[item]).substring(0,path[item].length);
                    }
                }
                path = path.join("/");                
                var retUrl = urlObj.origin + path;
                return retUrl;            
            case 3:
                return  urlObj.origin;
            default:
                return  urlObj.origin;
        }
    }
        
    function anonymiseTime(time, message) {
        var date = new Date();
        let date2;
        date.setTime(time);
        switch(message.header.privacyLevel) {
            case 0:        
                return date.getTime();
            case 1:
                date.setHours(0, 0, 0, 0)
                return date.getTime();
            case 2:
                date2 = new Date(0);
                date2.setFullYear(date.getFullYear(), date.getMonth())
                return date2.getTime();
            case 3:
                date2 = new Date(0);
                date2.setFullYear(date.getFullYear(), 0)
                return date2.getTime();
			default:
                return date.getTime();
        }
    }

    function anonymisetTxt(text, message, privacyData) {
        var retText = JSON.stringify(text);
        switch(message.header.privacyLevel) {
            case 0:        
                for(var i = 0; i < privacyData.length ; i++) {                 
                    retText = retText.replace(new RegExp("\\b" + privacyData[i].value + "\\b", 'ig'), (new Array(privacyData[i].value.length + 1).join('*')));
                }
                break;
            case 1:
                for(var i = 0; i < privacyData.length ; i++) {                 
                    retText = retText.replace(new RegExp("\\b" + privacyData[i].value + "\\b", 'ig'), "");
                }
                break;
            case 2:
                for(var i = 0; i < privacyData.length ; i++) {                 
                    retText = retText.replace(new RegExp("\\b" + privacyData[i].value + "\\b", 'ig'), "");
                }
                break;
            case 3:
                for(var i = 0; i < privacyData.length ; i++) {
					let res = retText.match(new RegExp("\\b" + privacyData[i].value + "\\b", 'ig'));
                    if(res) {
                        retText = "\"\"";
                        break;
                    }
                }            
                break;
			default:
                return "";
        }
		return JSON.parse(retText);
    }
    
    function anonymiseUserInfo(user, message) {
        var retUserInfo = user;
        
        switch(message.header.privacyLevel) {
            case 0:        
                return retUserInfo;
            case 1:
                retUserInfo = sha256(user);
                return retUserInfo;
            case 2:
                retUserInfo = sha256(user + utils.uuid());
                return retUserInfo;
            case 3:
                return "";            
			default:
                return "";
        }
        
    }

	
    function anonymiseUserId(id, message) {
        var retId = id;
        
        switch(message.header.privacyLevel) {
            case 0:        
                return retId;
            case 1:
                retId = sha256(id);
                return retId;
            case 2:
                retId = sha256(id + utils.uuid());            
                return retId;
            case 3:        
                return "";
			default:
                return "";
        }
        
    }
	
	
    function anonymiseUserAttr(userAttr, message, salt) {
        var retAttr = userAttr;
        
        switch(message.header.privacyLevel) {
            case 0:        
                return retAttr;
            case 1:
                retAttr = sha256(userAttr);
                return retAttr;
            case 2:
                retAttr = sha256(userAttr + utils.uuid());            
                return retAttr;
            case 3:    
                return "";            
			default:
                return "";
        }        
    }

    function anonymiseTimeString(timeStr, message) {
        var date = new Date(timeStr);
        let newTime = timePrivacy(date.getTime(), message);
        date.setTime(newTime)
        return date.toString();
    }
    
    function anonymiseObject(object, objectType, message, privacyData){
		if(!object)
            return object;
        switch(objectType) {
            case "userInfo" :
                return anonymiseUserInfo(object, message);
            case "userAttr" :
                return anonymiseUserAttr(object, message);
            case "timeString" :
                return anonymiseTimeString(object, message);
            case "url" :
                return anonymiseUrl(object, message);
            case "time" :
                return anonymiseTime(object, message);
            case "text" :
                return anonymisetTxt(object, message, privacyData);
            case "id" :
                return anonymiseUserId(object, message);
			default:
                return object;
        }
    }
    
    return {
        anonymiseObject,
        anonymiseIdentity
    };
}());
export {privacyUtils};    