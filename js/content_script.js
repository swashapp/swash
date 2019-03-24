console.log("content_script.js");
var callbacks = {};

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

function selector(s) {
	switch(s[0]) {
		case "":
			return document;
		case "#":
			return document.getElementById(s.substring(1));			
		case ".":
			return document.getElementsByClassName(s.substring(1));					
			break;
		default:
			return document.getElementsByTagName(s);
	}
}

function send_msg(msg){
    browser.runtime.sendMessage(msg);
}
function override_debug(x,level,data, moduleName) {
    let message = {
        obj: "DataHandler",
        func: "handle",
        params: [{
                origin: window.location.href,
                header: {
                    module: moduleName,
                    function: "Content",
                    collector: data.name
                },
                data: {
                    out: {
                        method: level,
                        arguments: arguments[0]
                    },
                    schems: [
                        {jpath:"$.arguments",type:"text"},
                        {jpath:"$.method",type:"text"}
                    ]
                }
            }]
    }
    send_msg(message);
    return console[level].apply(console, [arguments[0]]);
}

function log_callback(data, moduleName){
    console.log("function log_callback");
    switch(data.name) {
        case "ConsoleErrors":
            exportFunction(function(x){override_debug(x,"error",data, moduleName)}, console, {
              defineAs: "error"
            });            
            break;
        case "ConsoleWarns":
            exportFunction(function(x){override_debug(x,"warn",data, moduleName)}, console, {
              defineAs: "warn"
            });            
            break;
        case "ConsoleLogs":
            exportFunction(function(x){override_debug(x,"log",data, moduleName)}, console, {
              defineAs: "log"
            });            
            break;
    }
}


function public_callback(data, moduleName, event){

	let message = {
		obj: "DataHandler",
		func: "handle",
		params: [{
                origin: window.location.href,
                header: {
                    module: moduleName,
                    function: "Content",
                    collector: data.name
                },
                data: {
                    out: {},
                    schems: []
                }
            }]
	}

    data.objects.forEach(x=>{
        var obj = null;
		switch(x.selector) {
			case "":
				obj = event.currentTarget;
				break;
			case ".":
				obj = event;
				break;
			default:
				obj = selector(x.selector);
				break;
		}
        if(HTMLCollection.prototype.isPrototypeOf(obj))
            obj = obj[0];
        if(NodeList.prototype.isPrototypeOf(obj))
            obj = obj[0];
        if(obj != null){
			message.params[0].data.out[x.name] = obj[x.property];
			message.params[0].data.schems.push({jpath:"$." + x.name,type:x.type});
		}			
    });
	if(!isEmpty(message.params[0].data.out))
		send_msg(message);
}



function handleResponse(message) {
  console.log(`Message from the background script:  ${JSON.stringify(message)}`);
  
    message.content.forEach(obj=>{ 
        switch(obj.type) {
            case "event":
                obj.events.forEach(event=>{
                    callback = function(x){public_callback(obj, message.moduleName, x)};
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
        }
  });
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


