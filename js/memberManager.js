import {databaseHelper} from './databaseHelper.js'
import {communityHelper} from './communityHelper.js'
var memberManager = (function() {

	let minimumMessageNumber = 0;
	let sendTimeWindow = 300000;
	let joined = false

	async function fixedTimeWindowStrategy() {
		let messageCount = await databaseHelper.getTotalMessageCount();
		let lastSentDate = await databaseHelper.getLastSentDate();
		let currentTime = (new Date()).getTime();
		if (!joined && messageCount >= minimumMessageNumber && lastSentDate + sendTimeWindow >= currentTime) {
			communityHelper.join();
			joined = true
		}

		if (joined && lastSentDate + sendTimeWindow < currentTime) {
			communityHelper.part();
			joined = false
		}
	}

	async function dynamicTimeWindowStrategy() {
		let messageCount = await databaseHelper.getTotalMessageCount();
		let lastSentDate = await databaseHelper.getLastSentDate();
		let currentTime = (new Date()).getTime();
		if (!joined && messageCount >= minimumMessageNumber && (lastSentDate + messageCount*60*1000) >= currentTime) {
			communityHelper.join();
			joined = true
		}

		if (joined && (lastSentDate + messageCount*60*1000) < currentTime) {
			communityHelper.part();
			joined = false
		}
	}

	function immediateJoinStrategy() {
		/*if (!joined) {
			communityHelper.join().then(result => {
				if (result) {
					joined = true
				}
			})
		}*/
	}

	return {
		fixedTimeWindowStrategy,
		dynamicTimeWindowStrategy,
		immediateJoinStrategy,
    };
}())


export {memberManager};

