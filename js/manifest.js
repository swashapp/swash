console.log("manifest.js");
var ssConfig = (function() {
    'use strict';
    
    return {
        name: browser.runtime.getManifest().name,        
        description: "Swash is a Streamr Community Product that collects information about users browsing activities and gives users the ability to sell their data through Streamr Marketplace",
        path: "/",
        is_enabled: true,
		privacyLevel: 1,
        homepage_url: browser.runtime.getManifest().homepage_url,
        version: browser.runtime.getManifest().version,
    };
}());
export {ssConfig};