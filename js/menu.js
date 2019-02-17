
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
    
    document.getElementById("wallet_address").innerText  = walletAddress.substring(0,16) + "...";
    
}
  
document.getElementById("open_setting").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});

document.getElementById("open_messages").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});


document.getElementById("open_logs").addEventListener('click', function(eventObj) {
    let url = browser.runtime.getURL("setting.html");
    showPageOnTab(url);
});

let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";
update_wallet_address(walletAddress);
getBalance(walletAddress, update_balance);
