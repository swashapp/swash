console.log("modules/surfing/browsing.js");
import {Surfing} from './manifest.js';
Surfing.browsing_filter = {urls: ["<all_urls>"]};
Surfing.browsing_extraInfoSpec= ["blocking"];
Surfing.browsing = [
    {
        name: "inspectVisit",
        title: "Page visits",
        is_enabled: true,        
        description: "",
        target_listener: "inspectVisit"
    },
    {
        name: "inspectReferrer",
        title: "User experiense",
        is_enabled: true,
        description: "",
        target_listener: "inspectReferrer"
    },
    {
        name: "bookmarkCreate",
        title: "Create Bookmark",
        is_enabled: true,
        description: "",
        hook: "bookmarks"
    }
]