let tokenAddress = "0x0cf0ee63788a0849fe5297f3407f701e122cc023";
let walletAddress = "0x742d35cc6634c0532925a3b844bc454e4438f44e";

// The minimum ABI to get ERC20 Token balance
let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];
	
web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/TOKEN"));

	
function getBalance() {
	// Get ERC20 Token contract instance
	let contract = web3.eth.contract(minABI).at(tokenAddress);

	// Call balanceOf function
	contract.balanceOf(walletAddress, (error, balance) => {
	  // Get decimals
	  contract.decimals((error, decimals) => {
		// calculate a balance
		balance = balance.div(10**decimals);
		console.log(balance.toString());
	  });
	});
}