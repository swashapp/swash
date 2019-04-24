console.log("modules/surfing/browsing.js");
import {Surfing} from './manifest.js';
Surfing.browsing_filter = {urls: ["<all_urls>"]};
Surfing.browsing_extraInfoSpec= [];
Surfing.browsing = [
    {
        name: "Page Visit",
        title: "Page visits",
		viewGroup: "UX",
        is_enabled: false,        
        description: "",
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "User experiense",
		viewGroup: "UX",
        is_enabled: false,
        description: "",
        target_listener: "inspectReferrer"
    },
    {
        name: "New Bookmark",
        title: "Create Bookmark",
		viewGroup: "UX",
        is_enabled: false,
        description: "",
        hook: "bookmarks"
    }
]