import {search} from './manifest.js';
search.browsing_filter = {urls: ["*://www.bing.com/*", "*://*.yahoo.com/*", "*://www.google.com/search?*", 
        "*://search.aol.com/aol/*", "*://www.ask.com/*", "*://*.baidu.com/*"]};
search.browsing_extraInfoSpec= [];
search.browsing = [
    {
        name: "bingQuery",
        title: "Search Query",
		viewGroup: "Bing",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in Bing search bar",
        filter: {urls: ["*://www.bing.com/*"]},		
        patterns: [
            {
                method: "GET",
                url_pattern: "https:\\/\\/www\\.bing\\.com\\/(([^\\/\\?\\;]*)\\/search)\\?.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 2,
                        name: "category"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]           
            },{
                method: "GET",
                url_pattern: "https:\\/\\/www\\.bing\\.com\\/(shop|maps|search)\\?.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 1,
                        name: "category"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "yahooQuery",
        title: "Search Query",
		viewGroup: "Yahoo",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in Yahoo search bar",
        filter: {urls: ["*://*.yahoo.com/*"]},		
        patterns: [
            {
                method: "GET",
                url_pattern: "https:\\/\\/((.*)\\.)?search\\.yahoo\\.com\\/search.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "p",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 2,
                        name: "category",
                        default: "web"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "googleQuery",
        title: "Search Query",
		viewGroup: "Google",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in Google search bar",
        filter: {urls: ["*://www.google.com/search?*"]},		
        patterns: [
            {
                method: "GET",
                url_pattern: "*://www.google.com/search?*",
                pattern_type: "wildcard",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "tbm",
                        name: "category",
                        default: "web"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "aolQuery",
        title: "Search Query",
		viewGroup: "AOL",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in AOL search bar",
        filter: {urls: ["*://search.aol.com/aol/*"]},		
        patterns: [
            {
                method: "GET",
                url_pattern: "https:\\/\\/search\\.aol\\.com\\/aol\\/([^\\/\\?\\;]*)[\\?|\\;].*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 1,
                        name: "category"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "askQuery",
        title: "Search Query",
		viewGroup: "Ask",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in Ask search bar",
        filter: {urls: ["*://www.ask.com/*"]},		
        patterns: [
            {
                method: "GET",
                url_pattern: "https:\\/\\/www\\.ask\\.com\\/(web|youtube)\\?.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 1,
                        name: "category"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "baiduQuery",
        title: "Search Query",
		viewGroup: "Baidu",
        is_enabled: false,        
        description: "This item collects all search queries that a user enter in Baidu search bar",
		filter: {urls: ["*://*.baidu.com/*"]},		
        patterns: [
            {
                method: "GET",        
                url_pattern: "http[s]?:\\/\\/(.*)\\.baidu\\.com\\/([sfqim]\\?|sf\\/|search).*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "wd",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "kw",
                        name: "query"
                    },
                    {
                        type: "query",
                        key: "word",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 1,
                        name: "category"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            }
        ]
    },{
        name: "duckduckgoQuery",
        title: "Search Query",
		viewGroup: "DuckDuckGo",
        is_enabled: true,        
        description: "This item collects all search queries that a user enter in DuckduckGo search bar",
		filter: {urls: ["*://duckduckgo.com/*"]},		
        patterns: [
            {
                method: "GET",        
                url_pattern: "https:\\/\\/duckduckgo\\.com\\/((i|news|v)\\.js)?\\?.*",
                pattern_type: "regex",
                param: [
                    {
                        type: "query",
                        key: "q",
                        name: "query"
                    },
                    {
                        type: "regex",
                        group: 2,
                        name: "category",
						default: "web"
                    }
                ],
                schems: [
                    {jpath:"$.query",type:"text"},		
                    {jpath:"$.category",type:"text"}				                    
                ]            
            },
			
        ]
    },
];