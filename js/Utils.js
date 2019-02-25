console.log("Utils.js");
var Utils = (function() {
    'use strict';
    
    function notify(message) {
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/surf48.png"),
        "title": message.module + ":" + message.source,
        "message": JSON.stringify(message)
      });
    }

	function jsonUpdate(src, newObj) {
		if(Array.isArray(newObj))
		{
			src.length = 0
			for(item of newObj)
				src.push(item);
			return;
		}
		for (var prop in newObj) { 
			var val = newObj[prop];
			if (val != null && typeof val == "object") {// this also applies to arrays or null!
				if(Array.isArray(val)) {
					src[prop] = val;
				}
				else {
					if(!src[prop])
						src[prop] = {};	
					jsonUpdate(src[prop], val);
				}
			}
			else
				src[prop] = val;
			
		}
			
	}


	function wildcard(input, wc) {
		function regExpEscape (s) {
		  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\$&');
		}
		var regex = new RegExp('^' + wc.split(/\*+/).map(regExpEscape).join('.*') + '$');
		if(!input.match(regex))
			return null;
		return input;
	}

	function serialize(obj) {
	  var str = [];
	  for(var p in obj)
		if (obj.hasOwnProperty(p)) {
		  str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		}
	  return str.join("&"); 
	}
	

	/*

	var STREAM_ID = '************************'
	var API_KEY = '**********************************'
	var settings = {};
	// Create the client and give the API key to use by default
	var client = new StreamrClient({
	  apiKey: API_KEY
	})

	// Wrap event generation and producion into this method
	function produceNewEvent(msg) {
	  
	  // Produce the event to the Stream
	  console.log("produceNewEvent ", msg);
	  client.produceToStream(STREAM_ID, msg)
		.then(() => {
		  console.log('Sent successfully: ' + JSON.stringify(msg))
		})
		.catch((err) => {
		  console.errorlog(err)
		})
	}
	*/
    
    return {
        jsonUpdate: jsonUpdate,
        wildcard: wildcard,
        notify: notify
    };
}());
export {Utils};
