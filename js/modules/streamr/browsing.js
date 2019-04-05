console.log("modules/streamr/browsing.js");
import {Streamr} from './manifest.js';
Streamr.browsing_filter = {urls: ["https://*.streamr.com/*"]};
Streamr.browsing_extraInfoSpec= [];
Streamr.browsing = [
    {
        name: "PageNotFound",
        title: "Page Not Found",
		viewGroup: "Debug",
        hook: "response",
        description: "", 
        pattern: [
            {
                statusCode: 404
            }
        ],
        is_enabled: true
    },
    {
        name: "InternalSeverError",
        title: "Internal Server Error",
		viewGroup: "Debug",
        hook: "response",
        description: "",
        pattern: [
            {
                statusCode: 500
            }
        ],
        is_enabled: true
    }
];
