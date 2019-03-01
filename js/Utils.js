console.log("Utils.js");
var Utils = (function() {
    'use strict';
    
    function notify(message) {
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/surf48.png"),
        "title": message.header.module + ":" + message.header.function + ":" + message.header.collector,
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
	    
    return {
        jsonUpdate: jsonUpdate,
        wildcard: wildcard,
        notify: notify,
        uuid: uuid,
		serialize: serialize
    };
}());
export {Utils};
