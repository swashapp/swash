console.log("modules/surfing/browsing.js");
import {Surfing} from './manifest.js';
Surfing.browsing_filter = {urls: ["<all_urls>"]};
Surfing.browsing_extraInfoSpec= ["blocking"];
Surfing.browsing = [
    {
        name: "inspectVisit",
        title: "Page visit",
        description: "",
        target_listener: "inspectVisit"
    },
    {
        name: "inspectReferrer",
        title: "Page referer",
        description: "",
        target_listener: "inspectReferrer"
    },
    {
        name: "bookmarkCreate",
        title: "Bookmark create",
        description: "",
        hook: "bookmarks"
    }
]