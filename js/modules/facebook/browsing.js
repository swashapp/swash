console.log("modules/facebook/browsing.js");
import {Facebook} from './manifest.js';
Facebook.browsing_filter = {urls: ["https://www.facebook.com/*"]};
Facebook.browsing_extraInfoSpec= ["blocking"];
Facebook.browsing = [
    {
        name: "Search",
        title: "Facebook Search",
        description: "",
        patterns: [
            {
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
            },{
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
            },{
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
            },{
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
            },{
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
            }
        ]
    },
    {
        name: "Page Visit",
        title: "Links clicked by user",
        is_enabled: true,
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "User experience",
        is_enabled: true,        
        target_listener: "inspectReferrer"
    }
];