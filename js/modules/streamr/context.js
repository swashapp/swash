console.log("modules/Streamr/context.js");
import {Streamr} from './manifest.js';
Streamr.context_matches = ["*://*.streamr.com/*"];
Streamr.context = [
    {
        name: "agent",
        description: "",
        title: "User Agent",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
    {
        name: "installedPlugins",
        description: "",
        title: "installed Plugins",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"  
    },
    {
        name: "platform",
        description: "",
        title: "Platform",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
	{
        name: "screenshot",
        description: "",
        title: "Screenshot",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
    {
        name: "resolution",
        description: "",
        title: "Screen Resolution",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
        {
        name: "scroll",
        description: "",
        title: "Window Scroll",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
    {
        name: "windowSize",
        description: "",
        title: "Window Size",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
    {
        name: "cache",
        description: "",
        title: "Caches",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    }    
];