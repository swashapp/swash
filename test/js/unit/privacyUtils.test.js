import {privacyUtils} from '../../../js/privacyUtils.js'

describe('privacyUtils', function() {
    describe('objectPrivacy', function() {
        it('Privacy level low: object type userInfo: expect no changes', function() {
			let object = "Peter"
			let objectType = "userInfo"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("Peter");
        });
		
		it('Privacy level low: object type userAttr: expect no changes', function() {
			let object = "woman"
			let objectType = "userAttr"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("woman");
        });
		
		it('Privacy level low: object type timeString: expect no changes', function() {
			let object = "Thu Nov 28 2019 13:42:46 GMT+0330 (Iran Standard Time)"
			let objectType = "timeString"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("Thu Nov 28 2019 13:42:46 GMT+0330 (Iran Standard Time)");
        });
		
		it('Privacy level low: object type url: expect no changes', function() {
			let object = "https://www.example.com/path?var1=test&var2=test"
			let objectType = "url"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("https://www.example.com/path?var1=test&var2=test");
        });
		
		it('Privacy level low: object type time: expect no changes', function() {
			let object = "1574936108678"
			let objectType = "time"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("1574936108678");
        });
		
		it('Privacy level low: object type text: expect no changes', function() {
			let object = "a sentences contains swash, Swash, sWash, and swashtest keyword"
			let objectType = "text"
			let message = {header: {privacyLevel: 0}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = ["swash"]
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("a sentences contains swash, Swash, sWash, and swashtest keyword");
        });
		
		it('Privacy level medium: object type userInfo: expect a random hash', function() {
			let object = "Peter"
			let objectType = "userInfo"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toMatch(/^[a-f0-9]{64}$/);
        });
		
		it('Privacy level medium: object type userAttr: expect a random hash', function() {
			let object = "woman"
			let objectType = "userAttr"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toMatch(/^[a-f0-9]{64}$/);
        });
		
		it('Privacy level medium: object type timeString: expect remove hours', function() {
			let object = "Thu Nov 28 2019 13:42:46 GMT+0330 (Iran Standard Time)"
			let objectType = "timeString"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("Thu Nov 28 2019 00:00:00 GMT+0330 (Iran Standard Time)");
        });
		
		it('Privacy level medium: object type url: expect remove variables and mask path', function() {
			let object = "https://www.example.com/path?var1=test&var2=test"
			let objectType = "url"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toMatch(/^https:\/\/www.example.com\/[a-f0-9]{4}$/);
        });
		
		it('Privacy level medium: object type time: expect remove hours', function() {
			let object = "1574936108678"
			let objectType = "time"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("1574886600000");
        });
		
		it('Privacy level medium: object type text: expect replace swash with *****', function() {
			let object = "a sentences contains swash, Swash, sWash, and swashtest keyword"
			let objectType = "text"
			let message = {header: {privacyLevel: 2}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = [{value:"swash"}]
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("a sentences contains *****, *****, *****, and swashtest keyword");
        });
		
		it('Privacy level high: object type userInfo: nullify userinfo', function() {
			let object = "Peter"
			let objectType = "userInfo"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("");
        });
		
		it('Privacy level high: object type userAttr: expect nullify user attributes', function() {
			let object = "woman"
			let objectType = "userAttr"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("");
        });
		
		it('Privacy level high: object type timeString: expect remove hours and days', function() {
			let object = "Thu Nov 28 2019 13:42:46 GMT+0330 (Iran Standard Time)"
			let objectType = "timeString"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("Tue Jan 01 2019 03:30:00 GMT+0330 (Iran Standard Time)");
        });
		
		it('Privacy level high: object type url: expect remove path', function() {
			let object = "https://www.example.com/path?var1=test&var2=test"
			let objectType = "url"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("https://www.example.com");
        });
		
		it('Privacy level high: object type time: expect remove hours and days', function() {
			let object = "1574936108678"
			let objectType = "time"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("1546300800000");
        });
		
		it('Privacy level high: object type text: expect nullify result', function() {
			let object = "a sentences contains swash, Swash, sWash, and swashtest keyword"
			let objectType = "text"
			let message = {header: {privacyLevel: 4}}
			const mSalt = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const salt = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = [{value:"swash"}]
            expect(privacyUtils.objectPrivacy(object, objectType, message, mSalt, salt, privacyData)).toEqual("");
        });
    });
	
	describe('identityPrivacy', function() {
        it('Privacy level low: expect fixed random identity for all requests', function() {			
			let privacyLevel = 0
			const id = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const mId = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
			let id1 = privacyUtils.identityPrivacy(id, mId, privacyLevel).id;
            expect(privacyUtils.identityPrivacy(id, mId, privacyLevel).id).toMatch(/^[a-f0-9]{64}$/).toEqual(id1);
        });
		
		it('Privacy level high: expect different identity for each request', function() {			
			let privacyLevel = 4
			const id = "523c2eda-6a8b-11e9-a923-1681be663d3e";
			const mId = "59017e28-6a8b-11e9-a923-1681be663d3e";
			let privacyData = []
			let id1 = privacyUtils.identityPrivacy(id, mId, privacyLevel).id;
            expect(privacyUtils.identityPrivacy(id, mId, privacyLevel).id).toMatch(/^[a-f0-9]{64}$/).toNotEqual(id1);
        });
	});
	
});