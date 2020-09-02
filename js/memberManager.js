import {databaseHelper} from './databaseHelper.js'
import {configManager} from './configManager.js'
import {swashApiHelper} from "./swashApiHelper.js";
import {onboarding} from "./onboarding.js";


let memberManager = (function() {

	let joined = false;
	let failedCount = 0;
	let mgmtInterval = 0;
	let memberManagerConfig;
	
	function init() {
		memberManagerConfig = configManager.getConfig('memberManager');
	}

	function updateStatus(strategy) {
		console.log(`${strategy}: user is ${joined ? 'already' : 'not'} joined`);
		joined ? failedCount = 0 : failedCount++;

		if (failedCount > memberManagerConfig.failuresThreshold) {
			clearInterval(mgmtInterval);
			mgmtInterval = 0;
			failedCount = 0;
			console.log(`need to join swash again`);
			onboarding.repeatOnboarding(["Join"]);
		}
	}
	
	let strategies = (function() {
		async function fixedTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && lastSentDate + memberManagerConfig.sendTimeWindow >= currentTime) {
				joined = await swashApiHelper.isJoinedSwash();
				updateStatus('FixedTimeWindowStrategy');
			}

			if (joined && lastSentDate + memberManagerConfig.sendTimeWindow < currentTime) {
				joined = swashApiHelper.isJoinedSwash();
				updateStatus('FixedTimeWindowStrategy');
			}
		}

		async function dynamicTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && (lastSentDate + messageCount * 60 * 1000) >= currentTime) {
				joined = await swashApiHelper.isJoinedSwash();
				updateStatus('DynamicTimeWindowStrategy');
			}

			if (joined && (lastSentDate + messageCount * 60 * 1000) < currentTime) {
				joined = swashApiHelper.isJoinedSwash();
				updateStatus('DynamicTimeWindowStrategy');
			}
		}

		async function immediateJoinStrategy() {
			if (!joined) {
				joined = await swashApiHelper.isJoinedSwash();
				updateStatus('ImmediateJoinStrategy');
			}
		}

		return {
			fixedTimeWindowStrategy,
			dynamicTimeWindowStrategy,
			immediateJoinStrategy,			
		}
	})()


	async function tryJoin() {
		if(!mgmtInterval) {
			await strategies[memberManagerConfig.strategy]();
			mgmtInterval = setInterval(strategies[memberManagerConfig.strategy], memberManagerConfig.tryInterval);
		}
	}

	return {
		init,
		tryJoin
    };
}())


export {memberManager};

