import {communityConfig} from './communityConfig.js';
var communityHelper = function() {
	
	var wallet = ""

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
	
	function joinCommunity() {
		let apiEndpoint = communityConfig.apiBaseURL + "/" + communityConfig.communityAddress + "/" + communityAddress.joinAction
		//POST https://streamr.com/api/v1/communities/{communityAddress}/joinRequests
		//{
		//	“memberAddress”: “0x12345”,
		//	“appSecret”: “secret”, // optional
		//}
		
		//signing method??
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

