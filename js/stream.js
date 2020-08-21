import {databaseHelper} from './databaseHelper.js';
import {communityHelper} from './communityHelper.js'
// Create the client and give the API key to use by default


let stream = function(streamId) {
		
	let client = communityHelper.getStreamrClient();
	// Wrap event generation and producion into this method
	function produceNewEvent(msg) {
	  
	  // Produce the event to the Stream
	  
	  client.publish(streamId, msg)
		.then(() => {
			console.log("message published successfully");
			databaseHelper.updateMessageCount(msg.header.module);
		})
		.catch((err) => {
		  console.error(`"Error on publishing message: ${err}`)
		})
	}
    return {
        produceNewEvent
    };
};


export {stream};

