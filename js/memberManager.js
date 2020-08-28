import {databaseHelper} from './databaseHelper.js'
import {communityHelper} from './communityHelper.js'
import {configManager} from './configManager.js'


var memberManager = (function() {

	let joined = false;
	let mgmtInterval = 0;
	let joinStatus = "notJoined";
	let memberManagerConfig;
	
	function init() {
		memberManagerConfig = configManager.getConfig('memberManager');		
	}
	
	var strategies = (function() {
		async function fixedTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && lastSentDate + memberManagerConfig.sendTimeWindow >= currentTime) {
				communityHelper.join();
				joined = true
			}

			if (joined && lastSentDate + memberManagerConfig.sendTimeWindow < currentTime) {
				communityHelper.part();
				joined = false
			}
		}

		async function dynamicTimeWindowStrategy() {
			let messageCount = await databaseHelper.getTotalMessageCount();
			let lastSentDate = await databaseHelper.getLastSentDate();
			let currentTime = (new Date()).getTime();
			if (!joined && messageCount >= memberManagerConfig.minimumMessageNumber && (lastSentDate + messageCount*60*1000) >= currentTime) {
				communityHelper.join();
				joined = true
			}

			if (joined && (lastSentDate + messageCount*60*1000) < currentTime) {
				communityHelper.part();
				joined = false
			}
		}

		function immediateJoinStrategy() {
			if (joinStatus === "notJoined") {
				joinStatus = "joining";
				console.log("try joining");
				communityHelper.join().then(result => {
					if (result) {
						console.log("joined");
						joinStatus = "joined";
					} 
					else {
						console.log("not joined");
						joinStatus = "notJoined";
					}
				}).catch(res => {
					console.log(`error on joining: ${res.message}`);
					joinStatus = "notJoined";
				})
			}
		}
		
		return{
			fixedTimeWindowStrategy,
			dynamicTimeWindowStrategy,
			immediateJoinStrategy,			
		}
	})()


	function tryJoin() {
		if(!mgmtInterval) {
			strategies[memberManagerConfig.strategy]();
			mgmtInterval = setInterval(strategies[memberManagerConfig.strategy], memberManagerConfig.tryInterval);
		}
	}

	return {
		init,
		tryJoin
    };
}())


export {memberManager};

