console.log("content_script.js");
var callbacks = {};

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

function public_callback(data, event){
    msg = {};
    data.objects.forEach(x=>{
        var obj = null;
        if(x.selector == ""){
            obj = event.target
        }else{
            obj = selector(x.selector);
        }
        if(obj != null){
			switch(x.property){
				case "innerHTML":
				    msg[x.name] = obj.innerHTML;
					break;
				case "href":
				    msg[x.name] = obj.href;				
					break;
				case "innerText":
				    msg[x.name] = obj.innerText;				
					break;
				case "text":
				    msg[x.name] = obj.text;				
					break;
			}
		}
    });
    send_msg(msg);
}



function handleResponse(message) {
  console.log(`Message from the background script:  ${message}`);
  
    message.forEach(obj=>{ 
		obj.events.forEach(event=>{
			callback = function(x){public_callback(obj, x)};
			callbacks[event.selector + "_" + event.event_name] = callback;
			if(event.selector == ""){
				// window
				window.addEventListener(event.event_name, callback);
			}else{
				let doms = selector(event.selector)
				if(doms) {
					for(let dom of doms) {
						dom.addEventListener(event.event_name, callback);
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
