import {databaseHelper} from './databaseHelper.js'
import {configManager} from './configManager.js'
import {swashApiHelper} from "./swashApiHelper.js";
import {onboarding} from "./onboarding.js";


let memberManager = (function() {

	let joined = undefined;
	let failedCount = 0;
	let mgmtInterval = 0;
	let memberManagerConfig;
	let strategyInterval;

	function init() {
		memberManagerConfig = configManager.getConfig('memberManager');
		if (memberManagerConfig) strategyInterval = memberManagerConfig.tryInterval;
	}

	function updateStatus(strategy) {
		console.log(`${strategy}: Trying to join...`);
		swashApiHelper.isJoinedSwash().then(status => {
			joined = status;
			if (status === false) {
				console.log(`${strategy}: user is not joined`);
				failedCount++;

				if (failedCount > memberManagerConfig.failuresThreshold) {
					clearJoinStrategy();
					failedCount = 0;
					console.log(`need to join swash again`);
					onboarding.repeatOnboarding(['Join', 'Completed']).then();
				}
			} else if (status === true) {
				console.log(`${strategy}: user is already joined`);
				clearJoinStrategy();
				strategyInterval = memberManagerConfig.tryInterval;
				tryJoin();
			} else {
				console.log(`${strategy}: failed to get user join status`);
				if (strategyInterval < memberManagerConfig.maxInterval) {
					clearJoinStrategy();
					strategyInterval *= memberManagerConfig.backoffRate;
					if (strategyInterval > memberManagerConfig.maxInterval) strategyInterval = memberManagerConfig.maxInterval;
					tryJoin();
				}
			}
		});
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


	function tryJoin() {
		if(!mgmtInterval) mgmtInterval = setInterval(strategies[memberManagerConfig.strategy], strategyInterval);
	}

	function clearJoinStrategy() {
		clearInterval(mgmtInterval);
		mgmtInterval = 0;
	}

	function isJoined() {
		return joined;
	}

	return {
		init,
		tryJoin,
		isJoined
    };
}())


export {memberManager};

