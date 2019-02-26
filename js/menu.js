  function showPageOnTab(url_to_show) {
    return browser.windows.getAll({
        populate: true,
        windowTypes: ["normal"]
      }).then((windowInfoArray) => {
          browser.tabs.create({url: url_to_show, active: true}).then(x=>{ window.close(); });
      });
  }
  
  console.log("I loaded");
  

function update_balance(balance){
    console.log(balance);
    document.getElementById("wallet_balance").innerText  = balance;
}

function update_wallet_address(walletAddress){
    if(walletAddress)        
        document.getElementById("wallet_address").innerText  = walletAddress.substring(0,16) + "...";
    
}
  
document.getElementById("open_setting").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html");
    showPageOnTab(url);
});

document.getElementById("open_messages").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html");
    showPageOnTab(url);
});


document.getElementById("open_logs").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("dashboard/index.html");
    showPageOnTab(url);
});


document.getElementById("streaming").addEventListener('click', function(eventObj) {
    let is_enabled = document.getElementById("streaming").checked;
    if(is_enabled)
        browser.browserAction.setIcon({path: "../icons/surf19.png"});
    else
        browser.browserAction.setIcon({path: "../icons/surf19g.png"});
    // enable/disable module
    browser.storage.sync.get("configs").then(c => {
        c.configs.is_enabled = is_enabled;
        browser.storage.sync.set(c);
    })
});

//let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";
//update wallet balance
browser.storage.sync.get().then(db => {
    update_wallet_address(db.profile.walletId);
    getBalance(db.profile.walletId, update_balance);
    document.getElementById("streaming").checked = db.configs.is_enabled;            
})

