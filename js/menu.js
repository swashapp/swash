function showPageOnTab(url_to_show) {
	return browser.windows.getAll({
		populate: true,
		windowTypes: ["normal"]
	  }).then((windowInfoArray) => {
		  browser.tabs.create({url: url_to_show, active: true}).then(x=>{ window.close(); });
	  });
}


function updateBalance(balance){   
    document.getElementById("balance").innerText  = `${balance} DATA`;
}

function updateVersion(version){   
    document.getElementById("version").innerText  = `V${version}`;
}

  
document.getElementById("open_setting").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html");
    showPageOnTab(url);
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
		window.helper.start();
	}
    else {
		window.helper.stop();
	}
});


window.helper.load().then(db => {
	window.helper.getDataBalance().then(balance => {
		updateBalance(balance);
	})
    window.helper.getVersion().then(version => {
		updateVersion(version);
	})
    document.getElementById("streaming").checked = db.configs.is_enabled;            
})
