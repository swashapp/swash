console.log("modules/Streamr/context.js");
import {Streamr} from './manifest.js';
Streamr.context_matches = ["*://*.streamr.com/*"];
Streamr.context = [
    {
        name: "agent",
        description: "",
        title: "User Agent",
		viewGroup: "cta",
        type: "browser"
    },
    {
        name: "installedPlugins",
        description: "",
        title: "installed Plugins",
		viewGroup: "cta",
        type: "browser"  
    },
    {
        name: "platform",
        description: "",
        title: "Platform",
		viewGroup: "cta",
        type: "browser"
    },
    {
        name: "resolution",
        description: "",
        title: "Screen Resolution",
		viewGroup: "cta",
        type: "browser"
    },
        {
        name: "scroll",
        description: "",
        title: "Window Scroll",
		viewGroup: "cta",
        type: "browser"
    },
    {
        name: "windowSize",
        description: "",
        title: "Window Size",
		viewGroup: "cta",
        type: "browser"
    },
    {
        name: "cache",
        description: "",
        title: "Caches",
		viewGroup: "cta",
        type: "browser"
    }    
];