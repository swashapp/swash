console.log("modules/amazon/browsing.js");
import {Amazon} from './manifest.js';
Amazon.browsing_filter = {urls: ["https://www.amazon.com/*"]};
Amazon.browsing_extraInfoSpec= ["blocking"];
Amazon.browsing = [
    {
        name: "search1",
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
        name: "search2",
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
        name: "search3",
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
