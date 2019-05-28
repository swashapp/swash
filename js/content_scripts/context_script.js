console.log("context_script.js");

var contextScript = (function () {	
	var cta_callbacks = [];


	function send_msg(msg){
		browser.runtime.sendMessage(msg);
	}


	function getScreenResolution() {
		return {width:window.screen.width, height: window.screen.height};
	}

	function getScrolls() {
		return {scrollMaxX:window.scrollMaxX, scrollMaxY:window.scrollMaxY, fullscreen:window.fullScreen}
	}

	function getWindowSize() {
		return {height: window.innerHeight, width:window.innerWidth};
	}

	async function getCache() {
		let cacheStorage = {};
		let cacheNames = await window.caches.keys();
		cacheNames.forEach(async function(cacheName) {
		  cacheStorage[cacheNames] = await window.caches.open(cacheName).keys();
		  });
		return  cacheStorage;
	}


	async function context_attr_connect(p) {
		let message = {}
		for(let cta of cta_callbacks){
			message[cta.name] = await cta.callback();
		}
		p.postMessage(message);
	}
	function handleResponse(message) {
		message.context.forEach(obj=>{ 
			switch(obj.name){
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
		});
		
		if(cta_callbacks.length > 0) {	
			browser.runtime.onConnect.addListener(context_attr_connect);	
		}
	}

	function handleError(error) {
	  console.log(`Error: ${error}`);
	}

	return {
		handleResponse: handleResponse,
		handleError: handleError
	}
}());
	
if(typeof window.surfStreamrContextMessage === 'undefined') {
	window.surfStreamrContextMessage = {
		obj: "Context",
		func: "injectAttrCollectors",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(window.surfStreamrContextMessage).then(contextScript.handleResponse, contextScript.handleError);  	
}

