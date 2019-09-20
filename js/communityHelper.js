import {communityConfig} from './communityConfig.js';
var communityHelper = function() {
	
	var wallet = ""
	var sessionToken = ""

	function createWallet(password) {						
		wallet = ethers.Wallet.createRandom();
		let encryptPromise = wallet.encrypt(password);
		encryptPromise.then(function(encryptedJson) {
			//store encryptedJson
		});
	}
	
	function loadWallet(password, encryptedJson) {	
		let json = JSON.stringify(data);
		ethers.Wallet.fromEncryptedJson(json, password).then(function(_wallet) {
			wallet = _wallet
		});
	}
	
	function loadSessionToken() {
		const client = new StreamrClient({
			auth: {
				privateKey: wallet.privateKey,
			}
		})
		sessionToken = client.connection.options.auth.sessionToken
	}
	
	function joinCommunity() {
		if(!wallet || !sessionToken)
			return;
		
		let apiEndpoint = communityConfig.apiBaseURL + "/" + communityConfig.communityAddress + "/joinRequests"
		var data = {
			memberAddress: wallet.address,
			appSecret: communityConfig.appSecret,
			};

		fetch(apiEndpoint, {
		  method: 'POST', 
		  body: JSON.stringify(data), 
		  headers:{
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + sessionToken
		  }
		}).then(res => res.json())
		.then(response => console.log('Success:', JSON.stringify(response)))
		.catch(error => console.error('Error:', error));		
	}
	
	function leaveCommunity() {
		
	}
	
	function getEthereumBalance() {
		if(!wallet)
			return
		return wallet.getBalance();		
	}
	
	function getMonoplasmaBalance() {
		//is there a function for getting monoplaspa balance?
	}
	
	function withrawEarnings(amount) {
		if(!wallet)
			return;
		let provider = ethers.getDefaultProvider();
		let contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.abi, provider);
		let contractWithSigner = contract.connect(wallet);
		return contractWithSigner.withdraw(amount);
	}
	
	function withrawEarningsFor(recipient, amount) {
		if(!wallet)
			return;
		let provider = ethers.getDefaultProvider();
		let contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.abi, provider);
		let contractWithSigner = contract.connect(wallet);
		return contractWithSigner.withdrawFor(recipient, amount);		
	}
	
	return {
		createWallet: createWallet,
        loadWallet: loadWallet,
		joinCommunity: joinCommunity,
		leaveCommunity: leaveCommunity,
		withrawEarnings: withrawEarnings,
		withrawEarningsFor: withrawEarningsFor				
    };
};


export {communityHelper};

