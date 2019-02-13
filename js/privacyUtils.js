function urlPrivacy(url, privacyLevel) {
    urlObj = new URL(requestDetails.url);
    var searchParams = (new URL(requestDetails.url)).searchParams;
    var query = searchParams.get("field-keywords");    
    switch(privacyLevel) {
        case 0:            
            return urlObj.href;
        case 1:
            for (item of urlObj.searchParams)
                urlObj.searchParams.set(item[0], "")
            return urlObj.href;
        case 2:
            var path = urlObj.pathname.split("/");
            for (item in path) {
                if(path[item]) {
                    path[item] = sha256(path[item]).substring(0,path[item].length);
                }
            }
            path = path.join("/");                
            var retUrl = urlObj.origin + path;
            return retuUrl;
        case 3:
            return  urlObj.origin;
        default:
            return  urlObj.origin;
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
        default:
            return date.getTime();
}

function textPrivacy(text, privacyLevel) {
    var blackList = [{key:'test',map: 'replace'}];
    switch(privacyLevel) {
        case 0:        
            return text;
        case 1:
            for(var i = 0; i < blackList.length ; i++) {                 
                text.replace(new RegExp(blackList[i].key, 'g'), blackList[i].map);
            }
            return text;
        case 2:
            for(var i = 0; i < blackList.length ; i++) {                 
                text.replace(new RegExp(blackList[i].key, 'g'), "");
            }
            return text;
        case 3:
            for(var i = 0; i < blackList.length ; i++) {
                if(text.indexof(blackList[i].key) > 0 ) {
                    text = "";
                    break;
                }
            }            
            return text;
        default:
            return "";
}
    
function objectPrivacy(obejct, objectType, privacyLevel){
    switch(objectType) {
        case "url" :
            return urlPrivacy(object, privacyLevel);
            break;
        case "time" :
            return timePrivacy(object, privacyLevel);
            break;
        case "text" :
            return textPrivacy(object, privacyLevel);
            break;
    }
}