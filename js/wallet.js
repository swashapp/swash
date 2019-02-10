let tokenAddress = "0x0cf0ee63788a0849fe5297f3407f701e122cc023";
let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";

	
function getBalance() {
	var endpoint = "https://api.tokenbalance.com/balance";
	var apiInfo = {
		method: "GET",
		URI: `/${tokenAddress}/${walletAddress}`,
		content_type: "application/x-www-form-urlencoded"
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

	return apiCall(endpoint, apiInfo).then(checkResponse).then(balance => console.log(balance));
}