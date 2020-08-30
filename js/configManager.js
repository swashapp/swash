import {storageHelper} from './storageHelper.js';


var configManager = (function() {
	const confPath = "js/configs/";
	const modulePath = "js/modules/";
	var configs = {};
	var modules = {};
	async function loadAll() {
		console.log("Try loading configuration files and modules...");
		//First check memory configs
		if(Object.keys(configs).length > 0 && Object.keys(modules).length > 0)
			return;
		
		//Next check storage configs
		let sConfigs = await storageHelper.retrieveConfigs()
		if(sConfigs && sConfigs.manifest && sConfigs.manifest.length > 0) 
			configs = sConfigs;
		else
			await importConfs();
		
		//Next check storage modules
		let sModules = await storageHelper.retrieveModules()
		if(sModules && Object.keys(sModules).length > 0) 
			modules = sModules;
		else
			await importModules()
		
    }

	async function importAll() {
		configs = {};
		modules = {};
		await importConfs();
		await importModules()
	}
	
	async function importConfs() {
		console.log("Try importing configuration files...");
		try {
			if(!configs.manifest)
				configs.manifest = await (await fetch(`${confPath}config.json`, {cache: "no-store"})).json();
			//importing configuration files
			for(let file in configs.manifest.files) {
				await importConfig(file);
			}		
		}
		catch(err) {
			console.log(`Import error: ${err}`)
		}
    }
	
	
	async function importModules() {
		console.log("Try importing modules...");
		try {
			if(!configs.manifest)
				configs.manifest = await (await fetch(`${confPath}config.json`, {cache: "no-store"})).json();			
			//importing modules
			for(let category in configs.manifest.modules) {
				for(let name in configs.manifest.modules[category])
					await importModule(category, name, configs.manifest.modules[category][name]['version']);
			}
		}
		catch(err) {
			console.log(`Import error: ${err}`)
		}
    }
	async function importConfig(name) {
		const cPath = `${confPath}${name}.json`; 
		try{
			let conf = await (await fetch(cPath, {cache: "no-store"})).json();
			configs[name] = conf;
			console.log(`Configuration file ${name} is imported`);
		}
		catch(err) {
			console.log(`Error while importing configuration file ${name}: ${err}`)
		}
    }
	
	
	async function importModule(category, name, version) {
		const mPath = `${modulePath}${category}/${name}/config.json`; 
		try{
			let module = await (await fetch(mPath, {cache: "no-store"})).json();	
			if(!module || !module.functions)
				throw "Bad configuration file";
			let mFunctions = module.functions;
			module['category'] = category;
			module['version'] = version;
			for(let func of mFunctions) {
				module[func] = await importModuleFunction(category, name, func);
			}
			modules[module.name] = module;
			console.log(`Module ${category}:${name} is imported`);
		}
		catch(err) {
			console.log(`Error while importing module ${category}:${name}: ${err}`)
		}
    }
	
	async function importModuleFunction(category, name, func) {
		const mFPath = `${modulePath}${category}/${name}/${func}.json`; 
		try{
			let mFunc = await (await fetch(mFPath, {cache: "no-store"})).json();	
			if(!mFunc)
				throw "Bad configuration file";
			console.log(`Function ${func} for module ${category}:${name} is imported`);
			 return mFunc
		}
		catch(err) {
			console.log(`Error while importing function ${func} for module ${category}:${name}: ${err}`)
		}
    }
	
	
	async function storeConfigs() {
		storageHelper.storeData("configs", configs);		
	}
	
	async function storeModules() {
		storageHelper.storeData("modules", modules);		
	}
	
	async function updateAll() {    
		console.log("Try updating...");
		try {
			if(!configs.manifest)
				configs.manifest = await (await fetch(`${confPath}config.json`, {cache: "no-store"})).json();
			const manifestPath = `${configs.manifest.remotePath}/configs/config.json`;
			let remoteManifest = await (await fetch(manifestPath, {cache: "no-store"})).json();
			//update configuration files
			for(let file in remoteManifest.files) {
				if(configs.manifest.files[file] && remoteManifest.files[file].version > configs.manifest.files[file].version)				
				{
					await updateConfig(file, remoteManifest.files[file].version);					
				}
			}
			
			//update modules
			for(let category in remoteManifest.modules) {
				for(let module in remoteManifest.modules[category])
					if(configs.manifest.modules[category] || configs.manifest.modules[category][module] || remoteManifest.modules[category][module].version > configs.manifest.modules[category][module].version) {
						await updateModule(module, category, remoteManifest.modules[category][module].version);					
					}
			}
			
		}
		catch(err) {
			console.log(`Updating error: ${err}`)
		}
    }
	
    async function updateConfig(file, version) {
		console.log(`Updating configuration file ${file}`);
		const confPath = `${configs.manifest.remotePath}configs/${file}.json`; 
		try {
			let conf = await (await fetch(confPath, {cache: "no-store"})).json();
			if (conf) {
				console.log(`Configuration file ${file} updated from version ${configs.manifest.files[file].version} to ${version}`)
				configs[file] = conf;
				configs.manifest.files[file].version = version;
			}
		}
		catch(err) {
			console.log(`Error on Updating configuration file ${file}: ${err}`)
		}
    }
	
	async function updateModule(category, name, version) {
		console.log(`Updating module ${category}:${name}`);
		const mPath = `${configs.manifest.remotePath}modules/${category}/${name}/config.json`; 		
		try{
			let module = await (await fetch(mPath, {cache: "no-store"})).json();
			if(!module || !module.functions)
				throw "Bad configuration file";
			
			module['category'] = category;
			module['version'] = version;
			let mFunctions = module.functions;
			for(let func of mFunctions) {
				let mFPath = `${configs.manifest.remotePath}modules/${category}/${name}/${func}.json`;
				let mFunc = await (await fetch(mFPath, {cache: "no-store"})).json();
				if(!mFunc)
					throw "Bad configuration file";
				module[func] = mFunc;				
			}
			modules[module.name] = module;
			console.log(`Module ${category}:${name} updated from version ${configs.manifest.modules[category][name].version} to ${version}`)
			if(!configs.manifest.modules[category]) {
				console.log(`New category with name ${category} is added`);
				configs.manifest.modules[category] = {};
			}
			if(!configs.manifest.modules[category][name]) {
				console.log(`New module with name ${name} is added to the category ${category}`);
				configs.manifest.modules[category][name] = {};
			}	
			configs.manifest.modules[category][name].version = version;
		}
		catch(err) {
			console.log(`Error while updating module ${category}:${name}: ${err}`)
		}			
    }
	
	
	function getConfig(name) {
		return configs[name];
	}
	
	function getAllConfigs() {
		return configs;
	}
	
	function getModule(name) {
		return modules[name];
	}
	
	function getAllModules() {
		return modules;
	}
	
	return {
		importAll,
		importConfs,
		importModules,
		loadAll,
		importConfig,
		importModule,
		storeConfigs,
		storeModules,
		updateAll,
		getConfig,
		getAllConfigs,
		getModule,
		getAllModules
    };
}())

export {configManager}