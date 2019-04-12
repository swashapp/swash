console.log("modules/Streamr/task.js");
import {Streamr} from './manifest.js';
Streamr.task_matches = ["*://*.streamr.com/*"];
Streamr.task = [
    {
        name: "LoginTask",
        description: "",
        title: "Login Task",
		viewGroup: "task",
        is_enabled: true,
        startEvent:	{
			selector: "form.root_32zpi",   // window
			event_name: "submit"
		},
		endEvent: {
			selector: "",   // window
			event_name: "load"
		},
        conditions: [
            {
                selector: "", //Event.CurrentTarget
				property: "location.href",
                operator: "=",
                value: "https://www.streamr.com/canvas/editor",
            }			
        ]
    }
];