
//let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";

	
function getBalance(walletAddress, callback) {
    if(!walletAddress)
        return;
    let tokenAddress = "0x0cf0ee63788a0849fe5297f3407f701e122cc023";
    
	let url = `https://api.tokenbalance.com/balance/${tokenAddress}/${walletAddress}`;
    req = {
        method: "GET",
        headers:{
            'Content-Type': "application/x-www-form-urlencoded"
        }			
    }

	  function checkResponse(response) {
    return new Promise((resolve, reject) => {
      if (response.status != 200) {
        reject("unknown balance");
      }
      response.json().then((json) => {
          resolve(json);
      });
    });
  }
    return fetch(url, req).then(checkResponse).then(balance => callback(balance));	
}