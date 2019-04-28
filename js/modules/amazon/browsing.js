console.log("modules/amazon/browsing.js");
import {Amazon} from './manifest.js';
Amazon.browsing_filter = {urls: ["https://www.amazon.com/*"]};
Amazon.browsing_extraInfoSpec= [];
Amazon.browsing = [
    {
        name: "Search",
        title: "Amazon Search",
        description: "This item collects all search queries that user entered in Amazon search bar",
		viewGroup: "UX",
        is_enabled: true,
        patterns: [
            {
                method: "GET",
                url_pattern: "^https:\/\/www\.amazon\.com\/s\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "field-keywords",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "url",
                        name: "url"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"},				
					{jpath:"$.url",type:"url"}				                    
				]                
            },
            {
                method: "GET",
                url_pattern: "^https:\/\/www\.amazon\.com\/s\/.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "k",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "url",
                        name: "url"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"},				
					{jpath:"$.url",type:"url"}				                    
				]
                
            },
            {
                method: "GET",
                url_pattern: "^https:\/\/www\.amazon\.com\/s?.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "k",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "i",
                        name: "url"
                    }
                ],
				schems: [
					{jpath:"$.query",type:"text"},				
					{jpath:"$.url",type:"url"}				                    
				]
                
            }
        ]
    },
    {
        name: "Page Visit",
		viewGroup: "UX",
        title: "Amazon visited pages",
        description: "This item collects all pages in Amazon that user has visited",
        target_listener: "inspectVisit",
        is_enabled: true
    },
    {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description: "This item collects all navigation that user do in Amazon web pages",
		viewGroup: "UX",
        target_listener: "inspectReferrer",
        is_enabled: true
    }

];
