console.log("content_script.js");

var contentScript = (function () {	
	var callbacks = {};
	
	function exportLogFunction(level, data, moduleName) {
		let func = function(x){override_debug(x,level,data, moduleName)};
		if(typeof exportFunction === 'function')
			exportLogFunction(func, console, {defineAs: level}); 
		else 
			chromeExportFunction(level, data, moduleName);
	}	
	function chromeExportFunction(level, data, moduleName) {
		var code = '(' + function(level, data, moduleName) {
			window.console[level] = function(x){override_debug(x,level,data, moduleName)};
		} + ')('+ JSON.stringify(level) + ',' + JSON.stringify(data) + ',' + JSON.stringify(moduleName) +');';
		var script = document.createElement('script');
		script.textContent = code;
		(document.head||document.documentElement).appendChild(script);
		script.remove();		
	}
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
				exportLogFunction("error", data, moduleName);            
				break;
			case "ConsoleWarns":
				exportLogFunction("warn", data, moduleName);            				           
				break;
			case "ConsoleLogs":
				exportLogFunction("log", data, moduleName);				          
				break;
		}
	}


	function public_callback(data, moduleName, event, index){
		let eventInfo = {
			index: Number(index) + 1			
		}
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
			var objList = [];
			switch(x.selector) {
				case "#":
					objList = eventInfo;
					break;
                case "window":
                    objList = window;                    
                    break;
                case "document":
                    objList = document;                    
                    break;
				case "":
					objList = event.currentTarget;                    
					break;
				case ".":
					objList = event.target;                    
					break;
				default:
                    if(x.name) {                        
                        objList = document.querySelectorAll(x.selector);
                    } 
                    else {
                        objList = document.querySelector(x.selector);
                    }
					break;
			}
			if(objList){                
                if(x.name) {
                    message.params[0].data.out[x.name] = [];                    
                    x.properties.forEach(y=>{
                        message.params[0].data.schems.push({jpath:"$." + x.name + "[*]." +  y.name,type:y.type}); 
                    });
					if(x.indexName)
						message.params[0].data.schems.push({jpath:"$." + x.name + "[*]." +  x.indexName,type:"text"});
                    objList.forEach((obj, objId)=>{
                        let item = {};
                        x.properties.forEach(y=>{
                            let prop;
                            if(y.selector)
                                prop = obj.querySelector(y.selector);
                            else
                                prop = obj;
							if(prop)
								item[y.name] = prop[y.property];                            
                        })
						if(!isEmpty(item)) {
							if(x.indexName) {
								item[x.indexName] = objId + 1;
							}
							message.params[0].data.out[x.name].push(item);
									
						}
                    })
                }
                else {
                    x.properties.forEach(y=>{                        
                        message.params[0].data.schems.push({jpath:"$." + y.name,type:y.type});
                        let prop;
                        if(y.selector)
                            prop = objList.querySelector(y.selector);
                        else
                            prop = objList;
						if(prop)
							message.params[0].data.out[y.name] = prop[y.property];
                    });
                }
			}			
		});
		if(!isEmpty(message.params[0].data.out))
			send_msg(message);
	}
	
	function documentReadyCallback(event, callback) {
		let doms = document.querySelectorAll(event.selector)
		if(doms) {
			if(isIterable(doms)) {
				doms.forEach((dom, domIndex) => {
					dom.addEventListener(event.event_name, function(x) {callback(x, domIndex)});					
				})					                        
			}
			else {
				doms.addEventListener(event.event_name, function(x) {callback(x, 0)});
			}
		}			
	}
	
	function handleResponse(message) {
	  console.log(`Message from the background script:  ${JSON.stringify(message)}`);
	  
		message.content.forEach(obj=>{ 
			switch(obj.type) {
				case "event":
					obj.events.forEach(event=>{
						let callback = function(x, index){public_callback(obj, message.moduleName, x, index)};
						callbacks[message.moduleName + "_" + event.selector + "_" + event.event_name] = callback;
						if(event.selector == "window"){
							// window
							window.addEventListener(event.event_name, callback);
						}else 
                        if(event.selector == "document"){
							// document
							document.addEventListener(event.event_name, callback);
						}
                        else{
							if(obj.readyAt == "windowLoad")
								window.addEventListener("load", function(){documentReadyCallback(event, callback)})
							else
								window.addEventListener("DOMContentLoaded", function(){documentReadyCallback(event, callback)})
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

	return {
		handleResponse: handleResponse,
		handleError: handleError
	}
}());




if (window.wrappedJSObject) {
	if(typeof window.wrappedJSObject.surfStreamrContentMessage === 'undefined') {	
		window.wrappedJSObject.surfStreamrContentMessage = {
			obj: "Content",
			func: "injectCollectors",
			params: [window.location.href]
		}

		browser.runtime.sendMessage(window.wrappedJSObject.surfStreamrContentMessage).then(contentScript.handleResponse, contentScript.handleError);  
	}
}
else {
	let surfStreamrContentMessage = {
		obj: "Content",
		func: "injectCollectors",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(surfStreamrContentMessage).then(contentScript.handleResponse, contentScript.handleError);  	
}


