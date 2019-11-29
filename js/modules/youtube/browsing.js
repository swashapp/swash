console.log("modules/youtube/browsing.js");
import {youtube} from './manifest.js';
youtube.browsing_filter = {urls: ["https://www.youtube.com/*"]};
youtube.browsing_extraInfoSpec= [];
youtube.browsing = [
    {
        name: "Page Action",
        title: "Page actions",
		viewGroup: "UX",
        is_enabled: true,
        description: "This item collects all actions a user does in Youtube pages",
        extraInfoSpec: ["requestBody"],        
        patterns: [
			{
				method: "POST",
				url_pattern: "^https:\\/\\/www\\.youtube\\.com\\/service_ajax.*",
				pattern_type: "regex",
				param: [
					{
						type: "query",
						key: "name",
						name: "action"
					},
					{
						type: "form",
						key: "sej",
						name: "detail"
					}                                        
				],
				schems: [
					{jpath:"$.action",type:"text"},
                    {jpath:"$.detail",type:"text"}
				]                
			}
        ]
    },
    {
        name: "Search",
        title: "Youtube Search",
		viewGroup: "UX",
        is_enabled: true,        
        description: "This item collect all search queries that a user enters in Youtube search bar",
        patterns: [
			{
				method: "GET",
				url_pattern: "^https:\\/\\/www\\.youtube\\.com\\/results.*",
				pattern_type: "regex",
				param: [
					{
						type: "query",
						key: "search_query",
						name: "q"
					}
				],
				schems: [
					{jpath:"$.q",type:"text"}				
				]                
			}
		]
    }
];
