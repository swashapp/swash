console.log("modules/youtube/browsing.js");
import {Youtube} from './manifest.js';
Youtube.browsing_filter = {urls: ["https://www.youtube.com/*"]};
Youtube.browsing_extraInfoSpec= ["blocking"];
Youtube.browsing = [
    {
        name: "Page Action",
        title: "Page actions",
        is_enabled: true,
        description: "",
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
        is_enabled: true,        
        description: "",
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
