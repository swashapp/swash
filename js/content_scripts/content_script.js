console.log("content_script.js");

var contentScript = (function () {	
	var callbacks = {};
    var oCallbacks = {};
	
	function uuid() {
        function randomDigit() {
            if (crypto && crypto.getRandomValues) {
                var rands = new Uint8Array(1);
                crypto.getRandomValues(rands);
                return (rands[0] % 16).toString(16);
            } else {
                return ((Math.random() * 16) | 0).toString(16);
            }
        }
        var crypto = window.crypto || window.msCrypto;
        return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
    }

	
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


	function hasNextSibling(elem, selector) {
		var sibling = elem.nextElementSibling;
		if (!selector) return true;
		while (sibling) {
			if(sibling.matches(selector))
				return true;
			sibling = sibling.nextElementSibling
		}
		return false;
	}

	function hasPreviousSibling(elem, selector) {
		var sibling = elem.previousElementSibling;
		if (!selector) return true;
		while (sibling) {
			if(sibling.matches(selector))
				return true;
			sibling = sibling.previousElementSibling;
		}
		return false;
	};

	function hasParent(elem, selector) {
		var parent = elem.parentElement;
		if (!selector) return true;
		while (parent) {
			if(parent.matches(selector))
				return true;
			parent = parent.parentElement;
		}
		return false;
	};
	
	function hasChild(elem, selector) {
		var childs = elem.children;
		if (!selector) return true;
		for(child of childs){
			if(child.matches(selector))
				return true;
		}
		return false;
	};
	
	function isCollectable(obj, conditions) {
		let res;
		for(let condition of conditions) {
			res = true;
			let expressions = Object.keys(condition);
			for(let expr of expressions) {
				switch(expr) {
					case "previousSibling":
						res = condition[expr].contain? (res && hasPreviousSibling(obj, condition[expr].val)): (res && !hasPreviousSibling(obj, condition[expr].val))
						break;
					case "nextSibling":
						res = condition[expr].contain? (res && hasNextSibling(obj, condition[expr].val)): (res && !hasNextSibling(obj, condition[expr].val))
						break;
					case "parent":
						res = condition[expr].contain? (res && hasParent(obj, condition[expr].val)): (res && !hasParent(obj, condition[expr].val))
						break;
					case "child":
						res = condition[expr].contain? (res && hasChild(obj, condition[expr].val)): (res && !hasChild(obj, condition[expr].val))
						break;
				}
				if(!res)
					break;
			}
			if(res)
				return res
		}
		return res;
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
		for(x of data.objects) {
		//data.objects.forEach(x=>{
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
			if(!objList || (NodeList.prototype.isPrototypeOf(objList) && objList.length == 0))
				if(x.isRequired)
					return;
			if(objList){                
                if(x.name) {
                    message.params[0].data.out[x.name] = [];                    
                    x.properties.forEach(y=>{
                        message.params[0].data.schems.push({jpath:"$." + x.name + "[*]." +  y.name,type:y.type}); 
                    });
					if(x.indexName)
						message.params[0].data.schems.push({jpath:"$." + x.name + "[*]." +  x.indexName,type:"text"});
					let objectIndex = 0;
                    objList.forEach((obj, objId)=>{
						if(x.conditions && !isCollectable(obj, x.conditions))
							return;
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
							objectIndex++;
							if(x.indexName) {
								item[x.indexName] = objectIndex;
							}
							message.params[0].data.out[x.name].push(item);
									
						}
                    })
                }
                else if(!(x.conditions && !isCollectable(obj, x.conditions))){											
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
		}
		//);
		if(!isEmpty(message.params[0].data.out))
			send_msg(message);	
	}
	
	function documentReadyCallback(event, callback) {
		let doms = document.querySelectorAll(event.selector)
		if(doms) {			
			let objIndex = 0;
			doms.forEach((dom, domIndex) => {
				if(event.conditions && !isCollectable(dom, event.conditions))
					return;				
				dom.addEventListener(event.event_name, (function(index){return function(x) {callback(x, index)}})(objIndex));	
				objIndex++;
			})					                        
		}			
	}
	
    function observingCallback(mutationsList, observer, event, callback, targetNode,targetEventId, cbName) {
        if(event.event_name == "."){
			var ev = new Event(targetEventId);
            targetNode.dispatchEvent(ev);
            return;
        }		
        let doms = document.querySelectorAll(event.selector)
		if(doms){
			let objIndex = 0;
			doms.forEach((dom, domIndex) => {
				if(event.conditions && !isCollectable(dom, event.conditions))
					return;				
				let cb = oCallbacks[cbName+objIndex]
				if(!cb) {
					cb = (function(index){ return function(x) {callback(x, index)}})(objIndex);	
					oCallbacks[cbName+objIndex] = cb;
				}
				dom.removeEventListener(event.event_name, cb);
				dom.addEventListener(event.event_name, cb);
				objIndex++;
			})			
		}		
	}
    
    function observeReadyCallback(event, callback, obj,cbName) {
        let targetNode = document.querySelector(obj.observingTargetNode)
		let targetEventId = uuid();
        let observer = new MutationObserver(function(x,y){observingCallback(x,y,event,callback,targetNode,targetEventId,cbName)});
        observer.observe(targetNode, obj.observingConfig);		
		targetNode.addEventListener(targetEventId, function(x) {callback(x, 0)});					
    }
    
	function handleResponse(message) {	  
		message.content.forEach(obj=>{ 
			switch(obj.type) {
				case "event":
					obj.events.forEach(event=>{
						let callback = function(x, index){
								if(event.keyCode && event.keyCode == x.keyCode || !event.keyCode)
									public_callback(obj, message.moduleName, x, index)
							};
                        let cbName = message.moduleName + "_" + obj.name + "_" + event.selector + "_" + event.event_name;
						callbacks[cbName] = callback;
						if(event.selector == "window"){
							// window
							window.addEventListener(event.event_name, callback);
						}else 
                        if(event.selector == "document"){
							// document
							document.addEventListener(event.event_name, callback);
						}
                        else{
                            //doms
                            switch(obj.readyAt) {
                                case "windowLoad":
                                    window.addEventListener("load", function(){documentReadyCallback(event, callback)})
                                    break;
                                case "DOMChange":
                                    window.addEventListener("DOMContentLoaded", function(){observeReadyCallback(event, callback, obj, cbName)})                                    
                                    break;
								case "windowChange":
                                    window.addEventListener("load", function(){observeReadyCallback(event, callback, obj, cbName)})                                    
                                    break;
                                case "DOMLoad":
                                    window.addEventListener("DOMContentLoaded", function(){documentReadyCallback(event, callback)})
                                    break;
                                default:
                                    window.addEventListener("DOMContentLoaded", function(){documentReadyCallback(event, callback)})
                                    
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

	return {
		handleResponse: handleResponse,
		handleError: handleError,
	}
}());


/*if (window.wrappedJSObject) {
	if(typeof window.wrappedJSObject.surfStreamrContentMessage === 'undefined') {	
		window.wrappedJSObject.surfStreamrContentMessage = {
			obj: "Content",
			func: "injectCollectors",
			params: [window.location.href]
		}

		browser.runtime.sendMessage(window.wrappedJSObject.surfStreamrContentMessage).then(contentScript.handleResponse, contentScript.handleError);  
	}
}
else */{
	if(typeof window.surfStreamrContentMessage === 'undefined') {
		window.surfStreamrContentMessage = {
			obj: "Content",
			func: "injectCollectors",
			params: [window.location.href]
		}		
		browser.runtime.sendMessage(window.surfStreamrContentMessage).then(contentScript.handleResponse, contentScript.handleError);
	}	
}


