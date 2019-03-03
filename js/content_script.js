console.log("content_script.js");
var callbacks = {};

function isIterable(obj) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
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

function public_callback(data, moduleName, event){

	let message = {
		obj: "DataHandler",
		func: "handle",
		params: [{
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
        if(x.selector == ""){
            obj = event.currentTarget;
        }else{
            obj = selector(x.selector);
        }
        if(obj != null){
			switch(x.property){
				case "innerHTML":
				    message.params[0].data.out[x.name] = obj.innerHTML;
                    message.params[0].data.schems.push({jpath:"$." + x.name,type:"text"});
					break;
				case "href":
				    message.params[0].data.out[x.name] = obj.href;
                    message.params[0].data.schems.push({jpath:"$." + x.name,type:"url"});
					break;
				case "innerText":
				    message.params[0].data.out[x.name] = obj.innerText;
                    message.params[0].data.schems.push({jpath:"$." + x.name,type:"text"});
					break;
				case "text":
				    message.params[0].data.out[x.name] = obj.text;
                    message.params[0].data.schems.push({jpath:"$." + x.name,type:"text"});
					break;
			}
		}
    });
    send_msg(message);
}



function handleResponse(message) {
  console.log(`Message from the background script:  ${message}`);
  
    message.content.forEach(obj=>{ 
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
