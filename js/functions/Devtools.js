console.log("Devtools.js");
import {StorageHelper} from '../StorageHelper.js';
import {Utils} from '../Utils.js';

var Devtools = (function() {
    'use strict';
    
	var cfilter = {urls: [], properties: ["status"]};            
    
    function unload(){        
    }

    function load(){        
    }
    
    function unload_module(module){
    }

    function load_module(module){

    }
	


	async function injectRules(moduleName) {
        var modules = await StorageHelper.retrieveModules();
		if(modules[moduleName].is_enabled){
			let devtools = modules[moduleName].devtools.filter(function(ele){
				return ele.is_enabled == true;
			});
			return {moduleName: modules[moduleName].name, devtools: devtools, url_matches: modules[moduleName].devtools_matches};
		}
		return {moduleName: "", devtools: "", url_matches:""};	
	}
	
	async function panelList() {
		let panels  = [];
        var modules = await StorageHelper.retrieveModules();
		for (var module in modules) {
			if(modules[module].functions.includes("devtools")){			
				if(modules[module].is_enabled) {
					panels.push(modules[module].name)
				}				
			}
		}    
		return panels;
	}

	
    return {
        load: load,
        unload: unload,
        unload_module: unload_module,
        load_module: load_module,
		injectRules: injectRules,
		panelList: panelList
    };
}());
export {Devtools};