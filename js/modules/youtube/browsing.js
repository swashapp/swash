console.log("modules/youtube/browsing.js");
import {Youtube} from './manifest.js';
Youtube.browsing_filter = {urls: ["https://www.youtube.com/*"]};
Youtube.browsing_extraInfoSpec= ["blocking"];
Youtube.browsing = [
    {
        name: "ajax_action",
        title: "Page actions",
        description: "",
        patterns: [
        {
            method: "GET",
            url_pattern: /^https:\/\/www\.youtube\.com\/service_ajax.*/,
            pattern_type: "regex",
            param: [
                {
                    type: "query",
                    key: "name",
                    name: "action"
                }
            ]
        }
        ]
    },
    {
        name: "search",
        title: "Search",
        description: "",
        patterns: [
        {
            method: "GET",
            url_pattern: /^https:\/\/www\.youtube\.com\/results.*/,
            pattern_type: "regex",
            param: [
                {
                    type: "query",
                    key: "search_query",
                    name: "q"
                }
            ]
        }
    }
];
