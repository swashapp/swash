import {storageHelper} from './storageHelper.js';
var configManager = (function() {
	const confPath = "js/configs/";
	const modulePath = "js/modules/";
	var configs = {};
	var modules = {};
	var intervalId = 0;
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
		
		//Next check storage configs
		let sModules = await storageHelper.retrieveModules()
		if(sModules && Object.keys(sModules).length > 0) 
			modules = sModules;
		else
			await importModules()
		
    }

	async function importConfs() {
		console.log("Try importing configuration files...");
		try {
			if(!configs.manifest)
				configs.manifest = await (await fetch(`${confPath}manifest.json`)).json();
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
				configs.manifest = await (await fetch(`${confPath}manifest.json`)).json();			
			//importing modules
			for(let file in configs.manifest.modules) {
				await importModule(file);
			}
		}
		catch(err) {
			console.log(`Import error: ${err}`)
		}
    }
	async function importConfig(name) {
		const cPath = `${confPath}${name}.json`; 
		try{
			let conf = await (await fetch(cPath)).json();
			configs[name] = conf;
			console.log(`Configuration file ${name} is imported`);
		}
		catch(err) {
			console.log(`Error while importing configuration file ${name}: ${err}`)
		}
    }
	
	
	async function importModule(name) {
		const mPath = `${modulePath}${name}/manifest.json`; 
		try{
			let module = await (await fetch(mPath)).json();	
			if(!module || !module.functions)
				throw "Bad configuration file";
			let mFunctions = module.functions;
			for(let func of mFunctions) {
				module[func] = await importModuleFunction(name, func);
			}
			modules[name] = module;
			console.log(`Module ${name} is imported`);
		}
		catch(err) {
			console.log(`Error while importing module ${name}: ${err}`)
		}
    }
	
	async function importModuleFunction(name, func) {
		const mFPath = `${modulePath}${name}/${func}.json`; 
		try{
			let mFunc = await (await fetch(mFPath)).json();	
			if(!mFunc)
				throw "Bad configuration file";
			console.log(`Function ${func} for module ${name} is imported`);
			 return mFunc
		}
		catch(err) {
			console.log(`Error while importing function ${func} for module ${name}: ${err}`)
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
				configs.manifest = await (await fetch(`${confPath}manifest.json`)).json();
			const manifestPath = `${configs.manifest.remotePath}/configs/manifest.json`;
			let remoteManifest = await (await fetch(manifestPath)).json();
			//update configuration files
			for(let file in remoteManifest.files) {
				if(configs.manifest.files[file] && remoteManifest.files[file].version > configs.manifest.files[file].version)				
				{
					await updateConfig(file, remoteManifest.files[file].version);
					storageHelper.storeData("configs", configs);						
				}
			}
			
			//update modules
			for(let module in remoteManifest.modules) {
				if(remoteManifest.modules[module].version > configs.manifest.modules[module].version) {
					await updateModule(module, remoteManifest.modules[module].version);
					storageHelper.storeData("modules", modules);	
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
			let conf = await (await fetch(confPath)).json();
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
	
	async function updateModule(module, version) {
		console.log(`Updating module ${module}`);
		const mPath = `${configs.manifest.remotePath}modules/${module}/manifest.json`; 		
		try{
			let module = await (await fetch(mPath)).json();
			if(!module || !module.functions)
				throw "Bad configuration file";
			let mFunctions = module.functions;
			for(let func of mFunctions) {
				let mFPath = `${configs.manifest.remotePath}modules/${module}/${func}.json`;
				let mFunc = await (await fetch(mFPath)).json();
				if(!mFunc)
					throw "Bad configuration file";
				module[func] = mFunc;				
			}
			modules[name] = module;
			console.log(`Module ${module} updated from version ${configs.manifest.modules[module].version} to ${version}`)
		}
		catch(err) {
			console.log(`Error while updating module ${name}: ${err}`)
		}			
    }

	
	async function updateSchedule() {
		if(!configs.manifest)
			configs.manifest = await (await fetch(`${confPath}manifest.json`)).json();
		if(intervalId > 0)
			clearInterval(intervalId);
		updateAll();
		intervalId = setInterval(updateAll, configs.manifest.updateInterval)
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
		importConfs,
		importModules,
		loadAll,
		importConfig,
		importModule,
		storeConfigs,
		storeModules,
		updateAll,
		updateSchedule,
		getConfig,
		getAllConfigs,
		getModule,
		getAllModules
    };
}())

export {configManager}