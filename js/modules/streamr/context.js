console.log("modules/Streamr/context.js");
import {Streamr} from './manifest.js';
Streamr.context_matches = ["*://*.streamr.com/*"];
Streamr.context = [
    {
        name: "agent",
        description: "This item collects User Browser Information",
        title: "User Agent",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
    {
        name: "installedPlugins",
        description: "This item collects all browser installed plugins",
        title: "installed Plugins",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"  
    },
    {
        name: "platform",
        description: "This item collects User operating system",
        title: "Platform",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
	    {
        name: "language",
        description: "This item collects default Browser language",
        title: "Browser Language",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
	{
        name: "proxyStatus",
        description: "This item collects browser proxy staus(is proxy enabled for http and dns requests or not)",
        title: "Proxy Status",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
	{
        name: "screenshot",
        description: "This item collects an screenshot of the user's browser tab that an specific event occured on",
        title: "Screenshot",
		viewGroup: "cta",
		is_enabled: true,
        type: "browser"
    },
    {
        name: "resolution",
        description: "This item collects User system resolution",
        title: "Screen Resolution",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
        {
        name: "scroll",
        description: "This item collects User Browser window X and Y scrolls",
        title: "Window Scroll",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
    {
        name: "windowSize",
        description: "This item collects User Browser window size",
        title: "Window Size",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    },
    {
        name: "cache",
        description: "This item collects cache items regarding a tab that an specific event occured on",
        title: "Caches",
		viewGroup: "cta",
		is_enabled: true,
        type: "content"
    }    
];