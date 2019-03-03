console.log("manifest.js");
var ssConfig = (function() {
    'use strict';
    
    return {
        name: browser.runtime.getManifest().name,        
        description: browser.runtime.getManifest().description,
        path: "/",
        is_enabled: true,
        homepage_url: browser.runtime.getManifest().homepage_url,
        version: browser.runtime.getManifest().version,
    };
}());
export {ssConfig};