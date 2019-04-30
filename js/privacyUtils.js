var privacyUtils = (function() {
    'use strict';
    
    
    function identityPrivacy(id, mId, privacyLevel) {
        var date = new Date();
        switch(privacyLevel) {
            case 0:            
                return sha256(id);
            case 1:
                return sha256(mId);
            case 2:
                date.setHours(0, 0, 0, 0)
                return sha256(mId + date.getTime());
            case 3:
                date.setMinutes(0, 0, 0);
                return sha256(mId + date.getTime());
            case 4:
                return sha256(mId + date.getTime());
            default:
                return sha256(mId + date.getTime());
        }
                
    }

    function urlPrivacy(url, privacyLevel, mSalt, salt) {
        let urlObj = new URL(url);
        var searchParams = (new URL(url)).searchParams;
        var query = searchParams.get("field-keywords");    
        switch(privacyLevel) {
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
                        path[item] = sha256(path[item] + salt).substring(0,path[item].length);
                    }
                }
                path = path.join("/");                
                var retUrl = urlObj.origin + path;
                return retUrl;
            case 3:
                var path = urlObj.pathname.split("/");
                for (let item in path) {
                    if(path[item]) {
                        path[item] = sha256(path[item] + mSalt).substring(0,path[item].length);
                    }
                }
                path = path.join("/");                
                var retUrl = urlObj.origin + path;
                return retUrl;
            case 4:
                return  urlObj.origin;			
            default:
                return  urlObj.origin;
        }
    }
        
    function timePrivacy(time, privacyLevel, mSalt, salt) {
        var date = new Date();
        let date2;
        date.setTime(time);
        switch(privacyLevel) {
            case 0:        
                return date.getTime();
            case 1:
                date.setMinutes(0, 0, 0);
                return date.getTime();
            case 2:
                date.setHours(0, 0, 0, 0)
                return date.getTime();
            case 3:
                date2 = new Date(0);
                date2.setFullYear(date.getFullYear(), date.getMonth())
                return date2.getTime();
            case 4:
                date2 = new Date(0);
                date2.setFullYear(date.getFullYear(), date.getMonth())
                return date2.getTime();

			default:
                return date.getTime();
        }
    }

    function textPrivacy(text, privacyLevel, mSalt, salt, privacyData) {
        var retText = text;
        switch(privacyLevel) {
            case 0:        
                return retText;
            case 1:
                for(var i = 0; i < privacyData.length ; i++) {  
					retText = retText.replace(new RegExp(privacyData[i].value, 'g'), (sha256(privacyData[i].value + salt).substring(0,privacyData[i].value.length)));                    
                }
                return retText;
            case 2:
                for(var i = 0; i < privacyData.length ; i++) {                 
                    retText = retText.replace(new RegExp(privacyData[i].value, 'g'), (new Array(privacyData[i].value.length + 1).join('*')));
                }
                return retText;
            case 3:
                for(var i = 0; i < privacyData.length ; i++) {                 
                    retText = retText.replace(new RegExp(privacyData[i].value, 'g'), "");
                }
                return retText;
            case 4:
                for(var i = 0; i < privacyData.length ; i++) {
                    if(retText.indexOf(privacyData[i].value) > 0 ) {
                        retText = "";
                        break;
                    }
                }            
                return retText;

			default:
                return "";
        }
    }
    
    function userInfoPrivacy(user, privacyLevel, mSalt, salt) {
        var retUserInfo = user;
        
        switch(privacyLevel) {
            case 0:        
                return retUserInfo;
            case 1:
                retUserInfo = sha256(user);
                return retUserInfo;
            case 2:
                retUserInfo = sha256(user + salt);            
                return retUserInfo;
            case 3:
                retUserInfo = sha256(user + mSalt);            
                return retUserInfo;            
            case 4:
                return "";

			default:
                return "";
        }
        
    }

	
    function idPrivacy(id, privacyLevel, mSalt, salt) {
        var retId = id;
        
        switch(privacyLevel) {
            case 0:        
                return retId;
            case 1:
                retId = sha256(id);
                return retId;
            case 2:
                retId = sha256(id + salt);            
                return retId;
            case 3:
                retId = sha256(id + mSalt);            
                return retId;            
            case 4:
                return "";

			default:
                return "";
        }
        
    }
	
	
    function userAttrPrivacy(userAttr, privacyLevel, mSalt, salt) {
        var retAttr = userAttr;
        
        switch(privacyLevel) {
            case 0:        
                return retAttr;
            case 1:
                retAttr = sha256(userAttr);
                return retAttr;
            case 2:
                retAttr = sha256(userAttr + salt);            
                return retAttr;
            case 3:
                retAttr = sha256(userAttr + mSalt);            
                return retAttr;            
            case 4:
                return "";
			default:
                return "";
        }
        
    }

    function timeStringPrivacy(timeStr, privacyLevel, mSalt, salt) {
        var date = new Date(timeStr);
        let newTime = timePrivacy(date.getTime(), privacyLevel, mSalt, salt);
        date.setTime(newTime)
        return date.toString();
    }
    
    function objectPrivacy(object, objectType, message, mSalt, salt, privacyData){
        let privacyLevel = message.header.privacyLevel;
		if(!object)
            return object;
        switch(objectType) {
            case "userInfo" :
                return userInfoPrivacy(object, privacyLevel, mSalt, salt, privacyData);
            case "userAttr" :
                return userAttrPrivacy(object, privacyLevel, mSalt, salt, privacyData);
            case "timeString" :
                return timeStringPrivacy(object, privacyLevel, mSalt, salt, privacyData);
            case "url" :
                return urlPrivacy(object, privacyLevel, mSalt, salt, privacyData);
            case "time" :
                return timePrivacy(object, privacyLevel,  mSalt, salt, privacyData);
            case "text" :
                return textPrivacy(object, privacyLevel, mSalt, salt, privacyData);
            case "id" :
                return idPrivacy(object, privacyLevel, mSalt, salt, privacyData);
			default:
                return object;
        }
    }
    
    return {
        objectPrivacy: objectPrivacy,
        identityPrivacy: identityPrivacy
    };
}());
export {privacyUtils};    