console.log("content_script.js");
var callbacks = {};
var cta_callbacks = [];

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== "object") return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}


function send_msg(msg){
    browser.runtime.sendMessage(msg);
}




function context_attribute_callbacks(data) {
    function getScreenResolution() {
		return {width:window.screen.width, height: window.screen.height};
	}
	
	function getScrolls() {
		return {scrollMaxX:window.scrollMaxX, scrollMaxY:window.scrollMaxY, fullscreen:window.fullscreen}
	}
	
	function getWindowSize() {
		return {height: window.innerHeight, width:window.innerWidth};
	}
    
    async function getCache() {
        return await window.caches.keys();
    }
    
    switch(data.name){
        case "resolution":
            cta_callbacks.push({name: "resolution", callback: getScreenResolution})
            break;
        case "scroll":
            cta_callbacks.push({name: "scroll", callback: getScrolls})
            break;
        case "windowSize":
            cta_callbacks.push({name: "windowSize", callback: getWindowSize})
            break;
        case "cache":
            cta_callbacks.push({name: "cache", callback: getCache})
            break;
    }
    
}


context_attr_connect(p) {
    let message = {}
    for(cta of cta_callbacks){
        message[cta.name] = cta.callback();
    }
    p.postMessage(message);
}
function handleResponse(message) {
  console.log(`Message from the background script:  ${JSON.stringify(message)}`);
  
    message.content.forEach(obj=>{ 
        switch(obj.type) {
            case "event":
                obj.events.forEach(event=>{
                    let callback = function(x){public_callback(obj, message.moduleName, x)};
                    callbacks[message.moduleName + "_" + event.selector + "_" + event.event_name] = callback;
                    if(event.selector == ""){
                        // window
                        window.addEventListener(event.event_name, callback);
                    }else{
                        let doms = selector(event.selector)
                        if(doms) {
                            if(isIterable(doms)) {
                                for(let dom of doms) {
                                    dom.addEventListener(event.event_name, callback);
                                }					                        
                            }
                            else {
                                doms.addEventListener(event.event_name, callback);
                            }
                        }
                    }			
                })            
            break;
            case "log":
                log_callback(obj, message.moduleName);
                break;
            case "context_attribute": 
                context_attribute_callbacks(obj);
                break;
        }
    });
    if(cta_callbacks.length > 0)
        browser.runtime.onConnect.addListener(context_attr_connect);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}





if (typeof message === 'undefined') {
	let message = {
		obj: "Content",
		func: "injectCollectors",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(message).then(handleResponse, handleError);  
}


