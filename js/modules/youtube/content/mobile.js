console.log("modules/youtube/content/mobile.js");
import {youtube} from '../manifest.js';
youtube.mobile = [
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
                selector:".time-second",
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
                selector:".time-first",
				properties:[
					{
						property: "innerHTML",
						name: "current",
						type: "text"						
					}
				]
            },
            {
                selector:".slim-video-metadata-title",
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