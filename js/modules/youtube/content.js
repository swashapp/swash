console.log("modules/youtube/content.js");
import {Youtube} from './manifest.js';
Youtube.content_matches = ["*://*.youtube.com/*"];
Youtube.content = [
    {
        name: "Video Time Duration",
        description: "",
		url_match: "*://*.youtube.com/*",
        title: "video time duration",
		viewGroup: "UX",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "window",   
                event_name: "beforeunload"
            }
        ],
        objects: [
            {
                selector:".ytp-time-duration",
				properties:[
					{
						property: "innerHTML",
						name: "duration",
						type: "text"					
					}
				]
            },
            {
                selector:".ytp-time-current",
				properties:[
					{
						property: "innerHTML",
						name: "current",
						type: "text"						
					}
				]
            },
            {
                selector:"title",
				properties:[
					{
						property: "innerHTML",
						name: "page_title",
						type: "text"						
					}
				]
            }
        ]
    }  
];