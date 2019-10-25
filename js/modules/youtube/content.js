console.log("modules/youtube/content.js");
import {Youtube} from './manifest.js';
Youtube.content_matches = ["*://*.youtube.com/*"];
Youtube.content = [
    {
        name: "Video Time Duration",
        description: "This item collects the duration of a video watched by a user",
		url_match: "*://*.youtube.com/*",
        title: "video time duration",
		viewGroup: "UX",
        type: "event",
		readyAt: "windowChange",
        observingTargetNode: "#primary .title",
        observingConfig: { attributes: false, childList: true, subtree: true },
        is_enabled: true,
        events: [
            {
                selector: "window",   
                event_name: "beforeunload"
            },
			{
                selector: "a",   
                event_name: "click"
            }
        ],
        objects: [
            {
				isRequired: true,
                selector:"#primary .ytp-time-duration",
				properties:[
					{
						property: "innerHTML",
						name: "duration",
						type: "text"					
					}
				]
            },
            {
				isRequired: true,
                selector:"#primary .ytp-time-current",
				properties:[
					{
						property: "innerHTML",
						name: "current",
						type: "text"						
					}
				]
            },
            {
                selector:"#primary .title",
				properties:[
					{
						property: "innerText",
						name: "title",
						type: "text"						
					}
				]
            }
        ]
    }  
];