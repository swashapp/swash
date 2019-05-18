console.log("modules/amazon/browsing.js");
import {Amazon} from './manifest.js';
Amazon.browsing_filter = {urls: ["https://www.amazon.com/*"]};
Amazon.browsing_extraInfoSpec= [];
Amazon.browsing = [   
    {
        name: "Page Visit",
		viewGroup: "UX",
        title: "Amazon visited pages",
        description: "This item collects all pages in Amazon that user has visited",
        target_listener: "inspectVisit",
        is_enabled: false
    },
    {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description: "This item collects all navigation that user do in Amazon web pages",
		viewGroup: "UX",
        target_listener: "inspectReferrer",
        is_enabled: true
    }

];
