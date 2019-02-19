import {Youtube} from './manifest.js';
Youtube.browsing = [
    {
        name: "ajax_action",
        title: "",
        description: "",
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
    },
    {
        name: "search",
        title: "",
        description: "",
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
];
