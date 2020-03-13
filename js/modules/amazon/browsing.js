import {amazon} from './manifest.js';
amazon.browsing_filter = {urls: ["https://www.amazon.com/*", "https://www.amazon.de/*", "https://www.amazon.nl/*"]};
amazon.browsing_extraInfoSpec= [];
amazon.browsing = [   
    {
        name: "Page Visit",
		viewGroup: "UX",
        title: "Visited pages",
        description: "This item collects all pages in Amazon that user has visited",
        target_listener: "inspectVisit",
        is_enabled: true
    },
    {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description: "This item collects all navigations that user has done in Amazon web pages",
		viewGroup: "UX",
        target_listener: "inspectReferrer",
        is_enabled: true
    }

];
