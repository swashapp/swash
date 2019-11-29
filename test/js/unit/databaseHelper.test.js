import {databaseHelper} from '../../../js/databaseHelper.js'

describe('databaseHelper', function() {
	before(async function() {		
		await databaseHelper.init();
		let message = {name: 'test'}
		await databaseHelper.insertMessage(message);
	});
	
	describe('getMessageCount', function() {
        it('Get message count for Search module', async function() {
			let module = "Search"
			let count = await databaseHelper.getMessageCount(module)
            expect(count).toBeGreaterThanOrEqualTo(0);
        });			
	});
	
	describe('getTotalMessageCount', function() {
        it('Get total message count', async function() {
			let count = await databaseHelper.getTotalMessageCount()
            expect(count).toBeGreaterThanOrEqualTo(0);
        });			
	});
	
	describe('updateMessageCount', function() {
        it('Update message count for Search module', async function() {
			let module = "Search"
			let count1 = await databaseHelper.getMessageCount(module)
			await databaseHelper.updateMessageCount(module)
			let count2 = await databaseHelper.getMessageCount(module)
            expect(count2).toEqual(count1 + 1);
        });			
	});
	
	describe('getLastSentDate', function() {
        it('Get the time for the last data sending', async function() {
			let sendDate = await databaseHelper.getLastSentDate()
            expect(sendDate).toBeGreaterThanOrEqualTo(0);
        });			
	});
	
	describe('getAllMessages', function() {
        it('Get all messages stored in database', async function() {
			let messages = await databaseHelper.getAllMessages()
            expect(messages.length).toBeGreaterThanOrEqualTo(0);
        });			
	});
});

