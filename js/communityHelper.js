import {communityConfig} from './communityConfig.js';
var communityHelper = (function() {

	let wallet;
	const provider = ethers.getDefaultProvider();
	let client;

	function createWallet() {
		wallet = ethers.Wallet.createRandom();
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
		wallet.connect(provider);
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

	function clientConnect() {
		if (!wallet) return;
		client = new StreamrClient({
			auth: {
				privateKey: wallet.privateKey,
			}
		});
	}

	async function join() {
		if (!wallet) return;
		if (!client) clientConnect();
		return client.joinCommunity(communityConfig.communityAddress, wallet.address, communityConfig.secret);
	}

	function part() {
		if (!wallet) return;
		if (!client) clientConnect();
		//client.partCommunity(communityConfig.communityAddress, wallet.address, communityConfig.secret)
	}

	// In UI: "current DATA balance in your wallet", your DATA + withdrawn tokens
	async function getBalance() {
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
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		const earningsBN = new BigNumber(stats.earnings);
		const balanceBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(balanceBN);
	}

	// In UI: "current DATA balance in the community", actually withdrawable number, what you get if you withdraw now
	async function getAvailableBalance() {
		if (!wallet) return;
		if (!client) clientConnect();
		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, provider);
		const withdrawnBN = await contract.withdrawn(wallet.address);
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		const earningsBN = new BigNumber(stats.withdrawableEarnings);
		const unwithdrawnEarningsBN = earningsBN.sub(withdrawnBN);
		return ethers.utils.formatEther(unwithdrawnEarningsBN);
	}

	// In UI: "lifetime DATA earnings in the community", latest and biggest known figure, some of it is not recorded yet
	async function getCumulativeEarnings() {
		if (!wallet) return;
		if (!client) clientConnect();
		const stats = await client.memberStats(communityConfig.communityAddress, wallet.address);
		return ethers.utils.formatEther(stats.earnings);
	}

	async function withdrawEarnings() {
		return withrawEarningsFor(wallet.address);
	}

	async function withdrawEarningsFor(memberAddress) {
		if (!wallet) return;
		if (!client) clientConnect();

		const member = await client.memberStats(communityConfig.communityAddress, memberAddress);
		if (member.withdrawableEarnings < 1) {
			throw new Error("Nothing to withdraw");
		}

		const contract = new ethers.Contract(communityConfig.communityAddress, communityConfig.communityAbi, wallet);
		return contract.withdrawAllFor(
			memberAddress,
			member.withdrawableBlockNumber,
			member.withdrawableEarnings,
			member.proof,
		).then(tx => tx.wait(1));
	}

	return {
		createWallet,
        loadWallet,
		getEncryptedWallet,
		join,
		part,
		withdrawEarnings,
		withdrawEarningsFor,
		getWalletInfo,
		getBalance,
		decryptWallet,
		getAvailableBalance,
		getCumulativeEarnings
    };
}())


export {communityHelper};

