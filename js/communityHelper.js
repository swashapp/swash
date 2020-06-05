import {configManager} from './configManager.js';


var communityHelper = (function() {

	let wallet;
	var communityConfig;

	function init() {
		communityConfig = configManager.getConfig('community');
	}

	const provider = ethers.getDefaultProvider();
	let client;
	const GAS_PRICE_LIMIT = ethers.utils.parseUnits('18', 'gwei')
	const overrides = {
		/*gasPrice: ethers.utils.parseUnits('18', 'gwei'),

		gasPrice: async () => {
			const gasPrice = await provider.getGasPrice()
			if (gasPrice.gt(GAS_PRICE_LIMIT)) {
				return GAS_PRICE_LIMIT
			} else {
				return gasPrice
			}
		}
		*/
	};

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
		let encryptedWallet = await wallet.encrypt(password, options);
		return encryptedWallet;
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
			}
		});
	}

	async function join() {
		if (!wallet) return false;
		if (!client) clientConnect();
		let x = await client.joinCommunity(communityConfig.communityAddress, wallet.address, communityConfig.secret);
		return x;
	}

	function part() {
		if (!wallet) return;
		if (!client) clientConnect();
		//client.partCommunity(communityConfig.communityAddress, wallet.address, communityConfig.secret)
	}

	async function getEthBalance(address) {
		if (!provider) return {error: "provider is not provided"};;
		let balance = await provider.getBalance(address);
		return ethers.utils.formatEther(balance);
	}


	// In UI: "current DATA balance in your wallet", your DATA + withdrawn tokens
	async function getDataBalance(address) {
		if (!provider) return {error: "provider is not provided"};;
		const datacoin = new ethers.Contract(communityConfig.datacoinAddress, communityConfig.datacoinAbi, provider);
		const balance = await datacoin.balanceOf(address);
		return ethers.utils.formatEther(balance);
	}

	// In UI: "current DATA balance in the community", latest and biggest known figure, some of it is not recorded yet
	// Balance = Earnings - Withdrawn
	async function getCommunityBalance() {
		if (!wallet) return {error: "Wallet is not provided"};;
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return {error: "Member status error"};
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const earningsBN = ethers.utils.bigNumberify(stats.earnings);
		const balanceBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(balanceBN);
	}

	// In UI: "current DATA balance in the community", actually withdrawable number, what you get if you withdraw now
	async function getAvailableBalance() {
		if (!wallet) return {error: "Wallet is not provided"};
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return {error: "Member status error"};
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const earningsBN = ethers.utils.bigNumberify(stats.withdrawableEarnings);
		const unwithdrawnEarningsBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(unwithdrawnEarningsBN);
	}

	// In UI: "lifetime DATA earnings in the community", latest and biggest known figure, some of it is not recorded yet
	async function getCumulativeEarnings() {
		if (!wallet) return {error: "Wallet is not provided"};
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return {error: "Member status error"};;
		return ethers.utils.formatEther(stats.earnings);
	}

	// on-chain balance + available balance
	async function getTotalBalance() {
		if (!wallet) return {error: "Wallet is not provided"};
		let balance = ethers.utils.parseEther(await getDataBalance(wallet.address));
		let aBalance = ethers.utils.parseEther(await getAvailableBalance());
		return ethers.utils.formatEther(balance.add(aBalance));
	}

	async function withdrawEarnings() {
		return withdrawEarningsFor(wallet.address);
	}

	// Click Transfer button in Wallet
	async function withdrawAllTo(targetAddress) {
		if (!wallet || !provider) return {error: "Wallet is not provided"};
		if (!client) clientConnect();

		const member = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if (member.error || member.withdrawableEarnings < 1) {
			return {error: "Nothing to withdraw"};
		}
		wallet = wallet.connect(provider);
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, wallet);
		try {
			let resp = await contract.withdrawAllTo(
				targetAddress,
				member.withdrawableBlockNumber,
				member.withdrawableEarnings,
				member.proof,
				overrides
			);
			return resp;
		}
		catch(err) {
			return {error: etherjsErrorMapping(err.message)};
		}
	}

	// Click Transfer button in Wallet with specified amount
	async function withdrawTo(targetAddress, amount) {
		// TODO check with ebi
		if (!wallet || !provider) return {error: "Wallet is not provided"};;
		if (!client) clientConnect();
		let memberAddress = wallet.address;
		const amountBN = ethers.utils.bigNumberify(ethers.utils.parseEther(amount));

		wallet = wallet.connect(provider);
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, wallet);
		const withdrawn = await contract.withdrawn(memberAddress)

		const member = await client.memberStats(communityConfig.communityAddress, memberAddress);
		if (member.error || member.withdrawableEarnings < 1) {
			return {error: "Nothing to withdraw"};
		}
		if (ethers.utils.bigNumberify(member.withdrawableEarnings).sub(withdrawn).lt(amountBN)){
			return {error: "Insufficient balance"};
		}

		// have we proven enough earnings previously?
		try {
			const provenEarnings = await contract.earnings(memberAddress)
			if (provenEarnings.sub(withdrawn).lt(amountBN)) {
				// function prove(uint blockNumber, address account, uint balance, bytes32[] memory proof)

				const tx = await contract.prove(
					member.withdrawableBlockNumber,
					memberAddress,
					member.withdrawableEarnings,
					member.proof,
					overrides
				)
				const tr = await tx.wait(1)
				console.log(`Prove success, Ethereum receipt: ${JSON.stringify(tr)}`)
			}

			let resp = await contract.withdrawTo(
				targetAddress,
				amountBN,
				overrides
			);
			return resp;
		}
		catch(err) {
			return {error: etherjsErrorMapping(err.message)};
		}
	}

	async function withdrawEarningsFor(memberAddress) {
		if (!wallet || !provider) return {error: "Wallet is not provided"};
		if (!client) clientConnect();

		const member = await client.memberStats(communityConfig.communityAddress, memberAddress);
		if (member.error || member.withdrawableEarnings < 1) {
			return {error: "Nothing  to withdraw"};
		}
		wallet = wallet.connect(provider);
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, wallet);
		try {
			let resp = await contract.withdrawAllFor(
				memberAddress,
				member.withdrawableBlockNumber,
				member.withdrawableEarnings,
				member.proof,
				overrides
			);
			return resp;
		}
		catch(err) {
			return {error: etherjsErrorMapping(err.message)};
		}
	}

	return {
		init,
		createWallet,
        loadWallet,
		getEncryptedWallet,
		join,
		part,
		withdrawEarnings,
		withdrawEarningsFor,
		withdrawTo,
		withdrawAllTo,
		getWalletInfo,
		getDataBalance,
		decryptWallet,
		getAvailableBalance,
		getCumulativeEarnings,
		getTotalBalance,
		getStreamrClient,
		getEthBalance
    };
}())


export {communityHelper};

