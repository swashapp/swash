var ssConfig = (function() {
    'use strict';
    
    return {
        name: browser.runtime.getManifest().name,        
        description: "Get paid for your data as you browse the web. Gain control and help create a better, more dignified internet.",
        path: "/",
        is_enabled: true,
		privacyLevel: 'auto',
        homepage_url: browser.runtime.getManifest().homepage_url,
        version: browser.runtime.getManifest().version,
    };
}());
export {ssConfig};