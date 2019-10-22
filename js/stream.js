import { DatabaseHelper } from './DatabaseHelper.js';
import { communityHelper } from './communityHelper.js'

var stream = function(streamId) {

	const sessionTimeout = 2*60*1000;
	var client;
	var sessionStartTime = (new Date()).getTime()

	// Wrap event generation and production into this method
	function produceNewEvent(msg) {

		// Produce the event to the Stream
		let currentTime = (new Date()).getTime();
		if (!client || currentTime - sessionStartTime > sessionTimeout) {
			sessionStartTime = currentTime;
			client = communityHelper.getStreamrClient()
		}
	  	client.publish(streamId, msg).then(() => {
			DatabaseHelper.updateMessageCount(msg.header.module)
			console.log('Message sent successfully')
		}).catch((err) => {
			console.error(err)
		})
	}

    return {
        produceNewEvent
    };
};


export {stream};

