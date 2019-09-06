console.log("menu.js");
function sendMessage(message) {
	return browser.runtime.sendMessage(message)
}

function start() {
	let message = {
		obj: "Loader",
		func: "start",
		params: []
	}
	return sendMessage(message);		       		
}

function stop() {
	let message = {
		obj: "Loader",
		func: "stop",
		params: []
	}
	return sendMessage(message);		       		
}


function showPageOnTab(url_to_show) {
	return browser.windows.getAll({
		populate: true,
		windowTypes: ["normal"]
	  }).then((windowInfoArray) => {
		  browser.tabs.create({url: url_to_show, active: true}).then(x=>{ window.close(); });
	  });
}

function showPageOnPopup(url_to_show){
    return browser.windows.create({
					url: url_to_show,
                    type: "popup"
				  });
}
  
  

function update_balance(balance){   
    document.getElementById("wallet_balance").innerText  = balance;
}

function update_wallet_address(walletAddress){
    if(walletAddress)        
        document.getElementById("wallet_address").innerText  = walletAddress.substring(0,16) + "...";
    
}
  
document.getElementById("open_setting").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html");
    showPageOnTab(url);
    //showPageOnPopup(url)
});

document.getElementById("open_messages").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html#/Messages");
    showPageOnTab(url);
});


document.getElementById("open_logs").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html#/Messages");
    showPageOnTab(url);
});


document.getElementById("streaming").addEventListener('click', function(eventObj) {
    let is_enabled = document.getElementById("streaming").checked;
    if(is_enabled) {
		start();
	}
    else {
		stop();
	}
});

//let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";
//update wallet balance
browser.storage.local.get().then(db => {
    update_wallet_address(db.profile.walletId);
    getBalance(db.profile.walletId, update_balance);
    document.getElementById("streaming").checked = db.configs.is_enabled;            
})

