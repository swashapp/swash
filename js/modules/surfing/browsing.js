console.log("modules/surfing/browsing.js");
import {Surfing} from './manifest.js';
Surfing.browsing_filter = {urls: ["<all_urls>"]};
Surfing.browsing_extraInfoSpec= ["blocking"];
Surfing.browsing = [
    {
        name: "Page Visit",
        title: "Page visits",
        is_enabled: true,        
        description: "",
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "User experiense",
        is_enabled: true,
        description: "",
        target_listener: "inspectReferrer"
    },
    {
        name: "New Bookmark",
        title: "Create Bookmark",
        is_enabled: true,
        description: "",
        hook: "bookmarks"
    }
]