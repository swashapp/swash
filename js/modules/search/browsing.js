import {Search} from './manifest.js';
Search.browsing = [
    {
        name: "bing1",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://www.bing.com/*",
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
        name: "bing2",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://www.bing.com/*",
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
    },{
        name: "Yahoo",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://*.yahoo.com/*",
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
    },{
        name: "Google",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://www.google.com/search?*",
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
    },{
        name: "AOL",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://search.aol.com/aol/*",
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
    },{
        name: "Ask",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://www.ask.com/*",
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
    },{
        name: "Baidu",
        title: "",
        description: "",
        
        method: "GET",
        url_filter: "*://*.baidu.com/*",
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
    },
];