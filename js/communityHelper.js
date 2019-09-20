import {communityConfig} from './communityConfig.js';
var communityHelper = function() {

	let wallet
	let contract
	const provider = ethers.getDefaultProvider();

	function createWallet(password) {
		wallet = ethers.Wallet.createRandom();
		let encryptPromise = wallet.encrypt(password);
		encryptPromise.then(function(encryptedJson) {
			//store encryptedJson
		});
	}

	function loadWallet(password, encryptedJson) {
		let json = JSON.stringify(encryptedJson);
		ethers.Wallet.fromEncryptedJson(json, password).then(function(_wallet) {
			wallet = _wallet
			wallet.connect(provider)
			contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.abi, wallet);
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
		if (!wallet || !sessionToken) return;

		let apiEndpoint = communityConfig.apiBaseURL + "/" + communityConfig.communityAddress + "/joinRequests"
		var data = {
			memberAddress: wallet.address,
			secret: communityConfig.secret,
		};

		fetch(apiEndpoint, {
		  method: 'POST',
		  body: JSON.stringify(data),
		  headers: {
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
		if (!wallet) return
		return wallet.getBalance();
	}

	function getMonoplasmaBalance() {
		//is there a function for getting monoplaspa balance?
	}

	function withrawEarnings() {
		if (!wallet) return;
		return withrawEarningsFor(wallet.address)
	}

	function withrawEarningsFor(recipient) {
		if (!contract) return;

		//GET https://streamr.com/api/v1/communities/{communityAddress}/members/{recipient}
		const member = {
			address: "0xdC353aA3d81fC3d67Eb49F443df258029B01D8aB",
			earnings: "333333333333333333",
			active: true,
			proof: [
				"0xd92d93e1a5532affe4f635cc97c555c39413ceecea690323cbd2d21b0d5acb8d",
				"0x6cfa6f3735edabee127ccb3ad7dc4a9aba79993664eead578e3544b7dc58c515"
			],
			recordedEarnings: "333333333333333333",
			withdrawableEarnings: "0",
			withdrawableBlockNumber: "1",
			frozenEarnings: "333333333333333333"
		}

		return contract.withdrawAll(
			member.withdrawableBlockNumber,
			member.withdrawableEarnings,
			member.proof
		).then(tx => tx.wait(1))
	}

	return {
		createWallet,
        loadWallet,
		joinCommunity,
		leaveCommunity,
		withrawEarnings,
		withrawEarningsFor,
    };
};


export {communityHelper};

