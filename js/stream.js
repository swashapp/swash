import {databaseHelper} from './databaseHelper.js';
// Create the client and give the API key to use by default


var stream = function(streamId, apiKey) {
		
	var client = new StreamrClient({
		auth:{
			apiKey: apiKey
		}
	})	
	// Wrap event generation and producion into this method
	function produceNewEvent(msg) {
	  
	  // Produce the event to the Stream
	  
	  client.publish(streamId, msg)
		.then(() => {
			databaseHelper.updateMessageCount(msg.header.module);
		})
		.catch((err) => {
		  console.error(err)
		})
	}
    return {
        produceNewEvent
    };
};


export {stream};

