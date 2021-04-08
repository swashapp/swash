import {configManager} from './configManager.js';

let communityHelper = (function() {
	let wallet;
	let communityConfig;
	let timestamp = 0;
	let lastUpdate = 0;
	let client;
	let duHandler;
	const overrides = {};
	const provider = ethers.getDefaultProvider();

	function init() {
		communityConfig = configManager.getConfig('community');	
	}

	function etherjsErrorMapping(error) {
		if(error.indexOf('insufficient funds') >= 0)
			return "Insufficient ETH to pay for the gas fee";
		return error;
	}
	
	function createWallet() {
		wallet = ethers.Wallet.createRandom();
		return wallet;
	}

	async function getEncryptedWallet(password) {
		if (!wallet) return {error: "Wallet is not provided"};
		let options = {
		  scrypt: {
			N: (1 << 10)
		  }
		};
		return await wallet.encrypt(password, options);
	}

	async function loadWallet(encryptedWallet, password) {
		wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
		wallet = wallet.connect(provider);
	}

	async function decryptWallet(encryptedWallet, password) {
		wallet = await ethers.Wallet.fromEncryptedJson(encryptedWallet, password);
		return {
			address: wallet.address,
			privateKey: wallet.privateKey
		}
	}

	function getWalletInfo() {
		return {
			address: wallet.address,
			privateKey: wallet.privateKey
		}
	}

	function getStreamrClient() {
		if (!client) clientConnect();
		return client
	}

	function clientConnect() {
		if (!wallet) return;
		client = new StreamrClient({
			auth: {
				privateKey: wallet.privateKey,
			},
			publishWithSignature: 'never'
		});
		duHandler = client.getDataUnion(communityConfig.communityAddress)
	}

	async function getEthBalance(address) {
		if (!provider) return {error: "provider is not provided"};
		let balance = await provider.getBalance(address);
		return ethers.utils.formatEther(balance);
	}

	// In UI: "current DATA balance in your wallet", your DATA + withdrawn tokens
	async function getDataBalance(address) {
		const mainnetTokens = await client.getTokenBalance(address)
		const sidechainTokens = await client.getSidechainTokenBalance(address)
		const balance = mainnetTokens.add(sidechainTokens);
		return ethers.utils.formatEther(balance);
	}

	// In UI: "current DATA balance in the community", actually withdrawable number, what you get if you withdraw now
	async function getAvailableBalance() {
		if (!wallet) return {error: "Wallet is not provided"};
		if (!client) clientConnect();
		const withdrawableEarnings = await duHandler.getWithdrawableEarnings(wallet.address);
		return ethers.utils.formatEther(withdrawableEarnings);
	}

	// In UI: "lifetime DATA earnings in the community", latest and biggest known figure, some of it is not recorded yet
	async function getCumulativeEarnings() {
		if (!wallet) return {error: "Wallet is not provided"};
		if (!client) clientConnect();
		const memberStats = await duHandler.getMemberStats(wallet.address);
		if(memberStats.error) return {error: "Member status error"};
		return ethers.utils.formatEther(memberStats.totalEarnings);
	}

	// on-chain balance + available balance
	async function getTotalBalance() {
		if (!wallet) return {error: "Wallet is not provided"};
		let balance = ethers.utils.parseEther(await getDataBalance(wallet.address));
		let aBalance = ethers.utils.parseEther(await getAvailableBalance());
		return ethers.utils.formatEther(balance.add(aBalance));
	}

	async function signWithdrawAllTo(targetAddress) {
		if (!wallet || !provider) return {error: "Wallet is not provided"};
		if (!client) clientConnect();

		try {
			return await duHandler.signWithdrawAllTo(targetAddress);
		}
		catch(err) {
			return {error: etherjsErrorMapping(err.reason)};
		}
	}

	async function signWithdrawAmountTo(targetAddress, amount) {
		if (!wallet || !provider) return {error: "Wallet is not provided"};
		if (!client) clientConnect();
		wallet = wallet.connect(provider);

		const amountBN = ethers.utils.parseEther(amount);

		const withdrawableEarnings = await duHandler.getWithdrawableEarnings(wallet.address);
		if (amountBN.gt(withdrawableEarnings)) {
			return {error: "Nothing to withdraw"};
		}

		try {
			return await duHandler.signWithdrawAmountTo(targetAddress, amountBN.toString())
		}
		catch(err) {
			return {error: etherjsErrorMapping(err.reason)};
		}
	}

	async function transportMessage(message) {
		try {
			const tx = await duHandler.transportMessage(message);
			return {tx: tx.transactionHash};
		} catch (err) {
			return {error: etherjsErrorMapping(err.reason)};
		}
	}

	async function updateTimestamp() {
		if (lastUpdate === 0 || lastUpdate + communityConfig.tokenExpiration < Date.now()) {
			const resp = await fetch('https://api.swashapp.io/v1/sync/timestamp', {method: 'GET'})
			if (resp.status === 200) {
				timestamp = (await resp.json()).timestamp
				lastUpdate = Date.now()
			} else {
				throw Error("Could not update timestamp")
			}
		}
	}

	async function generateJWT() {
		try {
			await updateTimestamp();
			const payload = {
				address: wallet.address,
				publicKey: ethers.utils.computePublicKey(wallet.publicKey, true),
				timestamp: timestamp
			}
			return new jsontokens.TokenSigner('ES256K', wallet.privateKey.slice(2)).sign(payload);
		} catch (err) {
			console.log(err)
		}
	}

	return {
		init,
		createWallet,
        loadWallet,
		getEncryptedWallet,
		signWithdrawAllTo,
		signWithdrawAmountTo,
		getWalletInfo,
		getDataBalance,
		decryptWallet,
		getAvailableBalance,
		getCumulativeEarnings,
		getTotalBalance,
		getStreamrClient,
		getEthBalance,
		transportMessage,
		generateJWT,
    };
}())


export {communityHelper};

