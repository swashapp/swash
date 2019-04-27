console.log("modules/Streamr/content.js")
import {Streamr} from './manifest.js';
Streamr.content_matches = ["*://*.streamr.com/*"]
Streamr.content = [
    {
        name: "Errors",
        description: "",
		url_match: "*://*.streamr.com/*",
        title: "Errors",
		viewGroup: "Debug",
        type: "event",
        is_enabled: true,
        events: [
            {
                selector: "window",  
                event_name: "error"
            }
        ],
        objects: [
            {
                selector:"", //Event.CurrentTarget
				properties:[
					{
						property: "location",
						name: "url",
						type: "url"						
					}
				]
            },
            {
                selector:".", //Event.CurrentTarget
				properties:[
					{
						property: "colno",
						name: "columnNumber",
						type: "text"						
					},			
					{
						property: "filename",
						name: "filename",
						type: "url"						
					},
					{
						property: "lineno",
						name: "lineNumber",
						type: "text"
					},
					{
						property: "message",
						name: "MessageError",
						type: "text"
					}			
				]
			}
		]
    },
    {
        name: "ConsoleErrors",
		url_match: "*://*.streamr.com/*",
        description: "",
        title: "Console Errors",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    },
    {
        name: "ConsoleWarns",
		url_match: "*://*.streamr.com/*",
        description: "",
        title: "Console Warnings",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    },
    {
        name: "ConsoleLogs",
		url_match: "*://*.streamr.com/*",
        description: "",
        title: "Console Logs",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    }
];