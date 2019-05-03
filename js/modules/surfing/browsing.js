console.log("modules/surfing/browsing.js");
import {Surfing} from './manifest.js';
Surfing.browsing_filter = {urls: []};
Surfing.browsing_extraInfoSpec= [];
Surfing.browsing = [
    {
        name: "Page Visit",
        title: "Page visits",
		description: "This item collects all pages in all browser tabs that user has visited",
		viewGroup: "UX",
        is_enabled: false,                
        target_listener: "inspectVisit"
    },
    {
        name: "Visiting Graph",
        title: "User experience",
		description: "This item collects all navigation that user do in all web pages",
		viewGroup: "UX",
        is_enabled: false,       
        target_listener: "inspectReferrer"
    },
    {
        name: "New Bookmark",
        title: "Create Bookmark",
		description: "This item collects all bookmarks created by the user",
		viewGroup: "UX",
        is_enabled: false,        
        hook: "bookmarks"
    }
]