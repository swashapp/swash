import {storageHelper} from './storageHelper.js';
var configManager = (function() {
	const localPath = "js/configs/";
	var configs = {};
	var intervalId = 0;
	async function loadAll() {
		//First check in memory configs
		if(Object.keys(configs).length > 0)
			return;
		
		//Next check in storage configs
		let sConfigs = await storageHelper.retrieveConfigs()
		if(sConfigs && sConfigs.manifest && sConfigs.manifest.length > 0) {
			configs = sConfigs;
			return;
		}
		
		//Lastly import configs from js files
		await importAll();
    }

	async function importAll() {
		console.log("Try importing...");
		try {
			let	manifest = await (await fetch(`${localPath}manifest.json`)).json();
			configs['manifest'] = manifest;
			for(let file in manifest.files) {
				await load(file);
			}			
		}
		catch(err) {
			console.log(`Import error: ${err}`)
		}
    }
	
	async function load(name) {
		const confPath = `${localPath}${name}.json`; 
		try{
			let conf = await (await fetch(confPath)).json();			
			configs[name] = conf			
		}
		catch(err) {
			console.log(`Error on loading file ${name}: ${err}`)
		}
    }
	
	async function store() {
		storageHelper.storeData("configs", configs);		
	}
	
	async function updateAll() {    
		console.log("Try updating...");
		try {
			if(!configs.manifest)
				configs.manifest = await (await fetch(`${localPath}manifest.json`)).json();
			const manifestPath = `${configs.manifest.remotePath}manifest.json`;
			let remoteManifest = await (await fetch(manifestPath)).json();
			for(let file in remoteManifest.files) {
				if(configs.manifest.files[file] && remoteManifest.files[file].version > configs.manifest.files[file].version)				
					await update(file, remoteManifest.files[file].version);
				storageHelper.storeData("configs", configs);	
			}			
		}
		catch(err) {
			console.log(`Updating error: ${err}`)
		}
    }
	
    async function update(file, version) {
		console.log(`Updating file ${file}`);
		const confPath = `${configs.manifest.remotePath}${file}.json`; 
		try {
			let conf = await (await fetch(confPath)).json();
			if (conf) {
				console.log(`file ${file} updated from version ${configs.manifest.files[file].version} to ${version}`)
				configs[file] = conf;
				configs.manifest.files[file].version = version;
			}
		}
		catch(err) {
			console.log(`Error on Updating file ${file}: ${err}`)
		}
    }

	
	async function updateSchedule() {
		if(!configs.manifest)
			configs.manifest = await (await fetch(`${localPath}manifest.json`)).json();
		if(intervalId > 0)
			clearInterval(intervalId);
		updateAll();
		intervalId = setInterval(updateAll, configs.manifest.updateInterval)
	}
	
	function get(name) {
		return configs[name];
	}
	
	function getAll() {
		return configs;
	}
	
	return {
		importAll,
		loadAll,
		load,
		store,
		updateAll,
		updateSchedule,
		get,
		getAll
    };
}())

export {configManager}