console.log("modules/facebook/browsing.js");
import {Facebook} from './manifest.js';
Facebook.browsing_filter = {urls: ["https://www.facebook.com/*"]};
Facebook.browsing_extraInfoSpec= [];
Facebook.browsing = [
    {
        name: "Search",
        title: "Facebook Search",
        description: "This item collects all search queries that user entered in Facebook search bar",
		viewGroup: "UX",
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
            },{
                method: "GET",
                url_pattern: "^https:\\/\\/www\\.facebook\\.com\\/search\\/str\\/([^\\/]*)\\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "regex",
                        group: 1,
                        name: "query"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"}				
				]                
            },{
                method: "GET",
                url_pattern: "^https:\\/\\/www.facebook.com\\/typeahead\\/search\\/facebar\\/query\\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "value",
                        name: "query"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"}				
				]                
            },{
                method: "GET",
                url_pattern: "^https:\\/\\/www\\.facebook\\.com\\/search\\/browse\\/warm\\/requestargs\\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "query",
                        name: "query"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"}				
				]                
            },{
                method: "GET",
                url_pattern: "^https:\\/\\/www\\.facebook\\.com\\/search\\/facebar_survey\\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "query",
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
        description: "This item collects all pages in Facebook that user has visited",
		viewGroup: "UX",
        is_enabled: true,
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description: "This item collects all navigation that user do in Amazon web pages",
		viewGroup: "UX",
        is_enabled: true,        
        target_listener: "inspectReferrer"
    }
];