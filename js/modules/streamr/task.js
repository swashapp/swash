console.log("modules/Streamr/task.js");
import {Streamr} from './manifest.js';
Streamr.task_matches = ["*://*.streamr.com/*"];
Streamr.task = [
    {
        name: "LoginTask",
        description: "This item collects the result and duration of a login action in Streamr Editor",
        title: "Login Task",
		viewGroup: "task",
        is_enabled: true,
        startEvent:	{
			selector: "form.root_32zpi",   
			event_name: "submit"
		},
		endEvent: {
			selector: "window",   
			event_name: "load"
		},
        conditions: [
            {
                selector: "document", //Event.target
				property: "URL",
                operator: "=",
                value: "https://www.streamr.com/canvas/editor",
            }			
        ]
    }
];