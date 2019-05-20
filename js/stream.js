import {streamrConf} from './streamConfig.js';
// Create the client and give the API key to use by default


var stream = (function() {
	
	const sessionTimeout = 2*60*1000;
	var client = new StreamrClient({
		auth:{
			apiKey: streamrConf.API_KEY
		}
	})
	var sessionStartTime = (new Date()).getTime()
	// Wrap event generation and producion into this method
	function produceNewEvent(msg) {
	  
	  // Produce the event to the Stream
	  let currentTime = (new Date()).getTime();
	  if((currentTime - sessionStartTime) > sessionTimeout) {
		  sessionStartTime = currentTime;
		  client = new StreamrClient({
				auth:{
					apiKey: streamrConf.API_KEY
				}
			})
	  }	  
	  client.publish(streamrConf.STREAM_ID, msg)
		.then(() => {
		  console.log('Sent successfully: ' + JSON.stringify(msg))
		})
		.catch((err) => {
		  console.error(err)
		})
	}
    return {
        produceNewEvent: produceNewEvent
    };
}());


export {stream};

