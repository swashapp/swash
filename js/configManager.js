import {storageHelper} from './storageHelper.js';
var configManager = (function() {
	const localPath = "js/configs/";
	var manifest = {}
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
			if(Object.keys(manifest).length == 0)
				manifest = await (await fetch(`${localPath}manifest.json`)).json();
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
			console.log(`Load file ${name} error: ${err}`)
		}
    }
	
	async function store() {
		storageHelper.storeData("configs", configs);		
	}
	
	async function updateAll() {    
		console.log("Try updating...");
		try {
			if(Object.keys(manifest).length == 0)
				manifest = await (await fetch(`${localPath}manifest.json`)).json();
			const manifestPath = `${manifest.remotePath}manifest.json`;
			let remoteManifest = await (await fetch(manifestPath)).json();
			for(let file in remoteManifest.files) {
				if(manifest.files[file] && remoteManifest.files[file].version > manifest.files[file].version)				
					await update(file);
				storageHelper.storeData("configs", configs);	
			}			
		}
		catch(err) {
			console.log(`Updating error: ${err}`)
		}
    }
	
    async function update(file) {
		console.log(`Updating file ${file}`);
		const confPath = `${manifest.remotePath}${file}.json`; 
		try {
			let conf = await (await fetch(confPath)).json();
			if (conf && conf.version && conf.version > configs[name].version)
				configs[name] = conf;			
		}
		catch(err) {
			console.log(`Update file ${file} error: ${err}`)
		}
    }

	
	async function updateSchedule() {
		if(Object.keys(manifest).length == 0)
			manifest = await (await fetch(`${localPath}manifest.json`)).json();
		if(intervalId > 0)
			clearInterval(intervalId);
		updateAll();
		intervalId = setInterval(updateAll, manifest.updateInterval)
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