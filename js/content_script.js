alert("content_script.js");
console.log("content_script.js");

document.title = "This is the new page title.";

var callbacks = {};

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
            obj = jQuery(x.selector);
        }
        if(obj != null)
            if(x.property == "innerHTML"){
                msg[x.name] = obj.innerHTML
            }
            // TODO complete it
        }
    });
    send_msg(msg);
}

function handleResponse(message) {
  console.log(`Message from the background script:  ${message.response}`);
  
    message.data.forEach(obj=>{
        callback = function(x){public_callback(obj, x)};
        callbacks[obj.selector + "_" + obj.event_name] = callback;
        if(obj.selector == ""){
            // window
            window.addEventListener(obj.event_name, callback);
        }else{
            var doms = jQuery(obj.selector).forEach(dom=>{
                dom.addEventListener(obj.event_name, callback);
            });
        }
  });
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

browser.runtime.sendMessage({
    type: "request_data",
    url: window.location
  }).then(handleResponse, handleError);  