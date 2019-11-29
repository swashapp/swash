console.log("modules/facebook/browsing.js");
import {facebook} from './manifest.js';
facebook.browsing_filter = {urls: ["https://www.facebook.com/*"]};
facebook.browsing_extraInfoSpec= [];
facebook.browsing = [
    {
        name: "Search",
        title: "Facebook Search",
        description: "This item collects all search queries that a user has entered on Facebook search bar",
		viewGroup: "UX",
		is_enabled: true,
        patterns: [
            {
                method: "GET",
                url_pattern: "^https:\\/\\/www\\.facebook\\.com\\/search\\/top\\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"}				
				]                
            }
        ]
    },
    {
        name: "Page Visit",
        title: "Links clicked by user",
        description: "This item collects all pages in Facebook that a user has visited",
		viewGroup: "UX",
        is_enabled: true,
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description: "This item collects all navigations that a user does in Facebook web pages",
		viewGroup: "UX",
        is_enabled: true,        
        target_listener: "inspectReferrer"
    }
];