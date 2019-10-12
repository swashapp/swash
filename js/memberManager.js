import {DatabaseHelper} from './DatabaseHelper.js'
import {communityHelper} from './communityHelper.js'
var memberManager = (function() {

	let minimumMessageNumber = 5;
	let sendTimeWindow = 30000;

	async function fixedTimeWindowStrategy() {
		let messageCount = await DatabaseHelper.getTotalMessageCount();
		let lastSentDate = await DatabaseHelper.getLastSentDate();
		let currentTime = (new Date()).getTime();
		if(messageCount >= minimumMessageNumber && (lastSentDate + sendTimeWindow) >= currentTime) {
			communityHelper.join();
		} 
		else {
			communityHelper.part();
		}
	}

	async function dynamicTimeWindowStrategy() {
		let messageCount = await DatabaseHelper.getTotalMessageCount();
		let lastSentDate = await DatabaseHelper.getLastSentDate();
		let currentTime = (new Date()).getTime();
		if(messageCount >= minimumMessageNumber && (lastSentDate + messageCount*60*1000) >= currentTime) {
			communityHelper.join();
		} 
		else {
			communityHelper.part();
		}
	}	
		
	return {
		fixedTimeWindowStrategy,
		dynamicTimeWindowStrategy
    };
}())


export {memberManager};

