import {storageHelper} from '../../../js/storageHelper.js'

describe('storageHelper', function() {
	
	describe('updateProfile', function() {
        it('Update the Swash profile', async function() {
			let info = {'test': 'swash'}
			await storageHelper.updateProfile(info)
			let profile = await browser.storage.local.get('profile');
            expect(profile.profile.test).toEqual(info.test);
        });			
	});
	
	describe('retrieveFilters', function() {
        it('Retrieve all internal and external filters', async function() {
			let filters = await storageHelper.retrieveFilters();
			let sampleFilter = { value: "file:///*", type: "wildcard", internal: true };
            expect(filters).toContain(sampleFilter);
        });			
	});
	
	describe('retrieveConfigs', function() {
        it('Retrieve Swash configuration', async function() {
			let config = await storageHelper.retrieveConfigs();
            expect(config.homepage_url).toEqual("https://swashapp.io/");
        });			
	});
	
	describe('updateConfigs', function() {
        it('Update Swash configuration', async function() {
			let info = {name: 'Swash2'}
			await storageHelper.updateConfigs(info);
			let config = await browser.storage.local.get('configs');
            expect(config.configs.name).toEqual("Swash2");
        });			
	});
	
	describe('storeFilters', function() {
        it('Store filters', async function() {
			let filters1 = [{ internal: true, type: 'wildcard', value: 'file:///*' }]
			await storageHelper.storeFilters(filters1);
			let filters2 = await browser.storage.local.get('filters');
            expect(filters2.filters).toContain(filters1[0]);
        });			
	});
	
	describe('retrieveModules', function() {
        it('Retrieve all modules', async function() {
			let modules = await storageHelper.retrieveModules();
            expect(modules['Search'].name).toEqual("Search");
        });			
	});
	
	describe('updateModules', function() {
        it('Update modules', async function() {
			let info = {'Twitter':{name:'zzz'}}
			await storageHelper.updateModules(info);
			let modules = await browser.storage.local.get('modules');
            expect(modules.modules['Twitter'].name).toEqual("zzz");
        });			
	});
	
	describe('removeModule', function() {
        it('Remove Search module', async function() {
			let moduleName = 'Facebook'
			await storageHelper.removeModule(moduleName);
			let modules = await browser.storage.local.get('modules');
            expect(modules.modules['Facebook']).toNotExist();
        });			
	});
	
	describe('updatePrivacyLevel', function() {
        it('Update privacy level', async function() {
			let config = await browser.storage.local.get('configs');
			let privacyLevel = config.configs.privacyLevel;
			privacyLevel += 1;
			await storageHelper.updatePrivacyLevel(privacyLevel);
			let privacyLevel2 = (await browser.storage.local.get('configs')).configs.privacyLevel;
            expect(privacyLevel2).toEqual(privacyLevel);
        });			
	});
	
	describe('saveModuleSettings', function() {
        it('Save module settings', async function() {
			let moduleName = 'Search'
			let settings = {is_enabled: false}
			await storageHelper.saveModuleSettings(moduleName, settings)
			let modules = await browser.storage.local.get('modules');
            expect(modules.modules['Search'].is_enabled).toEqual(false);
        });			
	});
});


	