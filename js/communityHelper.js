import {communityConfig} from './communityConfig.js';

var communityHelper = (function() {

	let wallet;
	const provider = ethers.getDefaultProvider();
	let client;
	const GAS_PRICE_LIMIT = ethers.utils.parseUnits('18', 'gwei')
	const overrides = {
		gasPrice: ethers.utils.parseUnits('18', 'gwei'),
		/*
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

	function createWallet() {
		wallet = ethers.Wallet.createRandom();
		return wallet;
	}

	async function getEncryptedWallet(password) {
		if (!wallet) return;
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
		console.log("Join: ", x);
		return x;
	}

	function part() {
		if (!wallet) return;
		if (!client) clientConnect();
		//client.partCommunity(communityConfig.communityAddress, wallet.address, communityConfig.secret)
	}

	async function getEthBalance(address) {
		if (!wallet || !provider) return;
		let balance = await provider.getBalance(wallet.address);
		return ethers.utils.formatEther(balance);
	}
	
	
	// In UI: "current DATA balance in your wallet", your DATA + withdrawn tokens
	async function getDataBalance() {
		if (!wallet || !provider) return;
		const datacoin = new ethers.Contract(communityConfig.datacoinAddress, communityConfig.datacoinAbi, provider);
		const balance = await datacoin.balanceOf(wallet.address);
		return ethers.utils.formatEther(balance);
	}

	// In UI: "current DATA balance in the community", latest and biggest known figure, some of it is not recorded yet
	// Balance = Earnings - Withdrawn
	async function getCommunityBalance() {
		if (!wallet) return;
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return "0.00";
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const earningsBN = new BigNumber(stats.earnings);
		const balanceBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(balanceBN);
	}

	// In UI: "current DATA balance in the community", actually withdrawable number, what you get if you withdraw now
	async function getAvailableBalance() {
		if (!wallet) return;
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return "0.00";
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const earningsBN = new BigNumber(stats.withdrawableEarnings);
		const unwithdrawnEarningsBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(unwithdrawnEarningsBN);
	}

	// In UI: "lifetime DATA earnings in the community", latest and biggest known figure, some of it is not recorded yet
	async function getCumulativeEarnings() {
		if (!wallet) return;
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if(stats.error) return "0.00";
		return ethers.utils.formatEther(stats.earnings);
	}

	// on-chain balance + available balance
	async function getTotalBalance() {
		let balance = ethers.utils.parseEther(await getDataBalance());
		let aBalance = ethers.utils.parseEther(await getAvailableBalance());
		return ethers.utils.formatEther(balance.add(aBalance));
	}

	async function withdrawEarnings() {
		return withdrawEarningsFor(wallet.address);
	}

	// Click Transfer button in Wallet
	async function withdrawAllTo(targetAddress) {
		if (!wallet || !provider) return;
		if (!client) clientConnect();

		const member = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if (member.error || member.withdrawableEarnings < 1) {
			return Promise.reject("Nothing to withdraw");
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
			return Promise.reject(new Error(err.message));
		}
	}

	// Click Transfer button in Wallet with specified amount
	async function withdrawTo(targetAddress, amount) {
		// TODO check with ebi
		if (!wallet || !provider) return;
		if (!client) clientConnect();
		const amountBN = new BigNumber(amount)

		wallet = wallet.connect(provider);
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, wallet);
		const withdrawn = await contract.withdrawn(memberAddress)

		const member = await client.memberStats(communityConfig.communityAddress, wallet.address);
		if (member.error || member.withdrawableEarnings < 1) {
			return Promise.reject("Nothing to withdraw");
		}
		if (new Bignumber(member.withdrawableEarnings).sub(withdrawn).lt(amountBN)){
			return Promise.reject("Insufficient balance");
		}

		// have we proven enough earnings previously?
		const provenEarnings = await contract.earnings(memberAddress)		
		if (provenEarnings.sub(withdrawn).lt(amountBN)) {
			// function prove(uint blockNumber, address account, uint balance, bytes32[] memory proof)
			await contract.prove(
				member.withdrawableBlockNumber,
				memberAddress,
				member.withdrawableEarnings,
				member.proof,
				overrides
			)
		}

		try {
			let resp = await contract.withdrawTo(
				memberAddress,
				wallet.address,
				amountBN,
				overrides
			);
			return resp;
		}
		catch(err) {
			return Promise.reject(new Error(err.message));
		}
	}

	async function withdrawEarningsFor(memberAddress) {
		if (!wallet || !provider) return;
		if (!client) clientConnect();

		const member = await client.memberStats(communityConfig.communityAddress, memberAddress);
		if (member.error || member.withdrawableEarnings < 1) {
			return Promise.reject("Nothing to withdraw");
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
			return Promise.reject(new Error(err.message));
		}
	}

	return {
		createWallet,
        loadWallet,
		getEncryptedWallet,
		join,
		part,
		withdrawEarnings,
		withdrawEarningsFor,
		withdrawTo,
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

