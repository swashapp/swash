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

	async function updateStatus(strategy) {
		const newStatus = await swashApiHelper.isJoinedSwash();

		if (newStatus === undefined) {
			console.log(`${strategy}: failed to get user join status`);
		} else {
			joined = newStatus;
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
	}
	
	let strategies = (function() {
		async function fixedTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && lastSentDate + memberManagerConfig.sendTimeWindow >= currentTime) {
				updateStatus('FixedTimeWindowStrategy');
			}

			if (joined && lastSentDate + memberManagerConfig.sendTimeWindow < currentTime) {
				updateStatus('FixedTimeWindowStrategy');
			}
		}

		async function dynamicTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && (lastSentDate + messageCount * 60 * 1000) >= currentTime) {
				updateStatus('DynamicTimeWindowStrategy');
			}

			if (joined && (lastSentDate + messageCount * 60 * 1000) < currentTime) {
				updateStatus('DynamicTimeWindowStrategy');
			}
		}

		async function immediateJoinStrategy() {
			if (!joined) {
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

