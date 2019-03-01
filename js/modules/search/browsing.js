console.log("modules/search/browsing.js");
import {Search} from './manifest.js';
Search.browsing_filter = {urls: ["*://www.bing.com/*", "*://*.yahoo.com/*", "*://www.google.com/search?*", 
        "*://search.aol.com/aol/*", "*://www.ask.com/*", "*://*.baidu.com/*"]};
Search.browsing_extraInfoSpec= ["blocking"];
Search.browsing = [
    {
        name: "bing",
        title: "Bing.com",
        is_enabled: true,        
        description: "",
        filter: {urls: ["*://www.bing.com/*"]},		
        patterns: [
        {
            method: "GET",
            url_pattern: /https:\/\/www\.bing\.com\/(([^\/\?\;]*)\/search)\?.*/,
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
            ]
        },{
            method: "GET",
            url_pattern: /https:\/\/www\.bing\.com\/(shop|maps|search)\?.*/,
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
            ]
        }
        ]
    },{
        name: "Yahoo",
        title: "Yahoo.com",
        is_enabled: true,        
        description: "",
        filter: {urls: ["*://*.yahoo.com/*"]},		
        patterns: [
        {
            method: "GET",
            url_pattern: /https:\/\/((.*)\.)?search\.yahoo\.com\/.*/,
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
            ]
        }
        ]
    },{
        name: "Google",
        title: "Google.com",
        is_enabled: true,        
        description: "",
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
            ]
        }
        ]
    },{
        name: "AOL",
        title: "AOL.com",
        is_enabled: true,        
        description: "",
        filter: {urls: ["*://search.aol.com/aol/*"]},		
        patterns: [
        {
            method: "GET",
            url_pattern: /https:\/\/search\.aol\.com\/aol\/([^\/\?\;]*)[\?|\;].*/,
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
            ]
        }
        ]
    },{
        name: "Ask",
        title: "Ask.com",
        is_enabled: true,        
        description: "",
        filter: {urls: ["*://www.ask.com/*"]},		
        patterns: [
        {
            method: "GET",
            url_pattern: /https:\/\/www\.ask\.com\/(web|youtube)\?.*/,
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
            ]
        }
        ]
    },{
        name: "Baidu",
        title: "Baidu.com",
        is_enabled: true,        
        description: "",
		filter: {urls: ["*://*.baidu.com/*"]},		
        patterns: [
        {
            method: "GET",        
            url_pattern: /http[s]?:\/\/(.*)\.baidu\.com\/.*/,
            pattern_type: "regex",
            param: [
                {
                    type: "query",
                    key: "wd",
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
            ]
        }
        ]
    },
];