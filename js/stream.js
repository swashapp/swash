import {streamrConf} from './streamConfig.js';
// Create the client and give the API key to use by default


var stream = (function() {

	var client = new StreamrClient({
	  apiKey: streamrConf.API_KEY
	})

	// Wrap event generation and producion into this method
	function produceNewEvent(msg) {
	  
	  // Produce the event to the Stream
	  console.log("produceNewEvent ", msg);
	  client.produceToStream(streamrConf.STREAM_ID, msg)
		.then(() => {
		  console.log('Sent successfully: ' + JSON.stringify(msg))
		})
		.catch((err) => {
		  console.errorlog(err)
		})
	}
    return {
        produceNewEvent: produceNewEvent
    };
}());


export {stream};

