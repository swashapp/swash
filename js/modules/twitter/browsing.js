browse_data = [
{
    name: "post_tweet"
    method: "POST",
    url_pattern: "https://twitter.com/i/tweet/create",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "status",
            name: "text"
        }
    ]
},{
    name: "search_hash",
    method: "GET",
    url_pattern: "https:\/\/twitter\.com\/hashtag\/([^?]+)\?src=hash",
    pattern_type: "regex",
    param: [
        {
            type: "regex",
            group: 1,
            name: "hashtag"
        }
    ]
},{
    name: "search",
    method: "GET",
    url_pattern: "https:\/\/twitter\.com\/search\?q=([^&]+)&src=typd",
    pattern_type: "regex",
    param: [
        {
            type: "regex",
            group: 1,
            name: "q"
        }
    ]
},{
    name: "follow",
    method: "POST",
    url_pattern: "https://api.twitter.com/1.1/friendships/create.json",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "user_id",
            name: "user_id"
        }
    ]
},{
    name: "unfollow",
    method: "POST",
    url_pattern: "https://api.twitter.com/1.1/friendships/destroy.json",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "user_id",
            name: "user_id"
        }
    ]
},{
    name: "mute",
    method: "POST",
    url_pattern: "https://twitter.com/i/user/mute",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "user_id",
            name: "user_id"
        }
    ]
},{
    name: "unmute",
    method: "POST",
    url_pattern: "https://twitter.com/i/user/unmute",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "user_id",
            name: "user_id"
        }
    ]
},{
    name: "like",
    method: "POST",
    url_pattern: "https://api.twitter.com/1.1/favorites/create.json",
    pattern_type: "exact",
    param: [
        {
            type: "form",
            key: "id",
            name: "tweet_id"
        }
    ]
},{
    name: "retweet",
    method: "POST",
    url_pattern: "https:\/\/twitter\.com\/i\/tweet\/html\?id=([0-9]+)&modal=retweet",
    pattern_type: "regex",
    param: [
        {
            type: "regex",
            group: 1,
            name: "tweet_id"
        }
    ]
},{
    name: "visit",
    method: "GET",
    url_pattern: "https:\/\/twitter\.com\/([_A-Za-z0-9]+)$",
    pattern_type: "regex",
    param: [
        {
            type: "regex",
            group: 1,
            name: "username"
        }
    ]
}

];


function inspectRequest(requestDetails){
    browse_data.forEach(data=> {
        inspectRequest_Data(requestDetails, data);
    });
}



function inspectRequest_Data(requestDetails, data) {
    console.log("inspectRequest_Data", requestDetails.url, data.name);
    if(requestDetails.method != data.method){
        return;
    }
    if(data.pattern_type === "exact"){
        if(requestDetails.url == data.url_pattern){
            var retval = {};
            data.param.forEach(p => {
                if(p.type === "form"){
                    retval[data.name] = requestDetails.requestBody.formData[data.key]
                }
                if(p.type === "query"){
                    retval[data.name] = (new URL(requestDetails.url)).searchParams.get(data.key)
                }
            });
            return retval;
        }
    }
    if(data.pattern_type === "regex"){
        var res = requestDetails.url.match(data.url_pattern);
        if(res!= null) {
            var retval = {};
            data.param.forEach(p => {
                if(p.type === "regex"){
                    retval[data.name] = res[data.group]
                }
                if(p.type === "form"){
                    retval[data.name] = requestDetails.requestBody.formData[data.key]
                }
            });
            return retval;
        }
    }
	return;
}

function getMethods(){
    return [ {
        method: inspectRequest,
        filter: {urls: ["*twitter.com/*"]},
        extraInfoSpec: ["requestBody"]
    }];
}

function uninstall(){
    getMethods().forEach(row => {
        if(browser.webRequest.onBeforeRequest.hasListener(row.method)){
            browser.webRequest.onBeforeRequest.removeListener(row.method);
        }
    });
}

function install(){
    getMethods().forEach(row => {
        if(!browser.webRequest.onBeforeRequest.hasListener(row.method)){
            browser.webRequest.onBeforeRequest.addListener(row.method,row.filter, row.extraInfoSpec);
        }
    });
}