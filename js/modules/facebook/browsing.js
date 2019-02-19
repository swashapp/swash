import {Facebook} from './manifest.js';
Facebook.browsing = [
    {
        name: "search_top",
        title: "",
        description: "",
        
        method: "GET",
        url_pattern: /^https:\/\/www\.facebook\.com\/search\/top\/.*/,
        pattern_type: "regex",
        param: [
            {
                type: "query",
                key: "q",
                name: "query"
            }
        ]
    },
    {
        name: "search_str",
        title: "",
        description: "",
        
        method: "GET",
        url_pattern: /^https:\/\/www\.facebook\.com\/search\/str\/([^\/]*)\/.*/,
        pattern_type: "regex",
        param: [
            {
                type: "regex",
                group: 1,
                name: "query"
            }
        ]
    },
    {
        name: "search_facebar",
        title: "",
        description: "",
        
        method: "GET",
        url_pattern: /^https:\/\/www.facebook.com\/typeahead\/search\/facebar\/query\/.*/,
        pattern_type: "regex",
        param: [
            {
                type: "query",
                key: "value",
                name: "query"
            }
        ]
    },
    {
        name: "search_warm",
        title: "",
        description: "",
        
        method: "GET",
        url_pattern: /^https:\/\/www\.facebook\.com\/search\/browse\/warm\/requestargs\/.*/,
        pattern_type: "regex",
        param: [
            {
                type: "query",
                key: "query",
                name: "query"
            }
        ]
    },
    {
        name: "search_survey",
        title: "",
        description: "",
        
        method: "GET",
        url_pattern: /^https:\/\/www\.facebook\.com\/search\/facebar_survey\/.*/,
        pattern_type: "regex",
        param: [
            {
                type: "query",
                key: "query",
                name: "query"
            }
        ]
    },
    {
        name: "inspectVisit",
        target_listener: "inspectVisit"
    },
    {
        name: "inspectReferrer",
        target_listener: "inspectReferrer"
    }

];