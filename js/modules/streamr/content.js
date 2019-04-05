console.log("modules/Streamr/content.js");
import {Streamr} from './manifest.js';
Streamr.content_matches = ["*://*.streamr.com/*"];
Streamr.content = [
    {
        name: "Errors",
        description: "",
        title: "Errors",
		viewGroup: "Debug",
        type: "event",
        is_enabled: true,
        events: [
            {
                selector: "",   // window
                event_name: "error"
            }
        ],
        objects: [
            {
                selector:"", //Event.CurrentTarget
                property: "location",
                name: "url",
				type: "url"
            },
            {
                selector:".", //Event.CurrentTarget
                property: "colno",
                name: "columnNumber",
				type: "text"
            },
            {
                selector:".", //Event.CurrentTarget
                property: "filename",
                name: "filename",
				type: "url"
            },
            {
                selector:".", //Event.CurrentTarget
                property: "lineno",
                name: "lineNumber",
				type: "text"
            },
            {
                selector:".", //Event.CurrentTarget
                property: "message",
                name: "MessageError",
				type: "text"
            }			
        ]
    },
    {
        name: "ConsoleErrors",
        description: "",
        title: "Console Errors",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    },
    {
        name: "ConsoleWarns",
        description: "",
        title: "Console Warnings",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    },
    {
        name: "ConsoleLogs",
        description: "",
        title: "Console Logs",
		viewGroup: "Debug",
        type: "log",
        is_enabled: true,
    }
];