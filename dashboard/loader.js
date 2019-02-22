function jsonUpdate(src, newObj) {
	if(Array.isArray(newObj))
	{
		src.length = 0
		for(item of newObj)
			src.push(item);
		return;
	}
	for (var prop in newObj) { 
		var val = newObj[prop];
		if (val != null && typeof val == "object") {// this also applies to arrays or null!
			if(Array.isArray(val)) {
				src[prop] = val;
			}
			else {
				if(!src[prop])
					src[prop] = {};	
				jsonUpdate(src[prop], val);
			}
		}
		else
			src[prop] = val;
		
	}
		
}
async function storeAll(db) {
        await browser.storage.sync.set(db);        
		console.log("test", db);
}
    

function retrieveAll(){
	return browser.storage.sync.get();        
}

async function storeData(key, info)
{
	console.log("key", key);
	console.log("info", info);
	var data = await retrieveData(key);   
	console.log("data", data);            
	jsonUpdate(data,info);
	console.log("updated data", data);
	let x = {};
	x[key] = data;
	browser.storage.sync.set(x);
	
}
async function retrieveData(key)
{
	let x = await browser.storage.sync.get(key); 
	console.log("retrive data ", x[key]);        
	return x[key];
}


var helper = (function() {
    function loadFilters(){
        return retrieveData("filters");
    }
    function load(){
        return retrieveAll();
    }
    function save(data){
        console.log(data);
    }
    function saveFilters(data){
        storeData("filters", data);
    }
return {
        load: load,
        save: save,
        loadFilters: loadFilters,
		saveFilters: saveFilters
    };
}());