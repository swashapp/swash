console.log("modules/amazon/browsing.js");
import {Amazon} from './manifest.js';
Amazon.browsing_filter = {urls: ["https://www.amazon.com/*"]};
Amazon.browsing_extraInfoSpec= ["blocking"];
Amazon.browsing = [
    {
        name: "search",
        title: "Amazon Search",
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
                ]
            }
        ]
    },
    {
        name: "inspectVisit",
        title: "Amazon visited pages",
        target_listener: "inspectVisit",
        is_enabled: true
    },
    {
        name: "inspectReferrer",
        title: "User experience",
        target_listener: "inspectReferrer",
        is_enabled: true
    }

];
