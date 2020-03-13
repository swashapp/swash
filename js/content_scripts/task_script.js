var taskScript = (function () {
	var callbacks = {};
    var startedTasks = {};

    function uuid() {
        function randomDigit() {
            if (crypto && crypto.getRandomValues) {
                var rands = new Uint8Array(1);
                crypto.getRandomValues(rands);
                return (rands[0] % 16).toString(16);
            } else {
                return ((Math.random() * 16) | 0).toString(16);
            }
        }
        var crypto = window.crypto || window.msCrypto;
        return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
    }
    
    
	function isIterable(obj) {
	  // checks for null and undefined
	  if (obj == null) {
		return false;
	  }
	  return typeof obj[Symbol.iterator] === 'function';
	}

	function isEmpty(obj) {

		// null and undefined are "empty"
		if (obj == null) return true;

		// Assume if it has a length property with a non-zero value
		// that that property is correct.
		if (obj.length > 0)    return false;
		if (obj.length === 0)  return true;

		// If it isn't an object at this point
		// it is empty, but it can't be anything *but* empty
		// Is it empty?  Depends on your application.
		if (typeof obj !== "object") return true;

		// Otherwise, does it have any properties of its own?
		// Note that this doesn't handle
		// toString and valueOf enumeration bugs in IE < 9
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) return false;
		}

		return true;
	}


	function send_msg(msg){
		browser.runtime.sendMessage(msg);
	}

	function taskSuccess(task, data) {
		let resp = true;
		for(cn of task.conditions) {
			switch(cn.operator) {
				case '>':
					resp = resp&&(data[cn.property] > cn.value)
					break;
				case '>=':
					resp = resp&&(data[cn.property] >= cn.value)
					break;
				case '<':
					resp = resp&&(data[cn.property] < cn.value)
					break;
				case '<=':
					resp = resp&&(data[cn.property] <= cn.value)
					break;
				case '=':
					resp = resp&&(data[cn.property] == cn.value)
					break;
				case '!=':
					resp = resp&&(data[cn.property] != cn.value)
					break;
				case 'regEx':
					resp = resp&&(data[cn.property].match(cn.value))
					break;
				case 'contains':
					resp = resp&&(data[cn.property].indexOf(cn.value) >= 0)
					break;
			}
		}
		return resp;
	}

	function start_callback(task, moduleName, event) {
		let message = {
			obj: "task",
			func: "manageTask",
			params: [{
						moduleName: moduleName,
						name: task.name,
                        taskId: uuid(),
						created: false
				}]
		}
        startedTasks[task.name] = message;
		send_msg(message);	
	}


	function end_callback(task, moduleName, event){
        if(!startedTasks[task.name])
            return;
		let data = {};
		task.conditions.forEach(x=>{
			var obj = null;
			switch(x.selector) {
                case "window":
                    obj = window;
                    break;
                case "document":
                    obj = document;
                    break;
				case "":
					obj = event.currentTarget;
					break;
				case ".":
					obj = event;
					break;
				default:
					obj = document.querySelector(x.selector);
					break;
			}
			if(obj != null){
				data[x.property] = obj[x.property];
			}			
		});

		
		let message = {
			obj: "task",
			func: "manageTask",
			params: [{
						url: window.location.href,                
						moduleName: moduleName,
						name: task.name,
						success: taskSuccess(task, data),
                        created: true
				}]
		}
        delete startedTasks[task.name];
        send_msg(message);

	}

	function registerEvent(event, callback) {	
		if(event.selector == "window"){
			// window
			window.addEventListener(event.event_name, callback);
		}else 
        if(event.selector == "document"){
            // document
            document.addEventListener(event.event_name, callback);
        }
        else{
			let doms = document.querySelectorAll(event.selector)
			if(doms) {
				if(isIterable(doms)) {
					doms.forEach(dom=> {
						dom.addEventListener(event.event_name, callback);						
					})					                        
				}
				else {
					doms.addEventListener(event.event_name, callback);
				}
			}
		}		
	}

	function handleResponse(message) {	  
		message.tasks.forEach(obj=>{
			let startEvent = obj.startEvent;
			let startCallback = function(x){start_callback(obj, message.moduleName, x)};
			callbacks[message.moduleName + "_" + startEvent.event_name] = startCallback;
			registerEvent(startEvent, startCallback);
			
			let endEvent = obj.endEvent;
			let endCallback = function(x){end_callback(obj, message.moduleName, x)};
			callbacks[message.moduleName + "_" + endEvent.event_name] = endCallback;
			registerEvent(endEvent, endCallback);
				
		});
        window.addEventListener("load", (x) => {});
        startedTasks = message.startedTasks?message.startedTasks:{}
	}

	function handleError(error) {
	  console.error(`Error: ${error}`);
	}
	
	return {
		handleResponse: handleResponse,
		handleError: handleError
	}
}());





if(typeof window.surfStreamrTaskMessage === 'undefined') {
	window.surfStreamrTaskMessage = {
		obj: "task",
		func: "injectTasks",
		params: [window.location.href]
	}

	browser.runtime.sendMessage(surfStreamrTaskMessage).then(taskScript.handleResponse, taskScript.handleError);  	
}

