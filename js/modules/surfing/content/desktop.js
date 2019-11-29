console.log("modules/surfing/content/desktop.js");
import {surfing} from '../manifest.js';
surfing.desktop = [
	{
        name: "pageInfo",
        description: "This item collects information about the page being visited",
		viewGroup: "PInfo",
        title: "Page Information",
		url_match: "*://*/*",
        type: "event",        
        is_enabled: true,
        events: [
            {
                selector: "window",
                event_name: "DOMContentLoaded"
            }
        ],
        objects: [
            {
                selector:"title",
                properties: [
                    {                        
                        property: "innerText",
                        name: "title",
                        type: "text"
                    }
                ]
            },
			{
                selector:"document",
                properties: [
                    {     
						selector: "meta[name=title]",
                        property: "content",
                        name: "meta-title",
                        type: "text"
                    },
					{
						selector: "meta[name=description]",
                        property: "content",
                        name: "meta-description",
                        type: "text"
                    },
					{
                        property: "URL",
                        name: "location",
                        type: "url"
                    }
                ]
            }
		]
    }	
];