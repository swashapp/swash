console.log("modules/Streamr/devtools.js");
import {Streamr} from './manifest.js';
Streamr.devtools_matches = ["*://*.streamr.com/*"];
Streamr.devtools = [
	{
		name: "Status",
		title: "Status Code",
		viewGroup: "devtools",
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