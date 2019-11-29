import {communityHelper} from '../../../js/communityHelper.js'

describe('communityHelper', function() {
	this.timeout(15000);
	describe('getEncryptedWallet', function() {
        it('Encrypt wallet using password 123', async function() {
			let password = "123"
			communityHelper.createWallet();
			let eWallet = await communityHelper.getEncryptedWallet(password)
            expect(JSON.parse(eWallet).Crypto.ciphertext).toMatch(/^[0-9a-f]+$/);
        });			
	});
	
	describe('decryptWallet', function() {
        it('Decrypt an encrypted wallet using password 123', async function() {
			let password = "123"
			let wallet1 = communityHelper.createWallet();
			let eWallet = await communityHelper.getEncryptedWallet(password)
			let wallet2 = await communityHelper.decryptWallet(eWallet, password)
            expect(wallet1.privateKey).toEqual(wallet2.privateKey);
        });			
	});
	
	describe('join', function() {
        it('Join to Swash community product', async function() {
			//communityHelper.createWallet();
			let res = await communityHelper.join();
			expect(res.state).toEqual("ACCEPTED");
        });			
	});
	
	describe('getBalance', function() {
        it('Get on chain balance', async function() {
			//communityHelper.createWallet();
			let balance = await communityHelper.getBalance();
			expect(parseFloat(balance)).toEqual(0);
        });			
	}); 
	
	describe('getCumulativeEarnings', function() {
        it('Get cummlative earnings', async function() {
			//communityHelper.createWallet();
			//await communityHelper.join();
			let balance = await communityHelper.getCumulativeEarnings();
			expect(parseFloat(balance)).toEqual(0);
        });			
	}); 
	
	describe('getAvailableBalance', function() {
        it('Get on chain balance', async function() {
			//communityHelper.createWallet();
			//await communityHelper.join();
			let aBalance = await communityHelper.getAvailableBalance();
			expect(parseFloat(aBalance)).toEqual(0);
        });			
	});
});