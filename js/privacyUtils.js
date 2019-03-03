var privacyUtils = (function() {
    'use strict';

    function urlPrivacy(url, privacyLevel) {
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
                        path[item] = sha256(path[item]).substring(0,path[item].length);
                    }
                }
                path = path.join("/");                
                var retUrl = urlObj.origin + path;
                return retUrl;
            case 3:
                return  urlObj.origin;
            case 4:
                return  urlObj.origin;			
            default:
                return  urlObj.origin;
        }
    }
        
    function timePrivacy(time, privacyLevel) {
        var date = new Date();
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
                return date.getTime();
            case 4:
                date2 = new Date(0);
                date2.setFullYear(date.getFullYear(), date.getMonth())
                return date.getTime();

			default:
                return date.getTime();
        }
    }

    function textPrivacy(text, privacyLevel) {
        var blackList = [{key:'test',map: 'replace'}];
        var retText = text;
        switch(privacyLevel) {
            case 0:        
                return retText;
            case 1:
                for(var i = 0; i < blackList.length ; i++) {                 
                    retText = retText.replace(new RegExp(blackList[i].key, 'g'), blackList[i].map);
                }
                return retText;
            case 2:
                for(var i = 0; i < blackList.length ; i++) {                 
                    retText = retText.replace(new RegExp(blackList[i].key, 'g'), "");
                }
                return retText;
            case 3:
                for(var i = 0; i < blackList.length ; i++) {
                    if(retText.indexOf(blackList[i].key) > 0 ) {
                        retText = "";
                        break;
                    }
                }            
                return retText;
            case 4:
                for(var i = 0; i < blackList.length ; i++) {
                    if(retText.indexOf(blackList[i].key) > 0 ) {
                        retText = "";
                        break;
                    }
                }            
                return retText;

			default:
                return "";
        }
    }
        
    function objectPrivacy(object, objectType, privacyLevel){
        if(!object)
            return object;
        switch(objectType.split(".")[0]) {
            case "url" :
                return urlPrivacy(object, privacyLevel);
                break;
            case "time" :
                return timePrivacy(object, privacyLevel);
                break;
            case "text" :
                return textPrivacy(object, privacyLevel);
                break;
            default:
                return object;
        }
    }
    
    return {
        objectPrivacy: objectPrivacy               
    };
}());
export {privacyUtils};    