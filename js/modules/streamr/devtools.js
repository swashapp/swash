console.log("modules/Streamr/devtools.js");
import {Streamr} from './manifest.js';
Streamr.devtools_matches = ["*://*.streamr.com/*"];
Streamr.devtools = [
	{
		name: "Status",
		title: "Status Code",
		viewGroup: "devtools",
        description: "Thist item collects all requests that have a status code not equal to 200 and not equal to 304",
		is_enabled: true,
		conditions: [
			{
				object: 'status',
				operator: '!=',
				value:	200
			},
			{
				object: 'status',
				operator: '!=',
				value:	304
			}
		]
	},
	{
		name: "Size",
		title: "Zero Size",
        description: "Thist item collects all requests that have a zero size response",
		viewGroup: "devtools",
		is_enabled: true,
		conditions: [
			{
				object: 'size',
				operator: '=',
				value:	0
			}
		]			
	},
	{
		name: "Time",
		title: "Long time",
        description: "Thist item collects all requests that take more than 2 second to respond",
		viewGroup: "devtools",
		is_enabled: true,
		conditions: [
			{
				object: 'time',
				operator: '>',
				value:	2000
			}
		]			
	}	
]